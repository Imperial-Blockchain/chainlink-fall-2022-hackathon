import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains, ZERO_ADDRESS } from "../utils/const";
import { ethers } from "hardhat";
import { GovernanceRegistry } from "../typechain-types";

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre;
    const { log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const registryAddr = await get("GovernanceRegistry");
    const registry: GovernanceRegistry = await ethers.getContractAt(
        "GovernanceRegistry",
        registryAddr.address
    );
    const tokenAddr = await get("GovernanceToken");
    const charityAddr = await get("GovernanceCharity");
    const votingAddr = await get("GovernanceVoting");
    const treasuryAddr = await get("GovernanceTreasury");

    log("Setting up contracts for roles...");
    const initTx = await registry.init(
        tokenAddr.address,
        charityAddr.address,
        votingAddr.address,
        treasuryAddr.address,
        ZERO_ADDRESS
    );
    await initTx.wait(1);
    log("Contracts deployed successfully.");
};

export default setupContracts;
setupContracts.tags = ["all", "setup"];
