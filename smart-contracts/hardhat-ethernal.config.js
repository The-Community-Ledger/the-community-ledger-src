const { extendEnvironment } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-ethernal");
require("./tasks/ethernal");

// Configure env variables
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Add Ethernal
extendEnvironment((hre) => {
  hre.ethernalSync = true;
  hre.ethernalWorkspace = process.env.ETHERNAL_WORKSPACE;
  hre.ethernalTrace = true;
  hre.ethernalResetOnStart = process.env.ETHERNAL_WORKSPACE;
  hre.ethernalUploadAst = true;
});

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.21",
    settings: {
    optimizer: {
      enabled: true,
      runs: 50 // lower = smaller contract size, higher = cheaper runtime gas
    }
  }},
  networks: {
    hardhat: {
      loggingEnabled: false
    },
    ethereum: {
      chainId: 1,
      url: "https://rpc.ankr.com/eth",
      forking: {
        url: "https://rpc.ankr.com/eth"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER]
    },
    sepolia: {
      chainId: 11155111,
      url: "https://rpc.ankr.com/eth_sepolia",
      forking: {
        url: "https://rpc.ankr.com/eth_sepolia"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER]
    },
    polygonPos: {
      chainId: 137,
      url: "https://rpc.ankr.com/polygon",
      forking: {
        url: "https://rpc.ankr.com/polygon"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER]
    },
    polygonAmoy: {
      chainId: 80002,
      url: "https://rpc-amoy.polygon.technology",
      forking: {
        url: "https://rpc-amoy.polygon.technology"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER]
    },
    polygonZkevm: {
      chainId: 1101,
      url: "https://rpc.ankr.com/polygon_zkevm",
      forking: {
        url: "https://rpc.ankr.com/polygon_zkevm"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER]
    },
    polygonZkevmTestnet: {
      chainId: 2442,
      url: "https://rpc.cardona.zkevm-rpc.com",
      forking: {
        url: "https://rpc.cardona.zkevm-rpc.com"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER]
    }
  }
};

module.exports = config;
