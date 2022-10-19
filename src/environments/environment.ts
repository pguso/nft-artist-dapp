// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  nftAddress: '0x420BE3C2eC4e10eA3Bfff9D3331952757BE48BF6',
  marketAddress: '0xdaBc5279C92CBc92961672C5a4462d135a6862B6',
  ipfsPublicGatewayUrl: 'https://ipfs.io/',
  web3storageApiToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDREQTIyMDZkOTE0OTlhYWUyNkJFRTUzRGMxMjBFQzA2NTBENTUyQzYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjExNTI3NjQxMTEsIm5hbWUiOiJORlQgYXJ0aXN0IHdlYnNpdGUifQ.CUs5Nz5KsJrPHUP1hsUYascVTJl-EGiyORLbDlKVhRs', // Get the token from here https://web3.storage/login/
  nftStorageApiToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENjZjAyQUVhNzE3MzFENDhGMzdCMUQwMDQ3NTkxNThBZmE1RDdlNTAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NTQwMTgwNTA4NywibmFtZSI6Ik5GVCBBcnRpc3RzIn0.TYBWjIjUT7wm5pt1yXNeTg4s0AhaWTxnctOpGTZM_n0',
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
