import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from "rxjs";
import { ModalService } from "../../services/modal.service";
import { FormControl } from "@angular/forms";
import { ethers } from "ethers";
import { HelperService } from "../../services/helper.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() actualBid: string | undefined = '';
  @Input() error = '';

  @Output() newBid = new EventEmitter<number>();

  public showModal$!: Observable<boolean>;

  public minBid = 0;
  public bidControl = new FormControl('');
  public bid = 0;
  public formattedWalletBalance = 0;

  constructor(
    private modalService: ModalService,
    private helperService: HelperService,
  ) {}

  public async ngOnInit() {
    this.showModal$ = this.modalService.watch();
    this.minBid = Number(this.actualBid) + 0.01;
    this.bid = this.minBid;

    const balance = await this.helperService.getBalance();
    this.formattedWalletBalance = Number(ethers.utils.formatEther(balance));
  }

  public addBid() {
    if (
      !this.bidControl.errors
      && this.bid >= this.minBid
      && this.bid <= this.formattedWalletBalance
    ) {
      this.newBid.emit(this.bid);
    }
  }

  public close() {
    this.modalService.close();
  }
}
