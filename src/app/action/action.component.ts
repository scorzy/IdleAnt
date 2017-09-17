import { Cost } from '../model/cost';
import { Action } from '../model/units/action';
import { AfterViewChecked, Component, Input, NgModule, OnInit } from '@angular/core';
import * as numberformat from 'swarm-numberformat';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})

export class ActionComponent implements OnInit, AfterViewChecked {

  @Input() action: Action
  maxBuy = Decimal(0)
  prices1 = new Array<Cost>()
  pricesHalf = new Array<Cost>()
  pricesMax = new Array<Cost>()
  buyString1 = ""
  buyStringHalf = ""
  buyStringMax = ""
  priceString1 = ""
  priceStringHalf = ""
  priceStringMax = "";

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewChecked(): void {
    if (this.action)
      this.refresh();
  }

  refresh() {
    this.maxBuy = this.action.getBuyMax();
    this.prices1 = this.action.getCosts(Decimal(1));
    this.pricesHalf = this.action.getCosts(this.maxBuy.div(2).ceil());
    this.pricesMax = this.action.getCosts(this.maxBuy);

    const buyMulti = Decimal.pow(2, this.action.up ? this.action.up.quantity : 0);

    this.buyString1 = numberformat.formatShort(
      buyMulti);

    this.buyStringHalf = numberformat.formatShort(
      buyMulti.times(this.maxBuy.div(2).ceil()));

    this.buyStringMax = numberformat.formatShort(
      buyMulti.times(this.maxBuy));

    this.priceString1 = '';
    for (const p of this.prices1) {
      this.priceString1 += numberformat.formatShort(p.basePrice) +
        ' ' + p.unit.name + '\n';
    }

    this.priceStringHalf = '';
    for (const p of this.pricesHalf) {
      this.priceStringHalf += numberformat.formatShort(p.basePrice) +
        ' ' + p.unit.name + '\n';
    }

    this.priceStringMax = '';
    for (const p of this.pricesMax) {
      this.priceStringMax += numberformat.formatShort(p.basePrice) +
        ' ' + p.unit.name + '\n';
    }
  }

}
