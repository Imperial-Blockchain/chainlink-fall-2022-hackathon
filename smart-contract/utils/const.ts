export interface networkConfigItem {
    name?: string;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
    },
    4: {
        name: "rinkeby",
    },
    // 1: {
    //     name: "mainnet",
    // },
};

export const developmentChains = ["hardhat", "localhost"];
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
