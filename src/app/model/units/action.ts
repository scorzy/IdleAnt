import { Unlocable } from "../utils";
import { Base } from "./base";
import { Unit } from "./unit";
import { Production } from "../production";
import { first } from "rxjs/operator/first";
import { any } from "codelyzer/util/function";
import { GameModel } from "../gameModel";
import { GameService } from "../../game.service";
import { Cost } from "../cost";
import * as decimal from "break_infinity.js";

export class Action extends Base {
  public oneTime = false;
  public up: Action;
  public limit: decimal.Decimal;
  public showNumber = true;
  public show = true;
  public showHide = false;

  realPriceNow = new Array<Cost>();
  maxBuy = new Decimal(0);

  buyFromMenu = true;
  showBuyMenu = false;

  constructor(
    id: string,
    name: string,
    public fn: (number: decimal.Decimal) => boolean,
    public priceF = Array<Cost>(),
    description = "",
    public game: GameModel,
    public unit: Unit = null
  ) {
    super(game, id, name, description);
    this.realPriceNow = this.getCosts();

    this.game.actionList.push(this);
  }

  getRealPrices() {
    if (this.unit)
      return this.priceF.map(
        p =>
          new Cost(
            p.unit,
            p.basePrice.times(this.unit.worldBuyModifiers),
            p.growFactor
          )
      );
    else return this.priceF;
  }
  buy(number: decimal.Decimal = new Decimal(1)) {
    if (number.lessThanOrEqualTo(0)) return false;

    if (this.unlocked) {
      const prices = this.getCosts(number);
      if (
        prices.filter(v => v.basePrice.greaterThan(v.unit.quantity)).length ===
        0
      ) {
        prices.forEach(p => {
          p.unit.quantity = p.unit.quantity.minus(p.basePrice);
          this.game.currentEarning = this.game.currentEarning.plus(p.basePrice);
        });
        this.quantity = this.quantity.plus(number);
        if (this.fn) this.fn(number);
        if (this.oneTime) this.unlocked = false;

        this.game.isChanged = true;
        this.game.reloadProduction();
        this.realPriceNow = this.getCosts();
        this.setMaxBuy();
        return true;
      }
    }
    return false;
  }
  getCosts(number: decimal.Decimal = new Decimal(1)) {
    const price = this.getRealPrices();
    return price.map(c => {
      const constRet = new Cost();
      constRet.unit = c.unit;
      if (!c.growFactor.equals(1))
        constRet.basePrice = c.basePrice
          .times(
            c.growFactor
              .pow(this.quantity)
              .times(c.growFactor.pow(number).minus(1))
          )
          .div(c.growFactor.minus(1))
          .ceil();
      else constRet.basePrice = c.basePrice.times(number).ceil();
      return constRet;
    });
  }
  getBuyMax(): decimal.Decimal {
    if (!this.unlocked) return new Decimal(0);

    const price = this.getRealPrices();

    //    https://blog.kongregate.com/the-math-of-idle-games-part-i/
    let max = new Decimal(Number.POSITIVE_INFINITY);
    for (const p of price) {
      max = Decimal.min(
        max,
        Math.floor(
          p.growFactor.lessThanOrEqualTo(1)
            ? p.unit.quantity.div(p.basePrice)
            : p.growFactor
                .minus(1)
                .times(p.unit.quantity)
                .div(p.growFactor.pow(this.quantity).times(p.basePrice))
                .plus(1)
                .log(p.growFactor)
        )
      );
    }
    if (this.oneTime && max.greaterThanOrEqualTo(1)) return new Decimal(1);

    if (this.limit)
      max = Decimal.min(max, this.limit.minus(this.quantity).plus(1));

    return max;
  }
  owned(): boolean {
    return this.quantity.greaterThan(0);
  }
  reload() {
    this.realPriceNow = this.getCosts();
  }
  setMaxBuy() {
    if (this.oneTime) {
      this.maxBuy =
        !this.owned() && this.checkBuy() ? new Decimal(1) : new Decimal(0);
    } else {
      this.maxBuy = this.getBuyMax();
    }
  }
  checkBuy() {
    if (!this.unlocked) return false;
    this.realPriceNow = this.getCosts();
    const size1 = this.realPriceNow.length;
    for (let i = 0; i < size1; i++)
      if (
        this.realPriceNow[i].basePrice.greaterThan(
          this.realPriceNow[i].unit.quantity
        )
      )
        return false;

    return true;
  }
  getId() {
    return (this.unit ? this.unit.id : "") + "_" + this.id;
  }
  getData() {
    const data = super.getData();
    data.sh = this.show;
    data.bfm = this.buyFromMenu;
    return data;
  }
  restore(data: any) {
    super.restore(data);
    this.show = true;
    if ("sh" in data) this.show = data.sh;
    if ("bfm" in data) this.buyFromMenu = data.bfm;
  }
  initialize() {
    super.initialize();
    this.show = true;
  }
}

