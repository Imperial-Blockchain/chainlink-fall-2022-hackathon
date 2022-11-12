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
      expect(registry.connect(user).setGovernanceTreasury(newVoting.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  
});
