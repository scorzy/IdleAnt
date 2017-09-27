import { Cost } from './cost';
import { GameModel } from './gameModel';
import { Unit } from './units/unit';
import { Base } from './units/base';
import { Action } from './units/action';

export class World {

  static worldPrefix = new Array<World>()
  static worldTypes = new Array<World>()
  static worldSuffix = new Array<World>()

  public prestige: Action
  public level = 1

  constructor(
    public game: GameModel,
    public name: string,
    public description: string,
    public avaiableUnits: Base[],
    public prodMod: [Unit, decimal.Decimal][],
    public toUnlock: Cost[],
    public unitMod: [Unit, decimal.Decimal][] = [],
    public unitPrice: [Unit, decimal.Decimal][] = [],
    public unlockedUnits: [Base, decimal.Decimal][] = [],
    public experience = Decimal(2.5),
    public toUnlockMax = new Array<Cost>()
  ) { }

  static getBaseWorld(game: GameModel): World {
    const baseWorld = new World(game, "Home", "Nothing special.",
      [],
      [],
      [
        new Cost(game.baseWorld.food, Decimal(1E1)),
        new Cost(game.baseWorld.nestAnt, Decimal(100))
      ]
    )
    baseWorld.experience = Decimal(10)
    return baseWorld
  }
  static getRandomWorld(game: GameModel): World {
    const worldRet = this.getBaseWorld(game)
    worldRet.experience = Decimal(0)

    const worldType = World.worldTypes[Math.floor(Math.random() * (World.worldTypes.length))]
    const worldPrefix = World.worldPrefix[Math.floor(Math.random() * (World.worldPrefix.length))]
    const worldSuffix = World.worldSuffix[Math.floor(Math.random() * (World.worldSuffix.length))]

    const worlds = [worldType, worldPrefix, worldSuffix, this.getBaseWorld(game)]
    worldRet.name = worldPrefix.name + " " + worldType.name + " " + worldSuffix.name
    worldRet.description = worldPrefix.description +
      (!!worldType.description ? '\n' + worldType.description : "") +
      (!!worldSuffix.description ? '\n' + worldSuffix.description : "")

    worlds.forEach(w => {
      w.prodMod.forEach(p => {
        const prod = worldRet.prodMod.find(p1 => p1[0].id === p[0].id)
        if (prod)
          prod[1] = prod[1].times(p[1])
        else
          worldRet.prodMod.push([p[0], p[1]])
      })
      w.unitMod.forEach(p => {
        const prod = worldRet.unitMod.find(p1 => p1[0].id === p[0].id)
        if (prod)
          prod[1] = prod[1].times(p[1])
        else
          worldRet.unitMod.push([p[0], p[1]])
      })
      w.unitPrice.forEach(p => {
        const prod = worldRet.unitPrice.find(p1 => p1[0].id === p[0].id)
        if (prod)
          prod[1] = prod[1].times(p[1])
        else
          worldRet.unitPrice.push([p[0], p[1]])
      })
      w.toUnlock.forEach(p => {
        const toUnlock = worldRet.toUnlock.find(c => c.unit.id === p.unit.id)
        if (toUnlock)
          toUnlock.basePrice = toUnlock.basePrice.plus(p.basePrice)
        else
          worldRet.toUnlock.push(new Cost(p.unit, p.basePrice))
      })
      w.toUnlockMax.forEach(p => {
        const toUnlockMax = worldRet.toUnlockMax.find(c => c.unit.id === p.unit.id)
        if (toUnlockMax)
          toUnlockMax.basePrice = toUnlockMax.basePrice.plus(p.basePrice)
        else
          worldRet.toUnlockMax.push(new Cost(p.unit, p.basePrice))
      })
      w.unlockedUnits.forEach(p => {
        const unlockedUnits = worldRet.unlockedUnits.find(p1 => p1[0].id === p[0].id)
        if (unlockedUnits)
          unlockedUnits[1] = unlockedUnits[1].plus(p[1])
        else
          worldRet.unlockedUnits.push([p[0], p[1]])
      })
      worldRet.experience = worldRet.experience.plus(w.experience)
      worldRet.avaiableUnits = worldRet.avaiableUnits.concat(w.avaiableUnits)
    })

    //  remove default stat
    worldRet.prodMod = worldRet.prodMod.filter(pm => pm[1].minus(1).abs().greaterThan(Number.EPSILON))
    worldRet.unitMod = worldRet.unitMod.filter(pm => pm[1].minus(1).abs().greaterThan(Number.EPSILON))
    worldRet.unitPrice = worldRet.unitPrice.filter(pm => pm[1].minus(1).abs().greaterThan(Number.EPSILON))

    worldRet.avaiableUnits = Array.from(new Set(worldRet.avaiableUnits))
    worldRet.experience = worldRet.experience.minus(7.5)

    //    Set the world level
    let maxLevel = game.prestige.allPrestigeUp.map(u => u.quantity)
      .reduce((prev, prest) => prev.plus(prest)).plus(game.prestige.experience.quantity)
    maxLevel = maxLevel.greaterThan(7) ? Decimal(maxLevel.minus(6).div(2), 1.15).floor() : maxLevel
    worldRet.level = Math.min(maxLevel.times(Decimal.random()).floor().toNumber(), 100)

    const toUnlockMultiplier = Decimal.pow(1.07, worldRet.level)
    const expMultiplier = Decimal.pow(1.075, worldRet.level)
    worldRet.toUnlock.forEach(t => t.basePrice = t.basePrice.times(toUnlockMultiplier))
    worldRet.experience = worldRet.experience.times(expMultiplier)

    return worldRet
  }

