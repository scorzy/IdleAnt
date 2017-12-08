import { Cost } from './cost';
import { GameModel } from './gameModel';
import { Unit } from './units/unit';
import { Base } from './units/base';
import { Action } from './units/action';
import { TypeList } from './typeList';

export class World {

  static worldPrefix = new Array<World>()
  static worldTypes = new Array<World>()
  static worldSuffix = new Array<World>()

  keep = false
  id = ""

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
    public experience = new Decimal(2.5),
    public toUnlockMax = new Array<Cost>(),
  ) { }

  static getBaseWorld(game: GameModel): World {
    const baseWorld = new World(game, "Home", "Nothing special.",
      [],
      [],
      [
        new Cost(game.baseWorld.food, new Decimal(1E12)),
        new Cost(game.baseWorld.nestAnt, new Decimal(40))
      ]
    )
    baseWorld.experience = new Decimal(10)
    return baseWorld
  }

  static getRandomWorld(game: GameModel,
    worldPrefix: World = null, worldType: World = null, worldSuffix: World = null, level: number = -1
  ): World {
    const worldRet = new World(game, "", "", [], [], [])
    worldRet.experience = new Decimal(0)

    if (!worldType)
      worldType = World.worldTypes[Math.floor(Math.random() * (World.worldTypes.length))]
    if (!worldPrefix)
      worldPrefix = World.worldPrefix[Math.floor(Math.random() * (World.worldPrefix.length))]
    if (!worldSuffix)
      worldSuffix = World.worldSuffix[Math.floor(Math.random() * (World.worldSuffix.length))]

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

    if (!worldRet.unlockedUnits.map(p => p[0]).includes(game.infestation.poisonousPlant)) {
      worldRet.avaiableUnits = worldRet.avaiableUnits
        .filter(u => !game.infestation.listInfestation.map(u2 => u2 as Base).includes(u))
    }

    //    Scale the world level
    if (level < 0) {
      let min = game.minUser
      let max = game.maxUser

      if (!min)
        min = 0
      if (!max)
        max = game.maxMax

      min = Math.min(game.minUser, game.maxMax)
      max = Math.min(game.maxUser, game.maxMax)

      worldRet.level = new Decimal(Math.random()).times(new Decimal(1 + max - min)).floor().plus(min).toNumber()
    } else {
      worldRet.level = Math.min(Math.max(level, 0), game.maxMax)
    }
    // worldRet.level = 1000

    const linear = 1 / 4
    const linearExp = 1 / 2

    const toUnlockMultiplier = new Decimal(worldRet.level + 1 / linear).times(linear)


    // const toUnlockMultiplier = new Decimal(worldRet.level + 1 / linear)
    //   .times(new Decimal(linear).div(Decimal.log(new Decimal(10).plus(new Decimal(worldRet.level).div(125)))))

    const expMultiplier = Decimal.pow(1.00138, worldRet.level).times(new Decimal(worldRet.level + 1 / linearExp).times(linearExp))

    worldRet.toUnlock.forEach(t => t.basePrice = t.basePrice.times(toUnlockMultiplier).floor())
    worldRet.unlockedUnits.forEach(t => t[1] = Decimal.max(t[1].times(toUnlockMultiplier.times(2)).floor(), 0))
    worldRet.experience = worldRet.experience.times(expMultiplier).plus(0.5).floor()

    game.unitLists.splice(0, game.unitLists.length)

    //  World better effect
    worldRet.prodMod.filter(pm => pm[1].greaterThan(0))
      .forEach(pm2 => pm2[1] = pm2[1].times(game.prestige.worldBetter.quantity.times(0.5).plus(1)))
    worldRet.unitMod.filter(pm => pm[1].greaterThan(0))
      .forEach(pm2 => pm2[1] = pm2[1].times(game.prestige.worldBetter.quantity.times(0.5).plus(1)))

    // game.isChanged = true
    worldRet.setDepartments()
    return worldRet
  }

  goTo(skip = false) {

    if (!skip) {
      const earned = this.game.world.experience
      this.game.prestige.experience.quantity = this.game.prestige.experience.quantity.plus(earned)
      this.game.maxLevel = this.game.maxLevel.plus(earned)
      this.game.prestigeDone = this.game.prestigeDone.plus(1)
    }
    this.game.setInitialStat()

    // const le = this.game.lifeEarning
    // const exp = this.game.prestige.experience.quantity.plus(this.game.getExperience())


    // if (!skip) {
    //   this.game.prestige.experience.quantity = exp
    //   this.game.maxLevel = this.game.maxLevel.plus(exp)
    //   this.game.prestigeDone = this.game.prestigeDone.plus(1)
    // }

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
    this.game.all.forEach(u => u.reloadtAct())

    //  research fix
    this.game.resList.forEach(r => r.quantity = new Decimal(0))

    this.game.worldTabAv = true
    this.game.homeTabAv = true
    this.game.expTabAv = true

    this.game.reloadProduction()
    this.game.unitLists = new Array<TypeList>()
    // this.game.reloadList()

    this.game.generateRandomWorld(true)
    this.game.isChanged = true

  }
  getData() {
    const data: any = {}
    data.n = this.name
    if (this.avaiableUnits)
      data.a = this.avaiableUnits.map(b => b.id)
    if (this.prodMod)
      data.p = this.prodMod.map(p => [p[0].id, p[1]])
    data.t = this.toUnlock.map(c => c.getData())
    data.m = this.toUnlockMax.map(c => c.getData())
    data.um = this.unitMod.map(up => [up[0].id, up[1]])
    data.up = this.unitPrice.map(up => [up[0].id, up[1]])
    data.uu = this.unlockedUnits.map(up => [up[0].id, up[1]])
    data.e = this.experience
    data.l = this.level
    data.keep = this.keep
    return data
  }
  restore(data: any, setDep: boolean = false) {
    this.name = data.n

    this.avaiableUnits = []
    if (typeof data.a !== "undefined" && data.a != null && data.a.length > 0)
      this.avaiableUnits = data.a.map(a => this.game.allBase.find(u => u.id === a))

    this.prodMod = []
    if (typeof data.p !== "undefined" && data.p != null && data.p.length > 0)
      this.prodMod = data.p.map(p => [this.game.all.find(u => u.id === p[0]), new Decimal(p[1])])

    this.toUnlock = []
    if (typeof data.t !== "undefined" && data.t != null && data.t.length > 0)
      this.toUnlock = data.t.map(c => this.game.getCost(c))

    this.toUnlockMax = []
    if (typeof data.m !== "undefined" && data.m != null && data.m.length > 0)
      this.toUnlockMax = data.m.map(c => this.game.getCost(c))

    this.unitMod = []
    if (typeof data.um !== "undefined" && data.um != null && data.um.length > 0)
      this.unitMod = data.um.map(p => [this.game.all.find(u => u.id === p[0]), new Decimal(p[1])])

    this.unitPrice = []
    if (typeof data.up !== "undefined" && data.up != null && data.up.length > 0)
      this.unitPrice = data.up.map(p => [this.game.all.find(u => u.id === p[0]), new Decimal(p[1])])

    this.unlockedUnits = []
    if (typeof data.uu !== "undefined" && data.uu != null && data.uu.length > 0)
      this.unlockedUnits = data.uu.map(p => [this.game.allBase.find(u => u.id === p[0]), new Decimal(p[1])])

    this.experience = new Decimal(10)
    if (data.e)
      this.experience = new Decimal(data.e)

    if (data.l)
      this.level = data.l

    if (data.keep)
      this.keep = true

    this.setDepartments(setDep)
  }


  setDepartments(assign: boolean = false) {
    for (let i = 0; i < this.game.engineers.listEnginer.length; i++) {
      const engineer = this.game.engineers.listEnginer[i]
      const dep = this.game.engineers.listDep[i]

      if (!engineer.avabileBaseWorld &&
        !!this.avaiableUnits.find(u => u === engineer)
        && !this.avaiableUnits.find(u => u === dep)) {

        this.avaiableUnits.push(dep)
        if (assign)
          dep.avabileThisWorld = true

      }

    }
  }

}
