import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {
  @HostBinding('class.content-area') className = 'content-area';
  constructor() { }

  ngOnInit() {
  }

}
