const hre = require('hardhat')
const fs = require('fs')

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory('Market')
  const nftMarket = await NFTMarket.deploy([
    'Texture',
    'Sports',
    'Art',
    'Illustrations'
  ])
  await nftMarket.deployed()

  // This solves the bug in Mumbai network where the contract address is not the real one
  const txHash = nftMarket.deployTransaction.hash;
  const txReceipt = await hre.ethers.provider.waitForTransaction(txHash);
  console.log("market contract address:", txReceipt.contractAddress);

  const NFT = await hre.ethers.getContractFactory('NFT')
  const nft = await NFT.deploy(txReceipt.contractAddress)
  await nft.deployed()

  // This solves the bug in Mumbai network where the contract address is not the real one
  const txHash2 = nft.deployTransaction.hash;
  const txReceipt2 = await hre.ethers.provider.waitForTransaction(txHash2);
  console.log("nft contract address:", txReceipt2.contractAddress);

  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
