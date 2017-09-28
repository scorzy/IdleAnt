import { first } from 'rxjs/operator/first';
import { any } from 'codelyzer/util/function';
import * as decimal from 'decimal.js';
import { GameModel } from './gameModel';
import { GameService } from '../game.service';
import { Unit } from './units/unit';
import { Unlocable } from './utils';

export class Production extends Unlocable {

  public productor: Unit = null

  constructor(
    public unit: Unit,    // who make
    public efficiency: decimal.Decimal = Decimal(1),
    unlocked = true
  ) { super(unlocked) }

  getprodPerSec(): decimal.Decimal {
    if (this.unit.unlocked && this.unlocked) {

      let sum = Decimal(1)
      for (const p of this.productor.bonusProduction)
        sum = sum.plus(p[0].quantity.times(p[1]))

      return this.efficiency.times(this.unit.getProduction())
        .times(this.unit.percentage).div(100)
        .times(this.productor.worldProdModifiers)
        .times(sum)
    } else
      return Decimal(0)
  }
}
