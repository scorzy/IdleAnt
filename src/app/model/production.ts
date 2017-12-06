import { first } from 'rxjs/operator/first';
import { any } from 'codelyzer/util/function';
import * as decimal from 'decimal.js';
import { GameModel } from './gameModel';
import { GameService } from '../game.service';
import { Unit } from './units/unit';
import { Unlocable } from './utils';
import { Cost } from './cost';
import { Base } from './units/base';

export class Production extends Unlocable {

  product: Unit = null
  defaultUnlocked = true
  active = true

  bonusList: Array<[Base, decimal.Decimal]>

  constructor(
    public unit: Unit,    // who make
    public efficiency: decimal.Decimal = new Decimal(1),
    unlocked = true
  ) {
    super(unlocked)
    this.defaultUnlocked = unlocked
  }

  getprodPerSec(eff = true): decimal.Decimal {
    if (this.unit.unlocked && this.unlocked) {

      let sum = new Decimal(1)
      for (const p of this.product.bonusProduction)
        sum = sum.plus(p[0].quantity.times(p[1]))

      let totalBonus = new Decimal(1)
      if (this.bonusList && this.bonusList.length > 0)
        for (let i = 0; i < this.bonusList.length; i++)
          totalBonus = totalBonus.plus(this.bonusList[i][0].quantity.times(this.bonusList[i][1]))

      return this.efficiency
        .times(this.unit.getProduction())
        .times(eff ? this.unit.percentage : new Decimal(100)).div(100)
        .times(this.efficiency.greaterThan(0) ? this.product.worldProdModifiers : new Decimal(1))
        .times(sum)
        .times(totalBonus)
    } else
      return new Decimal(0)
  }

  isActive(): boolean {
    return this.active && this.unlocked
  }
}
