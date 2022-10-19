import { Component, OnInit } from '@angular/core';
import { MarketService } from "../../services/market.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public hasItems = false;

  constructor(
    private marketService: MarketService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.checkItems();
  }

  async checkItems(): Promise<void> {
    this.hasItems = await this.marketService.hasItems();

    // TODO only for owner
    if (!this.hasItems) {
      this.router.navigate(['upload']);
    }
  }
}
