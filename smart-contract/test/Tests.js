const { expect } = require("chai");
const { ethers } = require("hardhat");

let registry, charity, voting, token, treasury;

let deployer, user;

async function setup() {
  // Deploy contracts
  let registry = await (await ethers.getContractFactory("GovernanceRegistry")).deploy();
  let charity = await (await ethers.getContractFactory("GovernanceCharity")).deploy(registry.address);

  let mockToken = await (await ethers.getContractFactory("MockERC20")).deploy();
  let voting = await (await ethers.getContractFactory("GovernanceVoting")).deploy("GOV", registry.address, mockToken.address);
  let token = await (await ethers.getContractFactory("GovernanceToken")).deploy(registry.address);
  let tokenRegistry = await(await ethers.getContractFactory("TokenRegistry")).deploy();

  let treasury = await(await ethers.getContractFactory("GovernanceTreasury")).deploy(registry.address);

  // Set registry addresses
  await registry.init(token.address, charity.address, voting.address, treasury.address, tokenRegistry.address);
  return [registry, charity, voting, token, treasury];
}

describe("Contract Tests", function() {
  before(async function() {
    [deployer, user] = await ethers.getSigners();
    [registry, charity, voting, token, treasury] = await setup();
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
  });

  
});
