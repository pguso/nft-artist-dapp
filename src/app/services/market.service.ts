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
  ) {
  }

  public async addItem(uploadForm: FormGroup): Promise<boolean> {
    let isItemCreated = false
    const createItem: CreateItem = this.helperService.mapFormToObject(uploadForm)
    const metaData = JSON.stringify(createItem)
    const blob = new Blob([metaData], {type: 'application/json'})
    const files = [new File([blob], 'metadata.json')]
    console.log('createItem', createItem)

    if (metaData) {
      try {
        const url = await this.ipfs.uploadFile(files[0]);
        console.log('meta url', url)

        // TODO variable duration
        isItemCreated = await this.createSale(
          url,
          createItem.price,
          createItem.isRare,
          createItem.isAuction,
          createItem.addToCollection,
          createItem.duration
        )
      } catch (error) {
        console.log('Error uploading file: ', error)
      }
    }

    return isItemCreated
  }

  public async createSale(
    url: string,
    inputPrice: string,
    isRare: boolean,
    isAuction: boolean,
    collectionId: number,
    duration = 0,
  ): Promise<boolean> {
    const tokenId = await this.createToken(url)
    const price = ethers.utils.parseUnits(inputPrice.replace(',', '.'), 'ether')
    const marketContract = await this.helperService.getMarketContract(true)

    const addItemToMarketplaceTransaction = await marketContract['addItemToMarketplace'](
      environment.nftAddress,
      tokenId,
      price,
      isRare,
      isAuction,
      duration,
      collectionId
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
        console.log('item.tokenId', Number(item.tokenId))
        const tokenUri = await tokenContract['tokenURI'](item.tokenId)
        const meta: any = await this.http.get(tokenUri).toPromise()
        let price = ethers.utils.formatEther(item.price.toString())

        const {fileUrl, description, name, externalLink} = meta
        return MarketService.createItem(
          price, item, fileUrl, name, description, externalLink
        )
      }),
    )
  }

  public async getLatestItem() {
    const tokenContract = await this.helperService.getTokenContract()
    const marketContract = await this.helperService.getMarketContract()
    const latestItem = await marketContract['getLatestItem']()

    if (latestItem.tokenId) {
      console.log('latestItem.tokenId', latestItem.tokenId);
    }

    const tokenUri = await tokenContract['tokenURI'](latestItem.tokenId)
    const meta: any = await this.http.get(tokenUri).toPromise()
    let price = ethers.utils.formatEther(latestItem.price.toString())

    const {fileUrl, description, name, externalLink} = meta
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
      itemId: Number(item.itemId),
      price,
      tokenId: Number(item.tokenId),
      seller: String(item.seller),
      owner: String(item.owner),
      sold: Boolean(item.sold),
      isRare: Boolean(item.isRare),
      isAuction: Boolean(item.isAuction),
      lastBidder: String(item.lastBidder),
      collectionId: Number(item.collectionId),
      // TODO save preview with reduced quality to property preview
      image,
      name,
      description,
      externalLink,
    }
  }

  public async getItemById(itemId: number) {
    const tokenContract = await this.helperService.getTokenContract()
    const marketContract = await this.helperService.getMarketContract()

    const item = await marketContract['getItemById'](itemId);
    const tokenUri = await tokenContract['tokenURI'](item.tokenId)
    const meta: any = await this.http.get(tokenUri).toPromise()
    let price = ethers.utils.formatEther(item.price.toString())

    const {fileUrl, description, name, externalLink} = meta
    return MarketService.createItem(
      price, item, fileUrl, name, description, externalLink
    )
  }

  public async getAuctionBids(itemId: number) {
    const marketContract = await this.helperService.getMarketContract()

    return await marketContract['getAuctionBids'](itemId);
  }

  public async getAuctionEndTime(itemId: number) {
    const marketContract = await this.helperService.getMarketContract()
    const end = Number(await marketContract['getAuctionEndTimestamp'](itemId));
    const endDate = new Date(end * 1000);

    return MarketService.convertTime(endDate);
  }

  public async hasItems() {
    const marketContract = await this.helperService.getMarketContract()

    return await marketContract['hasItems']();
  }

  private static convertTime(dateFuture: Date) {
    const now = new Date();
    // @ts-ignore
    let seconds = Math.floor((dateFuture - (now)) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return {
      days,
      hours,
      minutes,
      seconds
    };
  }

  public async bidOnAuction(itemId: number, bid: number) {
    const marketContract = await this.helperService.getMarketContract(true)
    const bidOnAuctionTransaction = await marketContract['bidOnAuction'](
      itemId,
      {
        value: ethers.utils.parseUnits(bid.toString()),
      },
    );
    const tx = await bidOnAuctionTransaction.wait()

    return tx.status === 1
  }

  public async buyItem(itemId: number, price: string) {
    const marketContract = await this.helperService.getMarketContract(true)
    const buyTransaction = await marketContract['sellItemAndTransferOwnership'](
      environment.nftAddress,
      itemId,
      {
        value: ethers.utils.parseUnits(price),
      },
    );
    const tx = await buyTransaction.wait()

    return tx.status === 1
  }

  public async getItemsByAddress() {
    const tokenContract = await this.helperService.getTokenContract()
    const marketContract = await this.helperService.getMarketContract()
    const unsoldItems = await marketContract['getPurchasedItemsBySender']()

    return await Promise.all(
      unsoldItems.map(async (item: any) => {
        console.log('item.tokenId', Number(item.tokenId))
        const tokenUri = await tokenContract['tokenURI'](item.tokenId)
        const meta: any = await this.http.get(tokenUri).toPromise()
        let price = ethers.utils.formatEther(item.price.toString())

        const {fileUrl, description, name, externalLink} = meta
        return MarketService.createItem(
          price, item, fileUrl, name, description, externalLink
        )
      }),
    )
  }
}
