import { first } from 'rxjs/operator/first';
import { any } from 'codelyzer/util/function';
import * as decimal from 'decimal.js';
import { GameModel } from './gameModel';
import { GameService } from '../game.service';
import { Unit } from './units/unit';

export class Production {

    constructor(
        public unit: Unit,    // who make
        public efficiency: decimal.Decimal = Decimal(1),
        public productor: Unit = null
    ) { }

    getprodPerSec(): decimal.Decimal {
        if (this.unit.unlocked) {
            let effBonus = Decimal(1)
            if (this.efficiency.lessThan(0) && this.unit.upEfficiency)
                effBonus = Decimal.pow(0.98, this.unit.upEfficiency.quantity)

            return this.efficiency.times(this.unit.getProduction()).times(this.unit.percentage).div(100)
                .times(this.productor.worldProdModifiers).times(effBonus)
        }
        else
            return Decimal(0)
    }
}