import { Component, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public walletAddress = ''
  public amount = 0

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private walletService: WalletService
  ) {
    this.restoreAddress()
  }

  public async connectToWallet() {
    const walletAddress = await this.walletService.connect()
    this.walletAddress = this.shortenAddress(walletAddress)
    localStorage.setItem('address', walletAddress)
  }

  private async restoreAddress(): Promise<void> {
    if (await this.walletService.isConnected()) {
      const address = localStorage.getItem('address')
      this.walletAddress = address ? this.shortenAddress(address) : ''
    }
  }

  private shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
    // 0xbcCc9B7292839e77BFEcACd73e6c135529f8e216
  }

  public toggleMenu() {
    const menu = this.document.getElementById('menu');

    if (menu?.classList.contains('active')) {
      menu?.classList.remove('active');
    } else {
      menu?.classList.add('active');
    }
  }
}
