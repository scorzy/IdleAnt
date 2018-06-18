import { GameModel } from "./gameModel";
import { Base } from "./units/base";
import { Unit } from "./units/unit";
import { GameService } from "../game.service";

export class TypeList {
  isCollapsed = false;
  isEnding = false;
  uiList = new Array<Unit>();

  constructor(public type = "", public list = new Array<Unit>()) {}

  getId() {
    return this.type;
  }

  allCustom(percent: number) {
    this.list.filter(u => !u.alwaysOn).forEach(u => (u.percentage = percent));
    this.list[0].game.isChanged = true;
  }
  reload() {
    this.uiList = this.list.filter(u => u.unlocked);
  }
  buyN() {
    const n = this.getReqNum(this.list[0].game);
    this.list
      .filter(
        u =>
          u.unlocked &&
          u.buyAction &&
          u.buyAction.unlocked &&
          u.buyAction.buyFromMenu
      )
      .sort((a, b) => a.quantity.cmp(b.quantity))
      .forEach(un => un.buyAction.buy(n));
  }
  buyTwins() {
    this.list
      .filter(
        u => u.unlocked && u.upHire && u.upHire.unlocked && u.upHire.buyFromMenu
      )
      .sort((a, b) => a.upHire.quantity.cmp(b.upHire.quantity))
      .forEach(un => un.upHire.buy(new Decimal(1)));
  }
  buyTeam() {
    this.list
      .filter(
        u =>
          u.unlocked &&
          u.upAction &&
          u.upAction.unlocked &&
          u.upAction.buyFromMenu
      )
      .sort((a, b) => a.upAction.quantity.cmp(b.upAction.quantity))
      .forEach(un => un.upAction.buy(new Decimal(1)));
  }

  getReqNum(game: GameModel): decimal.Decimal {
    if (!game.buyMulti || game.buyMulti < 1) return new Decimal(1);

    return new Decimal(game.buyMulti);
  }
}
