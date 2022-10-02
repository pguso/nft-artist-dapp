import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private helperService: HelperService) {}

  async getCollections() {
    const marketContract = await this.helperService.getMarketContract()

    return await marketContract['getCollections']();
  }
}
