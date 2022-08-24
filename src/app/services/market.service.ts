import { Injectable } from '@angular/core'
import { HelperService } from './helper.service'
import { environment } from '../../environments/environment'
import { ethers } from 'ethers'
import { CreateItem } from '../interfaces/create-item'
import { IpfsService } from "./ipfs.service";
import { HttpClient } from "@angular/common/http";
import { Profile } from "../interfaces/profile";
import { FormGroup } from "@angular/forms";
import { Item } from "../interfaces/item";
import { File } from "web3.storage";

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  constructor(
    private helperService: HelperService,
    private ipfs: IpfsService,
    private http: HttpClient
  ) {}

  public async addItem(uploadForm: FormGroup): Promise<boolean> {
    let isItemCreated = false
    const createItem: CreateItem = this.helperService.mapFormToObject(uploadForm)
    const metaData = JSON.stringify(createItem)
    const blob = new Blob([metaData], {type : 'application/json'})
    const files = [new File([blob], 'metadata.json')]

    if (metaData) {
      try {
        const url = await this.ipfs.upload(files);
        console.log('meta url', url)

        isItemCreated = await this.createSale(url, createItem.price)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }
    }

    return isItemCreated
  }

  public async createSale(url: string, inputPrice: string): Promise<boolean> {
    const tokenId = await this.createToken(url)
    const price = ethers.utils.parseUnits(inputPrice, 'ether')
    const marketContract = await this.helperService.getMarketContract(true)

    const addItemToMarketplaceTransaction = await marketContract['addItemToMarketplace'](
      environment.nftAddress,
      tokenId,
      price,
    )
    const tx = await addItemToMarketplaceTransaction.wait()

    return tx.status === 1
  }

  private async createToken(url: string): Promise<number> {
    const tokenContract = await this.helperService.getTokenContract(true)
    const createTokenTransaction = await tokenContract['createToken'](url)
    const tx = await createTokenTransaction.wait()
    const event = tx.events[0]
    const tokenId = event.args[2]

    return tokenId.toNumber()
  }

  public async getUnsoldItems() {
    const tokenContract = await this.helperService.getTokenContract()
    const marketContract = await this.helperService.getMarketContract()
    const unsoldItems = await marketContract['getAllUnsoldItems']()

    return await Promise.all(
      unsoldItems.map(async (item: any) => {
        const tokenUri = await tokenContract['tokenURI'](item.tokenId)
        const meta: any = await this.http.get(tokenUri).toPromise()
        let price = ethers.utils.formatEther(item.price.toString())

        const { preview, description, name, externalLink } = meta;
        return MarketService.createItem(
          price, item, preview, name, description, externalLink
        )
      }),
    )
  }

  public async getLatestItem() {
    const tokenContract = await this.helperService.getTokenContract()
    const marketContract = await this.helperService.getMarketContract()
    const latestItem = await marketContract['getLatestItem']()

    const tokenUri = await tokenContract['tokenURI'](latestItem.tokenId)
    const meta: any = await this.http.get(tokenUri).toPromise()
    let price = ethers.utils.formatEther(latestItem.price.toString())

    const { fileUrl, description, name, externalLink } = meta
    return MarketService.createItem(
      price, latestItem, fileUrl, name, description, externalLink
    )
  }

  public async addProfile(url: string): Promise<boolean> {
    const marketContract = await this.helperService.getMarketContract(true)
    const addProfileTransaction = await marketContract['addProfile'](url)
    const tx = await addProfileTransaction.wait()

    return tx.status === 1
  }

  public async getProfile(): Promise<Profile | undefined> {
    const marketContract = await this.helperService.getMarketContract(true)
    const ipfsUrl = await marketContract['getProfile']()

    let data;
    if (ipfsUrl) {
      data = await this.http.get<Profile>(ipfsUrl).toPromise()
    }

    return data
  }

  private static createItem(
    price: string,
    item: Partial<Item>,
    image: string,
    name: string,
    description: string,
    externalLink: string
  ): Item {
    return {
      price,
      tokenId: Number(item.tokenId),
      seller: String(item.seller),
      owner: String(item.owner),
      // TODO save preview with reduced quality to property preview
      image,
      name,
      description,
      externalLink,
    }
  }
}
