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

### Smart Contract Features

The smart contracts in the **NFT Artist DApp** offer a range of functionalities, including:

- **NFT Minting**: Artists can mint new NFTs directly on the Polygon blockchain.
- **Marketplace**: Users can list NFTs for sale or purchase existing ones.
- **Auction Support**: 
  - Bid on NFTs with features like minimum bid settings, bid tracking, and automatic auction finalization.
- **Ownership Transfer**: Automated ownership transfer upon sale or auction completion.

These Solidity-based contracts ensure secure and transparent interactions for all participants.

### DApp Features

The **NFT Artist DApp** provides a user-friendly interface that offers:

- **Intuitive Web UI**: Easily deploy, mint, and manage NFTs through a simple and interactive interface.
- **Real-Time Interactions**: Users can interact with the blockchain and view updates like NFT listings and auctions in real-time.
- **Wallet Integration**: Seamlessly connect with your crypto wallet (e.g., MetaMask) for secure transactions.
- **Cross-Chain Support**: While primarily focused on Polygon, the DApp can be extended for multi-chain support.
- **Responsive Design**: Optimized for both desktop and mobile use.


Let me know if you'd like any further modifications!
