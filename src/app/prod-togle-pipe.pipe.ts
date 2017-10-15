import { Pipe, PipeTransform } from '@angular/core';
import { TogableProduction } from './model/units/togableProductions';

@Pipe({
  name: 'prodToglePipe'
})
export class ProdToglePipePipe implements PipeTransform {

  transform(value: Array<TogableProduction>, args?: any): any {
    return value.filter(tp => tp.prods[0].unlocked)
  }

}
