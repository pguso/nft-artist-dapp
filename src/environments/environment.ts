// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  nftAddress: '0x1b6909eA884FF58F4a2b3A63ca02E5B9c3DcdFCe',
  marketAddress: '0x5A3a6a57496064F12B2f8D79c3A15e4C6bB9e0C5',
  ipfsPublicGatewayUrl: 'https://ipfs.io/ipfs/',
  web3storageApiToken: 'YOUR_API_TOKEN', // Get the token from here https://web3.storage/login/
  categories: [
    {
      id: 1,
      name: 'texture'
    },
    {
      id: 2,
      name: 'sports'
    },
    {
      id: 3,
      name: 'art'
    },
    {
      id: 4,
      name: 'photography'
    },
    {
      id: 5,
      name: 'illustrations'
    },
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
