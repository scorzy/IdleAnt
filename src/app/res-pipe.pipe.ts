import { Research } from "./model/units/action";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "resPipe", pure: false })
export class ResPipePipe implements PipeTransform {
  transform(value: [Research], args: boolean): any {
    if (!args) return value.filter(i => i.unlocked && !i.owned());
    else return value.filter(i => i.owned());
  }
}
