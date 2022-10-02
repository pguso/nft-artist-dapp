import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../services/market.service';

// TODO implement filter (collections)
@Component({
  selector: 'app-artwork',
  templateUrl: './artwork.component.html',
  styleUrls: ['./artwork.component.scss']
})
export class ArtworkComponent implements OnInit {
  public items: any;

  constructor(private marketService: MarketService) { }

  ngOnInit(): void {
    this.getUnsoldItems();
  }

  async getUnsoldItems(): Promise<any> {
    try {
      const items = await this.marketService.getUnsoldItems();
      this.items = items.slice(0, 8);
      console.log('item', this.items[0]);
      console.log('unsold items', this.items);
    } catch (e) {
      console.error(e);
    }
  }

}
