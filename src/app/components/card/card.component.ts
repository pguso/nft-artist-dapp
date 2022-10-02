import { Component, Input, OnInit } from '@angular/core';
import { MarketService } from '../../services/market.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() itemId = 0;
  @Input() image = '';
  @Input() name = '';
  @Input() description = '';
  @Input() price = 0;

  constructor(private marketService: MarketService) { }

  async ngOnInit(): Promise<void> {
    try {
      if (this.itemId) {
        const item = await this.marketService.getItemById(this.itemId);
        console.log(item)
      } else {
        console.error('Please provide the itemId');
      }
    } catch (e) {
      console.error(e);
    }
  }

}
