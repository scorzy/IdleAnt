import { Pipe, PipeTransform } from '@angular/core';
import { Cost } from './model/cost';
import { Action } from './model/units/action';

@Pipe({
  name: 'pricePipe'
})
export class PricePipePipe implements PipeTransform {

  transform(cost: Cost[], action?: Action): any {

    let price = new Array<Cost>()

    if (action.unit)
      price = cost.map(c =>
        new Cost(c.unit, c.basePrice.times(action.unit.worldBuyModifiers), c.growFactor))
    else
      price = cost

    return price.map(c => {
      const constRet = new Cost()
      constRet.unit = c.unit
      if (!c.growFactor.equals(1))
        constRet.basePrice = c.basePrice.times(
          (c.growFactor.pow(action.quantity)).times(
            (c.growFactor.pow(1)).minus(1))
        ).div(c.growFactor.minus(1)).ceil()
      else
        constRet.basePrice = c.basePrice.times(1).ceil()
      return constRet
    })



  }

}
