const { expect } = require("chai");
const { ethers } = require("hardhat");
const { setBalance, time } = require("@nomicfoundation/hardhat-network-helpers");


let registry, charity, voting, token, treasury, tokenRegistry, mockToken, mockOracle;

const decimals = 18//ethers.utils.parseUnits('1', '18');
const amount = ethers.utils.parseUnits('1', decimals);
const price = ethers.utils.parseUnits('2', decimals);

let deployer, user, alice;

async function setup() {
  // Deploy contracts
  let registry = await (await ethers.getContractFactory("GovernanceRegistry")).deploy();
  let charity = await (await ethers.getContractFactory("GovernanceCharity")).deploy(registry.address);

  let mockToken = await (await ethers.getContractFactory("MockERC20")).deploy(decimals);
  let voting = await (await ethers.getContractFactory("GovernanceVoting")).deploy("GOV", registry.address, mockToken.address);
  let token = await (await ethers.getContractFactory("GovernanceToken")).deploy(registry.address);
  let tokenRegistry = await(await ethers.getContractFactory("TokenRegistry")).deploy();

  await tokenRegistry.add(mockToken.address);
  await tokenRegistry.add(ethers.constants.AddressZero);

  let treasury = await(await ethers.getContractFactory("GovernanceTreasury")).deploy(registry.address);

  // Deploy mockOracle
  let mockOracle = await (await ethers.getContractFactory("MockOracle")).deploy();
  await mockOracle.setDecimals(decimals);
  await mockOracle.setPrice(price);

  await treasury.setPriceFeed(mockToken.address, mockOracle.address);

  // Set registry addresses
  await registry.init(token.address, charity.address, voting.address, treasury.address, tokenRegistry.address);
  return [registry, charity, voting, token, treasury, tokenRegistry, mockToken, mockOracle];
}

