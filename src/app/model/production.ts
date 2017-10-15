import { first } from 'rxjs/operator/first';
import { any } from 'codelyzer/util/function';
import * as decimal from 'decimal.js';
import { GameModel } from './gameModel';
import { GameService } from '../game.service';
import { Unit } from './units/unit';
import { Unlocable } from './utils';

export class Production extends Unlocable {

  productor: Unit = null
  defaultUnlocked = true
  active = true

  constructor(
    public unit: Unit,    // who make
    public efficiency: decimal.Decimal = Decimal(1),
    unlocked = true
  ) {
    super(unlocked)
    this.defaultUnlocked = unlocked
  }

  getprodPerSec(eff = true): decimal.Decimal {
    if (this.unit.unlocked && this.unlocked) {

      let sum = Decimal(1)
      for (const p of this.productor.bonusProduction)
        sum = sum.plus(p[0].quantity.times(p[1]))

      return this.efficiency
        .times(this.unit.getProduction())
        .times(eff ? this.unit.percentage : Decimal(100)).div(100)
        .times(this.efficiency.greaterThan(0) ? this.productor.worldProdModifiers : Decimal(1))
        .times(sum)
    } else
      return Decimal(0)
  }

  isActive(): boolean {
    return this.active && this.unlocked
  }
}
