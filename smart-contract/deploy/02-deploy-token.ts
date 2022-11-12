import verify from "../utils/verify";
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../utils/const";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network, ethers } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;
    const registry = await get("GovernanceRegistry");

    const args: any[] = [registry.address];
    const token = await deploy("GovernanceToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(token.address, args);
    }
    log("----------------------------------------------------");
};

export default deployToken;
deployToken.tags = ["all", "token"];
