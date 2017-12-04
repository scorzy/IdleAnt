import { GameModel } from './gameModel';
import { Base } from './units/base'
import { Unit } from './units/unit'
import { GameService } from '../game.service';

export class TypeList {
  isCollapsed = false
  isEnding = false
  uiList = new Array<Unit>()

  constructor(
    public type = "",
    public list = new Array<Unit>()
  ) { }

  getId() {
    return this.type
  }

  allCustom(percent: number) {
    this.list.filter(u => !u.alwaysOn).forEach(u => u.percentage = percent)
    this.list[0].game.isChanged = true
  }
  reload() {
    this.uiList = this.list.filter(u => u.unlocked)
  }
}
