import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { ethers } from 'ethers'
import { environment } from '../../environments/environment';
import { Token } from '../interfaces/token.interface';

@Injectable({
  providedIn: 'root'
})
export class NftService {
  constructor(
    private helperService: HelperService,
  ) {
  }

  public async loadNFTs() {
    const tokenContract = await this.helperService.getTokenContract();
    const marketContract = await this.helperService.getMarketContract();
    const unsoldItems = await marketContract['getAllUnsoldItems']()

    return this.helperService.mapItemsToToken(unsoldItems, tokenContract);
  }

  public async buyNFT(nft: Token) {
    const contract = await this.helperService.getMarketContractBySigner();
    const price = ethers.utils.parseUnits(Number(nft.price).toString(), 'ether')
    console.log('price', price)

    // correct? -> sellItemAndTransferOwnership
    const transaction = await contract['sellItemAndTransferOwnership'](
      environment.nftAddress,
      nft.tokenId,
      {
        value: price,
      },
    )
    await transaction.wait()
  }
}
