import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from "ng-apexcharts";
import { ActivatedRoute } from '@angular/router';
import { MarketService } from '../../services/market.service';
import { Item } from '../../interfaces/item';
import { ModalService } from "../../services/modal.service";
import { ethers } from "ethers";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  theme: ApexTheme,
  grid: any,
  colors: any,
  markers: any,
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: [ './details.component.scss' ]
})
export class DetailsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> | any;
  public item: Item | undefined;
  public auctionEnd: {
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  } | undefined;
  public bids: Array<{
    timeAgo: string,
    timeFormat: string,
    bidder: string,
    bid: number
  }> = [];
  public bidCount = 0;
  public bidTransactionError = '';
  public auctionEnded = true;
  public bidPercentageChange = 0;

  private id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService,
    private modalService: ModalService,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = Number(id);

      try {
        const item = await this.marketService.getItemById(this.id);

        if (item) {
          this.item = item;
        } else {
          console.error('No matching item found');
        }

        if (item.isAuction) {
          await this.auctionDetails();
          this.getChartOptions();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  private async auctionDetails() {
    let bids = await this.marketService.getAuctionBids(this.id);
    this.auctionEnd = await this.marketService.getAuctionEndTime(this.id);
    this.bids = bids.map((bid: any) => {
      const difference = Date.now() - (Number(bid[0]) * 1000);
      let timeDifference = Math.floor(difference/1000/60);
      let timeFormat = 'minutes';

      if (timeDifference > 60) {
        timeDifference = timeDifference / 60;
        timeFormat = 'hours';
      }

      return {
        timeAgo: timeDifference,
        timeFormat,
        bidder: bid[1],
        bid: ethers.utils.formatEther(String(bid[2]))
      }
    });

    const bidsLength = this.bids.length;
    if (bidsLength >= 2) {
      this.bidPercentageChange = this.percentageIncrease(
        this.bids[bidsLength - 2].bid,
        this.bids[bidsLength - 1].bid,
      );
    }
    this.bidCount = bidsLength - 1;

    if (this.auctionEnd.days >= 0) {
      this.auctionEnded = false;
    }
  }

  private percentageIncrease(a: number, b: number) {
    let percent;
    if(b !== 0) {
      if(a !== 0) {
        percent = (b - a) / a * 100;
      } else {
        percent = b * 100;
      }
    } else {
      percent = - a * 100;
    }
    return Math.floor(percent);
  }

  private getChartOptions() {
    this.chartOptions = {
      series: [
        {
          name: "MATIC",
          data: this.bids.map(b => b.bid)
        }
      ],
      chart: {
        background: 'transparent',
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        },
        tooltip: {
          theme: 'dark',
        },
      },
      theme: {
        mode: 'dark',
        palette: 'palette1',
        monochrome: {
          enabled: false,
          color: '#902CF2',
          shadeTo: 'dark',
          shadeIntensity: 0.75
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
      },
      labels: this.bids.map(b => `${Number(b.timeAgo).toFixed(2)} ${b.timeFormat} ago`),
      yaxis: {
        opposite: true,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(2);
          }
        }
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        }
      },
      legend: {
        horizontalAlign: "left"
      },
      grid: {
        show: false,
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      colors: [ '#902CF2' ],
      markers: {
        size: [ 4, 7 ]
      }
    };
  }

  public open() {
    this.modalService.open();
  }

  public buyItem() {
    if (this.item?.itemId) {
      this.marketService.buyItem(this.item.itemId, this.item.price)
    }
  }

  public async bidOnAuction(bid: number) {
    if (this.item?.itemId) {
      try {
        const transactionSuccessful = await this.marketService.bidOnAuction(this.item?.itemId, bid);
        if (transactionSuccessful) {
          this.modalService.close();
          this.ngOnInit();
        } else {
          this.bidTransactionError = 'Transaction was not successful, please try again.';
        }
      } catch (e) {
        if (e instanceof Object && e.hasOwnProperty('data')) {
          const error: any = e;
          console.error(error?.data?.message)
          this.bidTransactionError = error?.data?.message;
        } else {
          console.error(e)
        }
      }
    }
  }
}