describe("Contract Tests", function() {
  before(async function() {
    [deployer, user, alice] = await ethers.getSigners();
    [registry, charity, voting, token, treasury, tokenRegistry, mockToken, mockOracle] = await setup();
  });

  describe("Governance Registry", function() {
    it("Fetch Charity", async function() {
      expect(await registry.governanceCharity()).to.be.equal(charity.address);
    });
    it("Fetch Voter", async function() {
      expect(await registry.governanceVoter()).to.be.equal(voting.address);
    });
    it("Modify Treasury as Owner", async function() {
      let newVoting = await (await ethers.getContractFactory("GovernanceTreasury")).deploy(registry.address);
      await registry.setGovernanceTreasury(newVoting.address);

      expect(await registry.governanceTreasury()).to.be.equal(newVoting.address);

      //Reset for future tests
      await registry.setGovernanceTreasury(treasury.address);
    });
    it("Modify Treasury as User", async function() {
      let newVoting = await (await ethers.getContractFactory("GovernanceTreasury")).deploy(registry.address);
      await expect(registry.connect(user).setGovernanceTreasury(newVoting.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  describe("Governance Charity", function() {
    it("Register as a new charity", async function() {
      // Make sure our entry is 0
      expect(await charity.statusOf(user.address)).to.equal(0);
      
      let proof = ethers.utils.randomBytes(10);
      await expect(charity.connect(user).register(proof)).to.emit(charity, "Registered")
      .withArgs(user.address, proof);

      // If we try to register again, we should fail
      await expect(charity.connect(user).register(proof))
      .to.be.revertedWith("Already registered");

      // Make sure our entry has been modified
      expect(await charity.statusOf(user.address)).to.equal(1);
    });
    it("Verify Charity", async function() {
      //If we try to verify as not owner
      await expect(charity.connect(user).verify(user.address))
      .to.be.revertedWith("Ownable: caller is not the owner");

      //Verify user
      await expect(charity.verify(user.address))
      .to.emit(charity, "Verified")
      .withArgs(user.address);

      //Verify address which has not registerd
      await expect(charity.verify(ethers.constants.AddressZero))
      .to.be.revertedWith("Not registered");

      expect(await charity.statusOf(user.address)).to.equal(2);
    });
  });
  describe("Governance Treasury", function() {
    before(async function() {
      //Increase user's balance and mint tokens
      await setBalance(user.address, amount);
      await mockToken.mint(user.address, amount);
      
      expect(await mockToken.balanceOf(user.address)).to.be.equal(amount);
      expect(await ethers.provider.getBalance(user.address)).to.be.equal(amount);
    });
    it("Deposit User Funds with ETH", async function() {
      //Deposit funds
      await treasury.connect(user).deposit(ethers.constants.AddressZero, 0, {value: amount.div(2)});
      expect(await token.balanceOf(user.address)).to.be.equal(amount.div(2));
    });
    it("Deposit User Funds with ERC20", async function() {
      //Get current token balance of user
      const currentBalance = await token.balanceOf(user.address);
      const oneToken = ethers.utils.parseUnits('1', decimals)

      //Approve spending
      await mockToken.connect(user).increaseAllowance(treasury.address, amount);
      await treasury.connect(user).deposit(mockToken.address, amount.div(2));

      expect(await token.balanceOf(user.address)).to.be.equal(currentBalance.add(amount.div(2).mul(oneToken).div(price)));

      
    });
    it("Deposit User Funds with ERC20 and Non-Standard Decimal for Oracle", async function () {
      const currentBalance = await token.balanceOf(user.address);
      const newDecimals = 10;
      const oneToken = ethers.utils.parseUnits('1', newDecimals);
      const price = ethers.utils.parseUnits('10', newDecimals);

      await mockOracle.setDecimals(newDecimals);
      await mockOracle.setPrice(price);

      await treasury.connect(user).deposit(mockToken.address, amount.div(2));
      expect(await token.balanceOf(user.address)).to.be.equal(currentBalance.add(amount.div(2).mul(oneToken).div(price)));

      await mockOracle.setDecimals(decimals);
      await mockOracle.setPrice(ethers.utils.parseUnits('2', decimals));
    });
    it("Deposit User Funds with ERC20 with Non-standard Decimal", async function () {
      const a = ethers.utils.parseUnits('1', 20)
      //Deploy a new ERC20 token
      const newToken = await (await ethers.getContractFactory('MockERC20')).deploy(20);
      await newToken.mint(alice.address, a);
      //check what happens if we try to deposit with a non-approved token
      await expect(treasury.connect(alice).deposit(newToken.address, 0))
      .to.be.revertedWith("Invalid token address");
      
      await tokenRegistry.add(newToken.address);
      await treasury.setPriceFeed(newToken.address, mockOracle.address);

      //approvals
      await newToken.connect(alice).increaseAllowance(treasury.address, a);

      await treasury.connect(alice).deposit(newToken.address, a);

      const calc = a.div(10 ** (20 - 18)).mul(amount).div(price)

      expect(await token.balanceOf(alice.address)).to.be.equal(calc);


    });
  });
  describe("Governance Voting", function() {
    it("Start Proposal", async function() {
      let blockNumber = await ethers.provider.getBlockNumber();
      let delay = await voting.votingDelay();
      let period = await voting.votingPeriod();
      let timestamp = (await ethers.provider.getBlock(blockNumber)).timestamp + 10;


      await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp])
      

      // Create a new proposal
      await expect(voting.connect(user).propose("Initial Epoch"))
      .to.emit(voting, "ProposalCreated")
      .withArgs(timestamp, user.address, delay.add(timestamp), delay.add(period.add(timestamp)), "Initial Epoch");
    
      //Create another proposal while the current one is running
      await expect(voting.connect(user).propose("New Epoch"))
      .to.be.revertedWith("Proposal is already running");

    });
    it("Request Funding from Charity", async function() {

      let epoch = await voting.currentEpoch();
      await expect(charity.connect(user).requestFunding(amount))
      .to.emit(charity, "RequestedFunding")
      .withArgs(user.address, amount, epoch); 

      let entry = await voting.charityVotes(epoch, user.address);
      expect(entry.charity).to.be.equal(user.address)
      expect(entry.amount).to.be.equal(amount);

    });
    it("Cancel Funding from Charity", async function() {
      await expect(charity.connect(user).cancelRequest())
      .to.emit(charity, "CancelledFunding")
      .withArgs(user.address);

      let epoch = await voting.currentEpoch();
      let entry = await voting.charityVotes(epoch, user.address);

      expect(entry.charity).to.be.equal(ethers.constants.AddressZero);
      expect(entry.amount).to.be.equal(0);


      //Request funding again so everything else works
      await charity.connect(user).requestFunding(amount);
    });
    it("Vote for the wrong proposal", async function() {

      let epoch = await voting.currentEpoch();

      await expect(voting.connect(alice).castVote(epoch.add(1), user.address))
      .to.be.revertedWith("Voting for invalid proposal");
    });
    it("Vote before voting starts", async function() {
      let epoch = await voting.currentEpoch();

      await expect(voting.connect(alice).castVote(epoch, user.address))
        .to.be.revertedWith("Not active proposal");

      expect(await voting.state(epoch)).to.be.equal(1);
    });
    it("Cast Valid Vote", async function() {
      // Go forward in time until we can start voting
      let epoch = await voting.currentEpoch();
      let delay = await voting.votingDelay();
      let period = await voting.votingPeriod();

      await time.increaseTo(epoch.add(delay));

      let balance = await token.balanceOf(alice.address);

      //Alice approves voting to use their tokens
      await token.connect(alice).increaseAllowance(voting.address, balance);

      //Cast VOte
      await expect(voting.connect(alice).castVote(epoch, user.address))
      .to.emit(voting, "VoteCast")
      .withArgs(alice.address, epoch, user.address, balance, "");

      let entry = await voting.charityVotes(epoch, user.address);
      expect(entry.votes).to.be.equal(balance);

    });
    it("Cast Vote with no balance", async function() {
      let epoch = await voting.currentEpoch();
      expect(await token.balanceOf(deployer.address)).to.be.equal(0);

      await expect(voting.connect(deployer).castVote(epoch, user.address))
        .to.be.revertedWith("No votes to vote with");
    });
    it("Vote with second user", async function() {
      let epoch = await voting.currentEpoch();
      let currentVotes = (await voting.charityVotes(epoch, user.address)).votes;

      let balance = await token.balanceOf(user.address);

      await token.connect(user).increaseAllowance(voting.address, balance);
      await voting.connect(user).castVote(epoch, user.address);

      let entry = await voting.charityVotes(epoch, user.address);

      expect(entry.votes).to.be.equal(currentVotes.add(balance));
    });
    it("Execute Proposal", async function() {
      let epoch = await voting.currentEpoch();
      
      //Try to execute proposal before voting finishes
      await expect(voting.execute(epoch))
      .to.be.revertedWith("Governor: proposal not successful");

      //Fast forward in time
      let delay = await voting.votingDelay();
      let period = await voting.votingPeriod();

      await time.increaseTo(epoch.add(delay).add(period).add(1));

      //We should be in the queued state
      expect(await voting.state(epoch)).to.be.equal(3);

      //Execute the proposal
      await expect(voting.execute(epoch))
      .to.emit(treasury, "SentFunds")
      .withArgs(mockToken.address, user.address, amount, epoch);


      //Make sure a new proposal has started
      const newEpoch = await voting.currentEpoch();
      expect(newEpoch).to.not.be.equal(epoch);
      expect(await voting.state(newEpoch)).to.be.equal(1);

      //Make sure charity has been paid
      expect(await mockToken.balanceOf(user.address)).to.be.equal(amount);
    });
  });

  
});
