require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

const privatKey = process.env.PRIVATE_KEY

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    testnet: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/MTfiHcvMcBhlX2Z-pdoi5RkRilrfj4Z4',
      accounts: [privatKey],
    },
    mainnet: {
      url: 'https://polygon-mainnet.g.alchemy.com/v2/RuSPp-Bpg4YJOgux0s6WzfQTUs--TU5U',
      accounts: [privatKey],
    },
  },
  solidity: '0.8.7',
}
