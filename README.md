### Get your NFT project site up and running

Add .env file to the root of the project and add your wallet private key into it

```
PRIVATE_KEY=***
```


Deploy the smart contracts to polygon testnet or mainnet
```
# testnet
yarn sc:deploy:testnet

# mainnet
yarn sc:deploy:mainnet
```

Add the addresses that are printed out on the console for market and nft to 
the environment.ts (testnet) and environment.prod.ts (mainnet)

```
export const environment = {
  nftAddress: '0x7f35303Bf96da77F90f6Dbb91C384baEF72C4253',
  marketAddress: '0x7ab9aB7a609F626Cb0E7740d23aBef8B4a8Fe3c2',
  ...
};
```
