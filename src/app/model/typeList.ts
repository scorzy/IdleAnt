import { GameModel } from './gameModel';
import { Base } from './units/base'
import { Unit } from './units/unit'
import { GameService } from '../game.service';

export class TypeList {
  isCollapsed = false
  isEnding = false
  constructor(
    public type = "",
    public list = new Array<Unit>()
  ) { }

  getId() {
    return this.type
  }

  all100() {
    this.list.forEach(u => u.percentage = 100)
    this.list[0].game.isChanged = true
  }
  all0() {
    this.list.forEach(u => u.percentage = 0)
    this.list[0].game.isChanged = true
  }
}
