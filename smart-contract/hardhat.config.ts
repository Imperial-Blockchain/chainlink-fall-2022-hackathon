import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "dotenv/config";
import "solidity-coverage";
import "hardhat-deploy";
import "solidity-coverage";
import "solidity-docgen";
import { HardhatUserConfig } from "hardhat/config";

// const SECRET_KEY_1 = process.env.SECRET_KEY_1 || "";
// const SECRET_KEY_2 = process.env.SECRET_KEY_2 || "";
// const SECRET_KEY_3 = process.env.SECRET_KEY_3 || "";

// const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "";
// const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "";
// const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || "";

// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
// const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // },
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
        // goerli: {
        //     url: GOERLI_RPC_URL,
        //     accounts: [SECRET_KEY_1, SECRET_KEY_2, SECRET_KEY_3],
        //     saveDeployments: true,
        //     chainId: 5,
        // },
        // mainnet: {
        //     url: MAINNET_RPC_URL,
        //     accounts: [SECRET_KEY_1, SECRET_KEY_2, SECRET_KEY_3],
        //     saveDeployments: true,
        //     chainId: 1,
        // },
        // polygon: {
        //     url: POLYGON_MAINNET_RPC_URL,
        //     accounts: [SECRET_KEY_1, SECRET_KEY_2, SECRET_KEY_3],
        //     saveDeployments: true,
        //     chainId: 137,
        // },
    },

    solidity: {
        compilers: [
            {
                version: "0.8.9",
            },
        ],
    },

    etherscan: {
        apiKey: {
            // mainnet: ETHERSCAN_API_KEY,
            // goerli: ETHERSCAN_API_KEY,
            // polygon: POLYGONSCAN_API_KEY,
        },
        customChains: [
            {
                network: "goerli",
                chainId: 5,
                urls: {
                    apiURL: "https://api-goerli.etherscan.io/api",
                    browserURL: "https://goerli.etherscan.io",
                },
            },
        ],
    },

    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },

    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        seller: {
            default: 1,
        },
        buyer: {
            default: 2,
        },
    },

    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
};

export default config;
