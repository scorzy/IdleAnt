import { Base } from './base';
import { Production } from '../production';
import { first } from 'rxjs/operator/first';
import { any } from 'codelyzer/util/function';
import * as decimal from 'decimal.js';
import { GameModel } from '../gameModel';
import { GameService } from '../../game.service';
import * as strings from '../strings';
import { Cost } from '../cost';
import { Action, BuyAction } from './action';

export class Unit extends Base {

    toAdd = Decimal(0)

    producedBy = Array<Production>()
    produces = Array<Production>()
    percentage: number = 100

    worldProdModifiers = Decimal(1)
    worldEffModifiers = Decimal(1)
    worldBuyModifiers = Decimal(1)

    actions = Array<Action>()
    buyAction: Action
    upAction: Action
    upSpecial: Action
    upHire: Action

    btType = ""

    constructor(
        public model: GameModel,
        id: string,
        name: string = "",
        description: string = "") {
        super(model, id)
        this.model.unitMap.set(this.id, this)
        this.name = name
        this.description = description
    }

    addProductor(prod: Production) {
        prod.productor = this
        this.producedBy.push(prod)
        prod.unit.produces.push(prod)
    }
    getBoost(): decimal.Decimal {
        return this.model.up1.owned() && this.buyAction ?
            this.buyAction.quantity.times(0.0005).times(
                Decimal.pow(2,
                    (this.upAction ? this.upAction.quantity : Decimal(0))
                ))
            : Decimal(0)
    }
    getProduction() {
        return this.getBoost().plus(1).times(
            Decimal.pow(2,
                this.upSpecial ? this.upSpecial.quantity : Decimal(0)
            ).times(this.worldEffModifiers)
        )
    }

    //     Save and Load
    getData() {
        const data: any = super.getData()
        data.a = this.actions.map(a => a.getData())
        data.w = this.worldProdModifiers
        data.e = this.worldEffModifiers
        data.b = this.worldBuyModifiers
        return data;
    }
    restore(data: any) {
        super.restore(data)
        this.worldProdModifiers = new Decimal(data.w)
        this.worldEffModifiers = new Decimal(data.e)
        this.worldBuyModifiers = new Decimal(data.b)
        for (const s of data.a)
            this.actions.find(a => a.id === s.id).restore(s)
    }
}
