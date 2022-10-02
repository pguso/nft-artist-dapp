import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Web3Storage } from 'web3.storage';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  public getClient(): any {
    // @ts-ignore
    return new Web3Storage({ token: environment.web3storageApiToken })
  }

  public async uploadFile(file: File): Promise<string> {
    return this.upload(file);
  }

  public async upload(data: any): Promise<string> {
    let url = '';
    const client = this.getClient()

    try {
      const rootCid = await client.put(data);
      const res = await client.get(rootCid);
      const files = await res.files();
      console.log('files', files);
      console.log('cid', files[0].cid)

      url = `${environment.ipfsPublicGatewayUrl}${files[0].cid}`
    } catch (error) {
      console.log(error)
    }

    return url
  }
}
