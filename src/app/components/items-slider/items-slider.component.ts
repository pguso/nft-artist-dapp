import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-slider',
  templateUrl: './items-slider.component.html',
  styleUrls: ['./items-slider.component.scss']
})
export class ItemsSliderComponent implements OnInit {
  @Input() title = '';
  @Input() showFilter = true;
  @Input() subTitle = '';

  constructor() { }

  ngOnInit(): void {
  }

}
