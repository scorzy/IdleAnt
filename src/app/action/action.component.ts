import { Cost } from '../model/cost';
import { Action } from '../model/units/action';
import { AfterViewChecked, Component, Input, NgModule, OnInit, HostBinding } from '@angular/core';
import { GameService } from '../game.service';
declare let numberformat
@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})

export class ActionComponent implements OnInit {
  @HostBinding('class.card') card = 'card';
  // @HostBinding('class.card-block') className = 'card-block';

  @Input() action: Action
  maxBuy = new Decimal(0)
  prices1 = new Array<Cost>()
  pricesHalf = new Array<Cost>()
  pricesMax = new Array<Cost>()
  buyString1 = ""
  buyStringHalf = ""
  buyStringMax = ""
  priceString1 = ""
  priceStringHalf = ""
  priceStringMax = ""

  required = 1

  numberformat = numberformat

  Math = Math

  constructor(public gameService: GameService) {
  }

  ngOnInit() {
    this.action.reload()
    this.action.maxBuy = this.action.getBuyMax()
  }

  getReqNum(): decimal.Decimal {
    if (!this.gameService.game.buyMulti || this.gameService.game.buyMulti < 1)
      return new Decimal(1)

    return new Decimal(Math.max(Math.min(this.gameService.game.buyMulti, this.action.maxBuy.toNumber()), 1))
  }

  getPriceString1() {
    return numberformat.formatShort(new Decimal(this.action.up ? this.action.up.quantity.plus(1) : 1)
      .times(this.getReqNum()))
  }

  getBuyStringHalf() {
    return numberformat.formatShort(new Decimal(this.action.up ? this.action.up.quantity.plus(1) : 1)
      .times(this.action.maxBuy.div(2).ceil()))
  }
  getBuyStringMax() {
    return numberformat.formatShort(new Decimal(this.action.up ? this.action.up.quantity.plus(1) : 1)
      .times(this.action.maxBuy))
  }

  getPriceId(index, cost: Cost) {
    return cost.unit.id
  }
}