export class BuyAction extends Action {
  constructor(
    game: GameModel,
    unit: Unit,
    cost: Cost[],
    public doNext: () => any = null
  ) {
    super(
      "actBuy",
      "Hire",
      n => {
        this.unit.quantity = this.unit.quantity.plus(
          n.times(
            this.unit.upHire
              ? this.unit.upHire.quantity.plus(1)
              : new Decimal(1)
          )
        );
        if (this.doNext) this.doNext();
        return true;
      },
      cost,
      "Get more units.",
      game,
      unit
    );
    unit.buyAction = this;
  }
  initialize() {
    super.initialize();
    this.unlocked = false;
  }
}

export class BuyAndUnlockAction extends BuyAction {
  constructor(
    game: GameModel,
    public unit: Unit,
    public cost: Cost[],
    public toUnlock: Base[],
    public required = 1,
    public doAfter: () => any = null,
    once = false
  ) {
    super(game, unit, cost, () => {
      if (
        this.toUnlock &&
        this.unit.quantity.greaterThanOrEqualTo(this.required)
      )
        this.unit.model.unlockUnits(this.toUnlock)();

      if (this.doAfter) this.doAfter();
    });
    this.oneTime = once;
  }
}

export class Research extends Action {
  constructor(
    id: string,
    name: string,
    description: string,
    cost: Cost[],
    public toUnlock: Unlocable[],
    public game: GameModel,
    public doAfter: () => any = null
  ) {
    super(
      id,
      name,
      n => {
        if (this.toUnlock) game.unlockUnits(this.toUnlock)();

        if (this.doAfter) this.doAfter();

        return true;
      },
      cost,
      description,
      game
    );
    this.oneTime = true;
    game.resList.push(this);
  }
}

export class UpAction extends Action {
  constructor(game: GameModel, public unit: Unit, costs: [Cost]) {
    super(
      "upA",
      "Teamwork",
      null,
      costs,
      "Get a better production bonus.",
      game,
      unit
    );
    this.unit.upAction = this;
    this.unlocked = false;
  }
}

export class UpSpecial extends Action {
  constructor(game: GameModel, public unit: Unit) {
    super(
      "upS",
      "Experiment",
      null,
      [
        new Cost(unit, new Decimal(100), new Decimal(10)),
        new Cost(
          unit.model.baseWorld.science,
          new Decimal(100),
          new Decimal(12)
        )
      ],
      "Do some experiments to increase the production.",
      game,
      unit
    );
    this.unit.upSpecial = this;
    this.unlocked = false;
  }
}

export class UpHire extends Action {
  constructor(game: GameModel, public unit: Unit, costs: [Cost]) {
    super(
      "upH",
      "Twin",
      n => {
        this.unit.quantity = this.unit.quantity.plus(
          this.unit.buyAction.quantity.times(n)
        );
        return true;
      },
      costs,
      "Get more units for the same price.",
      game,
      unit
    );
    this.unit.upHire = this;
    this.unit.buyAction.up = this;
    this.unlocked = false;
  }
}

export class UnlockProd extends Action {
  constructor(game: GameModel, unit: Unit, cost: Cost[], prod: Production) {
    super(
      "uProd-" + prod.unit.id,
      "Training",
      n => {
        prod.unlocked = true;
        return true;
      },
      cost,
      "Train new units",
      game
    );
    this.oneTime = true;
    this.unlocked = true;
  }
}

export class TimeWarp extends Action {
  constructor(
    game: GameModel,
    public timeUnits: decimal.Decimal,
    public timeName: string
  ) {
    super(
      "actWarp",
      timeName,
      n => {
        game.longUpdate(
          n
            .times(timeUnits)
            .times(1000)
            .toNumber(),
          true
        );
        this.game.isChanged = true;
        return true;
      },
      [new Cost(game.prestige.time, timeUnits, new Decimal(1))],
      "Time warp by " + timeName,
      game
    );
    this.initialize();
  }
  initialize() {
    super.initialize();
    this.unlocked = true;
    this.showNumber = false;
  }
}

export class Resupply extends Action {
  constructor(game: GameModel, unit: Unit, public supplyPrestige: Unit) {
    super(
      "resup",
      "Resupply",
      n => {
        this.unit.quantity = this.unit.quantity.times(1.5);
        return true;
      },
      [],
      "Get 50% more",
      game,
      unit
    );
    this.unit.upResup = this;
  }

  getBuyMax(): decimal.Decimal {
    this.limit = this.unit.prestigeBonusStart.quantity;
    return super.getBuyMax();
  }
}
