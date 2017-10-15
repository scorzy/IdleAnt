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

  required = 1

  numberformat = numberformat

  constructor() {

  }

  ngOnInit() {

  }

  getReqNum(): decimal.Decimal {
    if (!this.required)
      return Decimal(1)

    return Decimal(Math.max(Math.min(this.required, this.action.maxBuy.toNumber()), 1))
  }

  getPriceString1() {

    return numberformat.formatShort(Decimal(this.action.up ? this.action.up.quantity.plus(1) : 1)
      .times(this.getReqNum()))
  }

  getBuyStringHalf() {
    return numberformat.formatShort(Decimal(this.action.up ? this.action.up.quantity.plus(1) : 1)
      .times(this.action.getBuyMax().div(2).ceil()))
  }
  getBuyStringMax() {
    return numberformat.formatShort(Decimal(this.action.up ? this.action.up.quantity.plus(1) : 1)
      .times(this.action.getBuyMax()))
  }

  ngAfterViewChecked(): void {
    // if (this.action)
    //   this.refresh();
  }

  refresh() {
    this.maxBuy = this.action.getBuyMax();
    this.prices1 = this.action.getCosts(Decimal(1));
    this.pricesHalf = this.action.getCosts(this.maxBuy.div(2).ceil());
    this.pricesMax = this.action.getCosts(this.maxBuy);

    const buyMulti = Decimal(this.action.up ? this.action.up.quantity.plus(1) : 1)

    this.buyString1 = numberformat.formatShort(
      buyMulti);

    this.buyStringHalf = numberformat.formatShort(
      buyMulti.times(this.maxBuy.div(2).ceil()));

    this.buyStringMax = numberformat.formatShort(
      buyMulti.times(this.maxBuy));

    this.priceString1 = '';
    for (const p of this.prices1) {
      this.priceString1 += numberformat.formatShort(p.basePrice) +
        ' ' + p.unit.name + '\n'
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

  buyFirefox() {
    if (this.action) {
      const b = this.maxBuy.toNumber()
      return b >= 1
    }
    return false
  }

}
