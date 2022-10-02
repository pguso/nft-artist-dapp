import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTheme
} from "ng-apexcharts";
import { ActivatedRoute } from '@angular/router';
import { MarketService } from '../../services/market.service';
import { Item } from '../../interfaces/item';

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
  styleUrls: ['./details.component.scss']
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
  public bids: any[] = [];

  private id: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService
  ) {
    this.chartOptions = {
      series: [
        {
          name: "MATIC",
          data: [1.00, 1.01, 1.05, 1.10, 1.20, 1.50, 2.00, 3.00, 4.00]
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
      labels: ['15 hour ago', '14 hour ago', '13 hour ago', '11 hour ago', '10 hour ago', '9 hour ago', '8 hour ago', '4 hour ago', '1 hour ago'],
      yaxis: {
        opposite: true,
        labels: {
          formatter: function(val: number) {
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
      colors: ['#902CF2'],
      markers: {
        size: [4, 7]
      }
    };
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = Number(id);

      try {
        const item = await this.marketService.getItemById(this.id);
        const bids = await this.marketService.getAuctionBids(this.id);
        const endTime = await this.marketService.getAuctionEndTime(this.id);

        if (item) {
          this.item = item;
          this.auctionEnd = endTime;
          this.bids = bids;
          console.dir(bids);
        } else {
          console.error('No matching item found');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

}
