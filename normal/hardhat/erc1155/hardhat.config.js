require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "bsc_testnet",
  networks: {
    bsc_testnet: {
      url: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
      accounts: [
        "1728f3e852bd0d103903f2948a256771593050eff2c19b0f48d83fc896d0f190" ||
          "",
      ],
    },
  },
  etherscan: {
    apiKey: "D97TAVGY9Y1NRNZYA73IFHD7RSG2GQWSWW" || "",
  },
};
