import { Unlocable } from '../utils';
import { GameModel } from '../gameModel';
import { Action } from './action';

// export enum Type {
//   Material,
//   Generator,
//   Ant,
//   Bee,
//   Food,
//   Crystal,
//   Soil,
//   Fungus,
//   Wood,
//   Sand,
//   Machinery,
//   Engineer,
//   Other,
//   Scientist,
//   Laser,
//   Farmer,
//   Mining,
//   SoilG,
//   WoodG
// }

export class Base extends Unlocable {

  endIn = 0
  buyAction: Action

  constructor(
    public game: GameModel,
    public id: string,
    public name = "",
    public description = "",
    // public types: Type[] = [],
    unlocked = false,
    public quantity = new Decimal(0),
    public avabileBaseWorld = true,
    public avabileThisWorld = true
  ) {
    super(unlocked)
    this.game.allBase.push(this)
  }

  //     Save and Load
  getData() {
    const data: any = {}
    if (this.quantity.greaterThan(0))
      data.q = this.quantity
    if (this.unlocked)
      data.u = this.unlocked
    data.id = this.id
    data.atw = this.avabileThisWorld
    return data;
  }
  restore(data: any) {
    if (data.q)
      this.quantity = new Decimal(data.q)
    else
      this.quantity = new Decimal(0)
    if (data.u)
      this.unlocked = data.u
    else
      this.unlocked = false
    if (data.atw)
      this.avabileThisWorld = data.atw
  }

  initialize() {
    this.unlocked = false
    this.quantity = new Decimal(0)
    this.avabileThisWorld = this.avabileBaseWorld
  }
  isEnding(): boolean {
    return this.endIn < Number.POSITIVE_INFINITY
  }
  isStopped() { return false }
  haveUp() { return false }

  getId() {
    return this.id
  }
}
