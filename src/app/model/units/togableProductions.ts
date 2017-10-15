import { summaryFileName } from '@angular/compiler/src/aot/util';
import { Base } from './base';
import { Production } from '../production';
import { first } from 'rxjs/operator/first';
import { any } from 'codelyzer/util/function';
import * as decimal from 'decimal.js';
import { GameModel } from '../gameModel';
import { GameService } from '../../game.service';
import { Cost } from '../cost';
import { Action, BuyAction } from './action';


export class TogableProduction {

  uiModel = true

  constructor(
    public description: string,
    public prods: Array<Production>,
  ) {
    this.uiModel = this.isActive()
  }

  isActive() {
    return this.prods[0].active
  }

  turnOnOff() {
    this.prods.forEach(a => a.active = this.uiModel)
  }

}
