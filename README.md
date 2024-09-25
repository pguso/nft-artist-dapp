# NFT Artist DApp

## Overview
The **NFT Artist DApp** is a decentralized application that helps artists deploy and manage NFTs on the Polygon blockchain. It offers smart contract deployment, a marketplace, and a web interface for ease of use.

## Features
- Deploy smart contracts on Polygon (testnet or mainnet)
- Manage and trade NFTs via a marketplace
- Built with Angular, TypeScript, SCSS, and Solidity

## Setup

1. **Environment Configuration:**
   - Create an `.env` file and add your private key:
     ```bash
     PRIVATE_KEY=your_private_key
     ```

2. **Deploy Contracts:**
   - For testnet:
     ```bash
     yarn sc:deploy:testnet
     ```
   - For mainnet:
     ```bash
     yarn sc:deploy:mainnet
     ```

3. **Update Environment Files:**
   - Add deployed contract addresses in `environment.ts` (for testnet) or `environment.prod.ts` (for mainnet):
     ```typescript
     export const environment = {
       nftAddress: 'your_nft_address',
       marketAddress: 'your_market_address',
     };
     ```

## Usage
- Use the DApp interface to deploy and mint NFTs.
- Access the marketplace to trade or showcase NFTs.

## Tech Stack
- **Frontend:** Angular, TypeScript, SCSS
- **Smart Contracts:** Solidity
- **Blockchain:** Polygon

## License
This project is licensed under the MIT License.

## Contributions
Contributions via issues or pull requests are welcome.

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/pguso/nft-artist-dapp.git
   cd nft-artist-dapp
2. Install dependencies:
   ```bash
   yarn install
3. Start the development server:
   ```bash
   yarn start



Let me know if you'd like any further modifications!
