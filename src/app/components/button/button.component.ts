import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label = '';
  @Input() isRound = false;
  @Input() textBold = true;
  @Input() disabled = false;

  constructor() { }

  ngOnInit(): void {
  }

}
