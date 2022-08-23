import { Injectable } from '@angular/core';
import { HelperService } from "./helper.service";

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private helperService: HelperService) {}

  public async connect(): Promise<string> {
    const provider = await this.helperService.getWebProvider()
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    return signer.getAddress()
  }

  public async isConnected(): Promise<boolean> {
    const provider = await this.helperService.getWebProvider(false)
    const accounts = await provider.listAccounts();

    return accounts.length > 0;
  }
}
