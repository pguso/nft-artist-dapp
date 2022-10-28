import { Component, OnInit } from '@angular/core';
import { MarketService } from "../../services/market.service";

@Component({
  selector: 'app-my-nfts',
  templateUrl: './my-nfts.component.html',
  styleUrls: ['./my-nfts.component.scss']
})
export class MyNftsComponent implements OnInit {
  public items: any;

  constructor(private marketService: MarketService) { }

  ngOnInit(): void {
    this.getItemsByAddress()
  }

  async getItemsByAddress(): Promise<any> {
    try {
      const items = await this.marketService.getItemsByAddress();
      this.items = items.slice(0, 8);
      console.log('item', this.items[0]);
      console.log('unsold items', this.items);
    } catch (e) {
      console.error(e);
    }
  }

}