  goTo(skip = false) {
    const le = this.game.lifeEarning
    const exp = this.game.prestige.experience.quantity.plus(this.game.getExperience())
    this.game.setInitialStat()
    if (!skip) {
      this.game.prestige.experience.quantity = exp
      this.game.prestigeDone = this.game.prestigeDone.plus(1)
    }
    if (this.avaiableUnits)
      this.avaiableUnits.forEach(u => u.avabileThisWorld = true)
    if (this.unlockedUnits) {
      this.unlockedUnits.forEach(u => {
        u[0].avabileThisWorld = true
        u[0].quantity = u[1]
      })
      this.game.unlockUnits(this.unlockedUnits.map(u => u[0]))()
    }
    if (this.prodMod)
      this.prodMod.forEach(p => p[0].worldProdModifiers = p[1])
    if (this.unitMod)
      this.unitMod.forEach(p => p[0].worldEffModifiers = p[1])
    if (this.unitPrice)
      this.unitPrice.forEach(p => p[0].worldBuyModifiers = p[1])


    this.game.world = this
    this.game.world.generateAction(this.game)


  }
  getData() {
    const data: any = {}
    data.n = this.name
    if (this.avaiableUnits)
      data.a = this.avaiableUnits.map(b => b.id)
    if (this.prodMod)
      data.p = this.prodMod.map(p => [p[0].id, p[1]])
    data.t = this.toUnlock.map(c => c.getData())
    data.um = this.unitMod.map(up => [up[0].id, up[1]])
    data.up = this.unitPrice.map(up => [up[0].id, up[1]])
    data.uu = this.unlockedUnits.map(up => [up[0].id, up[1]])
    data.e = this.experience
    data.l = this.level
    return data
  }
  restore(data: any) {
    this.name = data.n

    if (typeof data.a !== "undefined" && data.a != null && data.a.length > 0)
      this.avaiableUnits = data.a.map(a => this.game.allBase.find(u => u.id === a))
    if (typeof data.p !== "undefined" && data.p != null && data.p.length > 0)
      this.prodMod = data.p.map(p => [this.game.all.find(u => u.id === p[0]), Decimal(p[1])])
    if (typeof data.t !== "undefined" && data.t != null && data.t.length > 0)
      this.toUnlock = data.t.map(c => this.game.getCost(c))
    if (typeof data.um !== "undefined" && data.um != null && data.um.length > 0)
      this.unitMod = data.um.map(p => [this.game.all.find(u => u.id === p[0]), Decimal(p[1])])
    if (typeof data.up !== "undefined" && data.up != null && data.up.length > 0)
      this.unitPrice = data.up.map(p => [this.game.all.find(u => u.id === p[0]), Decimal(p[1])])
    if (typeof data.uu !== "undefined" && data.uu != null && data.uu.length > 0)
      this.unlockedUnits = data.uu.map(p => [this.game.allBase.find(u => u.id === p[0]), Decimal(p[1])])
    if (data.e)
      this.experience = new Decimal(data.e)

    if (data.l)
      this.level = data.l
  }
  generateAction(game: GameModel) {
    this.prestige = new Action("pres", "", null, this.toUnlock, "", game)
    this.prestige.priceF.forEach(pf => pf.growFactor = Decimal(10))
    this.prestige.unlocked = true
  }
}
