import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { NFTStorage, File } from 'nft.storage'

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  public getClient(): NFTStorage {
    return new NFTStorage({ token: environment.nftStorageApiToken })
  }

  public async uploadFile(file: File): Promise<string> {
    console.dir(file)
    let url = '';
    const client = this.getClient()
    console.dir(client)

    try {
      const metadata = await client.store({
        image: file,
        name: '',
        description: ''
      })
      console.log('metadata', metadata)
      const res = metadata.embed() as any;
      console.log('res', res)
      url = `${environment.ipfsPublicGatewayUrl}${res.image.pathname}`;
    } catch (e) {
      console.error(e);
    }

    return url;
  }
}
