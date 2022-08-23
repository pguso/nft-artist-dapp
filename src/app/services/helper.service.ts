import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers'
import { FormGroup } from "@angular/forms";
import { environment } from '../../environments/environment';
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/Market.sol/Market.json'

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public async getWebProvider(requestAccounts = true, onlyAccountAddress = false) {
    const provider: any = await detectEthereumProvider()

    if (requestAccounts) {
      const accounts = await provider.request({ method: 'eth_requestAccounts' })

      if (onlyAccountAddress) {
        return accounts
      }
    }

    return new ethers.providers.Web3Provider(provider)
  }

  public mapFormToObject(formInput: FormGroup): any {
    return {
      name: formInput.get('name')?.value,
      description: formInput.get('description')?.value,
      price: formInput.get('price')?.value,
      externalLink: formInput.get('externalLink')?.value,
      isAuction: formInput.get('isAuction')?.value,
      addToCollection: formInput.get('addToCollection')?.value,
      fileUrl: formInput.get('fileUrl')?.value,
      rare: formInput.get('rare')?.value,
    }
  }

  public async getTokenContract(bySigner = false) {
    const provider = await this.getWebProvider()
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.nftAddress,
      NFT.abi,
      bySigner ? signer : provider,
    )
  }

  public async getMarketContract(bySigner = false) {
    const provider = await this.getWebProvider()
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.marketAddress,
      Market.abi,
      bySigner ? signer : provider,
    )
  }
}
