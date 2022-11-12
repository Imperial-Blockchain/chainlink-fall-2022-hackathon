import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains } from "../utils/const";
import { ethers } from "hardhat";
import { GovernanceRegistry } from "../typechain-types";

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre;
    const { log } = deployments;
    const { deployer } = await getNamedAccounts();
    const registry: GovernanceRegistry = await ethers.getContract("GovernanceRegistry", deployer);
    const token = await ethers.getContract("GovernanceToken", deployer);
    const charity = await ethers.getContract("GovernanceCharity", deployer);
    const voting = await ethers.getContract("GovernanceVoting", deployer);
    const treasury = await ethers.getContract("GovernanceTreasury", deployer);

    log("Setting up contracts for roles...");
    const initTx = await registry.init(
        token.address,
        charity.address,
        voting.address,
        treasury.address
    );
    await initTx.wait(1);
};

export default setupContracts;
setupContracts.tags = ["all", "setup"];
