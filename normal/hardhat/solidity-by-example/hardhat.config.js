require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/` + process.env.ALCHEMY_API_KEY,
      accounts: [process.env.METAMASK_ACCOUNT_PRIVATE_KEY],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/` + process.env.INFURA_API_KEY,
      accounts: [process.env.METAMASK_ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};
