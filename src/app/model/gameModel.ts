import { Engineers } from './worlds/engineer';
import { World } from './world';
import { DefaultUrlHandlingStrategy } from '@angular/router/src/url_handling_strategy';
import { Utils, Unlocable } from './utils';
import { Base } from './units/base';
import { Cost } from './cost';
import { Alert, alertArray, IAlert } from './alert';
import { TypeList } from './typeList';
import { Action, BuyAction, BuyAndUnlockAction, Research, UpHire, UpSpecial, UnlockProd, UpAction } from './units/action';
import { Production } from './production';
import { Map } from 'rxjs/util/Map';
import { Data } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { isAsciiLetter } from 'codelyzer/angular/styles/chars';
import { Logger } from 'protractor/built/logger'
import { Unit } from './units/unit';
import { Component, Injectable, Input } from '@angular/core'
import * as LZString from 'lz-string';
import { BaseWorld } from './worlds/baseWorld';
import { WorldInterface } from './worlds/worldInterface';
import { Machine } from './worlds/machine';
import { Bee } from './worlds/bee';
import { Forest } from './worlds/forest';
import { Beach } from './worlds/beach';
import { Frozen } from './worlds/frozen';
import { Researchs } from './worlds/researchs';
import { Prestige } from './worlds/prestige';
import { Infestation } from './worlds/inferstation';
import { Science } from './worlds/science';
import { Options } from './options';

export class GameModel {

  isChanged = true
  timeToEnd = Number.POSITIVE_INFINITY
  gameVersion = "0.2.0"
  hideSaveNotification = false

  options: Options = new Options()
  buyMulti = 1

  //#region
  //    Cost
  buyExp = new Decimal(1.1)
  buyExpUnit = new Decimal(1)
  scienceCost1 = new Decimal(100)
  scienceCost2 = new Decimal(1E3)
  scienceCost3 = new Decimal(1E4)
  scienceCost4 = new Decimal(1E5)
  upgradeScienceExp = new Decimal(4)
  upgradeScienceHireExp = new Decimal(6)

  actionList = new Array<Action>()

  //  Worlds
  baseWorld: BaseWorld
  science: Science
  machines: Machine
  engineers: Engineers
  bee: Bee
  forest: Forest
  beach: Beach
  frozen: Frozen
  infestation: Infestation
  research: Researchs
  prestige: Prestige

  //  Research
  resList = Array<Research>()

  worldList = Array<WorldInterface>()

  unitMap: Map<string, Unit> = new Map()
  all: Array<Unit>
  unl: Array<Unit>
  allBase: Array<Base>
  lists = new Array<TypeList>()
  uiLists = new Array<TypeList>()
  unitWithUp = new Array<Unit>()

  //    Prestige
  currentEarning = new Decimal(0)
  lifeEarning = new Decimal(0)
  world: World
  nextWorlds: World[]
  prestigeDone = new Decimal(0)
  maxLevel = new Decimal(0)

  worldTabAv = false
  expTabAv = false
  homeTabAv = false

  minUser = 0
  maxUser = 1000
  maxMax = 1000

  // ui stuff
  isLab = false
  activeUnit: Unit
  pause = false

  actMin: Action
  actHour: Action
  timeModalOpened = false

  unitLists = new Array<TypeList>()

  skip = false
  //#endregion

  constructor() { this.initialize() }

  initialize() {

    this.currentEarning = new Decimal(0)
    this.allBase = []
    this.unitMap = new Map()
    this.lists = new Array<TypeList>()

    this.worldList = Array<WorldInterface>()

    this.baseWorld = new BaseWorld(this)
    this.science = new Science(this)
    this.machines = new Machine(this)
    this.engineers = new Engineers(this)
    this.bee = new Bee(this)
    this.forest = new Forest(this)
    this.beach = new Beach(this)
    this.frozen = new Frozen(this)
    this.infestation = new Infestation(this)
    this.research = new Researchs(this)
    this.prestige = new Prestige(this)

    this.worldList.push(this.baseWorld)
    this.worldList.push(this.science)
    this.worldList.push(this.machines)
    this.worldList.push(this.engineers)
    this.worldList.push(this.forest)
    this.worldList.push(this.bee)
    this.worldList.push(this.beach)
    this.worldList.push(this.frozen)
    this.worldList.push(this.infestation)
    this.worldList.push(this.prestige)

    this.worldList.push(this.research)

    this.worldList.forEach(w => w.declareStuff())
    this.worldList.forEach(w => w.initStuff())
    this.worldList.forEach(w => w.addWorld())

    this.all = Array.from(this.unitMap.values()).filter(u => !u.neverEnding)

    this.all.forEach(u => {
      if (u.upHire)
        u.upHire.showHide = true

      if (u.upAction)
        u.upAction.showHide = true

      if (u.upSpecial)
        u.upSpecial.showHide = true
    })

    this.world = World.getBaseWorld(this)

    this.generateRandomWorld()

    this.setInitialStat()
    this.prestige.expLists.forEach(v => v.reload())

    // console.log("prefix: " + World.worldPrefix.length)
    // console.log("type: " + World.worldTypes.length)
    // console.log("suff: " + World.worldSuffix.length)

  }
  setInitialStat() {
    this.all.forEach(u => {
      u.initialize()
      u.actions.forEach(a => a.initialize())
    })
    this.resList.forEach(r => r.initialize())
    this.baseWorld.food.unlocked = true
    this.baseWorld.littleAnt.unlocked = true
    this.baseWorld.littleAnt.buyAction.unlocked = true
    this.research.rDirt.unlocked = true

    this.unitWithUp = new Array<Unit>()
    this.unitWithUp.push(this.baseWorld.littleAnt)

    this.baseWorld.food.quantity = this.baseWorld.food.quantity.plus(100)

    this.unlockUnits(this.all.filter(u => u.quantity.greaterThan(0)))()
    this.unl = this.all.filter(u => u.unlocked)
    this.reloadProduction()
    this.reloadLists()
    //  this.reloadList()

  }

  setMaxLevel() {
    this.maxMax = Decimal.min(this.maxLevel.div(12), 10000).floor().toNumber()
    this.maxUser = Decimal.min(this.maxUser, this.maxMax).floor().toNumber()
  }

  getProduction(prod: Production,
    level: decimal.Decimal,
    factorial: decimal.Decimal,
    fraction: decimal.Decimal,
    previous = new Decimal(1)
  ): decimal.Decimal {

    let ret = new Decimal(0)

    const production = prod.prodPerSec

    if (prod.isActive())
      ret = Decimal.pow(fraction, level)                    //    exponential
        .times(prod.unit.quantity)                          //    time
        .times(production)                        //    efficenty
        .div(factorial)
        .times(previous)

    const prod2 = prod.unit.producedBy.filter(p => p.isActive())
    for (const p2 of prod2)
      ret = ret.plus(
        this.getProduction(p2,
          level.plus(1),
          factorial.times(level.plus(1)),
          fraction,
          production.times(previous)
        )
      )
    return ret
  }

  /**
   * Perform an update taking care of negative production.
   * If a resource end all consumer will be stopped and the function will be called again.
   * Can handle only 3 level of producer/consumer (it solve equation un to cubic)
   *
   * @param dif time elapsed in millisecond
   */
  longUpdate(dif: number, forceUp = false) {

    let maxTime = dif
    let unitZero: Unit = null

    //  Infestation fix 2
    if (this.infestation.poisonousPlant.unlocked && this.infestation.poisonousPlant.quantity.lessThan(1))
      this.infestation.poisonousPlant2.quantity = new Decimal(0)

    this.all.forEach(u => u.produces.forEach(p => p.reload()))
    this.isChanged = true
    // console.log(this.timeToEnd + " " + dif)
    if (this.isChanged || dif > this.timeToEnd || dif > 1000) {
      //  reload max time

      this.timeToEnd = Number.POSITIVE_INFINITY

      this.lists.forEach(l => l.isEnding = false)

      this.all.filter(u => u.quantity.lessThan(1)).forEach(res => {
        res.producedBy.filter(p => p.efficiency.lessThan(0))
          .forEach(p => p.unit.percentage = 0)
      })

      this.all.forEach(a => a.endIn = Number.POSITIVE_INFINITY)

      for (const res of this.unl) {

        res.a = new Decimal(0)
        res.b = new Decimal(0)
        res.c = new Decimal(0)
        const d = res.quantity

        for (const prod1 of res.producedBy.filter(r => r.isActive() && r.unit.unlocked)) {
          // x
          const prodX = prod1.prodPerSec
          if (res.id === "food")
            console.log(prodX)
            console.log(prod1.unit.quantity)
          res.c = res.c.plus(prodX.times(prod1.unit.quantity))
          for (const prod2 of prod1.unit.producedBy.filter(r2 => r2.isActive() && r2.unit.unlocked)) {
            // x^2
            const prodX2 = prod2.prodPerSec.times(prodX)
            res.b = res.b.plus(prodX2.times(prod2.unit.quantity))
            for (const prod3 of prod2.unit.producedBy.filter(r3 => r3.isActive() && r3.unit.unlocked)) {
              // x^3
              const prodX3 = prod3.prodPerSec.times(prodX2)
              res.a = res.a.plus(prodX3.times(prod3.unit.quantity))
            }
          }
        }
        res.a = res.a.div(6)
        res.b = res.b.div(2)

        if (res.id === "food")
          console.log(res.a + " " + res.b + " " + res.c)

        if (res.a.lessThan(0)
          || res.b.lessThan(0)
          || res.c.lessThan(0)
          || d.lessThan(0)) {

          const solution = Utils.solveCubic(res.a, res.b, res.c, d).filter(s => s.greaterThan(0))

          if (d.lessThan(Number.EPSILON)) {
            res.quantity = new Decimal(0)
          }

          for (const s of solution) {

            if (maxTime > s.toNumber() * 1000) {
              maxTime = s.toNumber() * 1000
              unitZero = res
            }
            res.endIn = Math.min(s.times(1000).toNumber(), res.endIn)
            this.timeToEnd = Math.min(this.timeToEnd, res.endIn)
            // console.log("End " + this.timeToEnd)
          }
        }
      }
      // console.log("long end")
      this.isChanged = false
    } else {
      // console.log("short")
      this.timeToEnd = this.timeToEnd - dif
    }

    this.unl.filter(u => u.endIn > 0).forEach(u => u.endIn = u.endIn - dif)

    //  Update resource
    if (!this.pause || forceUp) {
      if (maxTime > Number.EPSILON)
        this.update2(new Decimal(maxTime).div(1000))
      if (unitZero) {
        unitZero.producedBy.filter(p => p.efficiency.lessThan(0)).forEach(p => p.unit.percentage = 0)

        // fix for infestatiion world
        if (unitZero === this.infestation.poisonousPlant) {
          this.infestation.poisonousPlant2.quantity = new Decimal(0)
        }
      }
      const remaning = dif - maxTime
      if (remaning > Number.EPSILON) {
        this.isChanged = true
        this.reloadProduction()
        this.longUpdate(remaning)
      }
    }
    //  this.reloadProduction()
  }

  /**
   * Called when update end, adjust some values.
   */
  postUpdate() {
    this.all.filter(u => u.quantity.lessThan(Number.EPSILON)).forEach(u => u.quantity = new Decimal(0))

    this.lists.forEach(l => l.isEnding = !!l.uiList.find(u => u.isEnding()))

    this.all.filter(un => un.unlocked).forEach(u => {
      u.reloadUiPerSec()
    })
    if (this.isLab)
      this.checkResearch()

    if (this.activeUnit)
      this.activeUnit.reloadAtcMaxBuy()

    // if (this.timeModalOpened) {
    this.prestige.time.reloadAtcMaxBuy()
    // }
  }

  /**
   * Perform an update without handling negative quantity number, can result in negative quantity.
   *
   * @param dif time elapsed in millisecond
   */
  // update(dif: number) {
  //   const fraction = new Decimal(dif / 1000)
  //   const all = Array.from(this.unitMap.values())
  //   for (const res of all)
  //     for (const prod of res.producedBy.filter(p => p.isActive() && p.unit.unlocked))
  //       res.toAdd = res.toAdd.plus(this.getProduction(prod, new Decimal(1), new Decimal(1), fraction))

  //   // all.forEach(u => {
  //   //   u.quantity = u.quantity.plus(u.toAdd)
  //   //   u.toAdd = new Decimal(0)
  //   // })

  //   for (const u of all) {
  //     u.quantity = u.quantity.plus(u.toAdd)
  //     u.toAdd = new Decimal(0)
  //   }
  // }

  update2(dif: decimal.Decimal) {
    this.unl.forEach(u => {

      u.quantity = u.quantity
        .plus(u.a.times(Decimal.pow(dif, 3)))
        .plus(u.b.times(Decimal.pow(dif, 2)))
        .plus(u.c.times(dif))
    })
  }

  /**
   * Unlock units and recheck dependencies.
   */
  unlockUnits(units: Unlocable[], message: string = null) {
    return () => {
      let ok = false
      units.filter(u => u.avabileThisWorld).forEach(u => {
        ok = ok || (!u.unlocked)
        u.unlocked = true
        if (u instanceof Unit)
          if (u.buyAction)
            u.buyAction.unlocked = true
      })

      this.all.filter(u => u.unlocked).forEach(u2 => u2.produces.forEach(p =>
        p.product.unlocked = p.product.avabileThisWorld))

      if (ok) {
        this.unitWithUp = this.all.filter(u => u.unlocked && (u.upHire || u.upSpecial || u.upAction))
        this.unl = this.all.filter(u => u.unlocked)
        this.reloadLists()
      }

      // if (ok)
      //   this.reloadList()

      return ok
    }
  }

  /**
   * Initialize 3 random world
   */
  generateRandomWorld(force: boolean = false) {
    if (!this.nextWorlds || force) {
      this.nextWorlds = [
        World.getRandomWorld(this),
        World.getRandomWorld(this),
        World.getRandomWorld(this)
      ]
    } else {
      for (let i = 0; i < 3; i++) {
        if (!this.nextWorlds[i].keep)
          this.nextWorlds[i] = World.getRandomWorld(this)
      }
    }

    for (let i = 0; i < 3; i++) {
      this.nextWorlds[i].id = "" + i
    }
  }

  /**
   * Get a savegame
   */
  getSave(): string {
    const save: any = {}
    save.list = Array.from(this.unitMap.entries()).map(v => v[1].getData())
    save.last = Date.now()
    save.cur = this.currentEarning
    save.life = this.lifeEarning
    save.w = this.world.getData()
    save.nw = this.nextWorlds.map(w => w.getData())
    // save.pre = this.prestige.allPrestigeUp.map(p => p.getData())
    save.res = this.resList.map(r => r.getData())
    save.pd = this.prestigeDone
    save.worldTabAv = this.worldTabAv
    save.expTabAv = this.expTabAv
    save.ml = this.maxLevel
    save.htv = this.homeTabAv
    save.pause = this.pause
    save.hsn = this.hideSaveNotification
    save.gameVers = this.gameVersion
    save.opti = this.options

    return LZString.compressToBase64(JSON.stringify(save))

  }

  /**
   * Load a savegame
   * @param saveRaw
   */
  load(saveRaw: string): number {
    this.isChanged = true
    if (saveRaw) {
      this.setInitialStat()
      saveRaw = LZString.decompressFromBase64(saveRaw)
      const save = JSON.parse(saveRaw)
      // console.log(saveRaw)
      this.currentEarning = new Decimal(save.cur)
      this.lifeEarning = new Decimal(save.life)
      this.world.restore(save.w, true)
      this.maxLevel = new Decimal(save.ml)

      for (const s of save.list) {
        const unit = this.unitMap.get(s.id)
        if (unit)
          unit.restore(s)
      }

      this.nextWorlds[0].restore(save.nw[0])
      this.nextWorlds[1].restore(save.nw[1])
      this.nextWorlds[2].restore(save.nw[2])

      for (const s of save.res) {
        const res = this.resList.find(p => p.id === s.id)
        if (res)
          res.restore(s)
      }

      if (save.pd)
        this.prestigeDone = new Decimal(save.pd)

      if (save.worldTabAv)
        this.worldTabAv = save.worldTabAv

      if (save.expTabAv)
        this.expTabAv = save.expTabAv

      if (save.htv)
        this.homeTabAv = save.htv

      this.reloadProduction()

      //  Fixes for older savegame, corrupted...
      this.science.science1Production.unlocked = true

      this.resList.filter(r => r.owned()).forEach(r =>
        r.toUnlock.filter(t => t instanceof Research && !t.owned())
          .forEach(t2 => t2.unlocked = true)
      )

      this.unitWithUp = this.all.filter(u => u.unlocked && (u.upHire || u.upSpecial || u.upAction))

      //  fixing for old version
      if (save.gameVers && save.gameVers === "0.0.1") {

        const linear = 1 / 4
        const toUnlockMultiplier = Decimal.pow(1.0005, this.world.level).times(this.world.level + 1 / linear)
          .times(linear)

        this.world.toUnlock.forEach(tu => {

          if (tu.unit === this.baseWorld.nestAnt ||
            tu.unit === this.bee.hiveBee ||
            tu.unit === this.forest.beetleNest) {
            tu.basePrice = new Decimal(30).times(toUnlockMultiplier).floor()
          }

          if (tu.unit === this.bee.hiveBee) {
            tu.basePrice = tu.basePrice.div(2)
          }

        })
      }

      if (save.pause)
        this.pause = true

      if (save.hsn)
        this.hideSaveNotification = save.hsn

      if (save.opti) {
        this.options.load(save.opti)
        this.options.apply()
      }

      this.reloadProduction()
      this.unitLists.splice(0, this.unitLists.length)
      this.reloadLists()
      this.unl = this.all.filter(u => u.unlocked)

      if (this.research.r2.owned())
        this.unlockUnits(this.research.r2.toUnlock)()
      if (this.research.r4.owned()) {
        this.unlockUnits(this.research.r4.toUnlock)()
        this.research.r4.unlocked = false
      }

      return save.last
    }

    return null
  }

  reloadProduction() {
    this.all.filter(un => un.unlocked).forEach(u => {
      u.loadProduction()
    })
    this.actionList.forEach(a => a.reload())
    // console.log("reloadProduction")
  }

  getCost(data: any): Cost {
    return new Cost(this.all.find(u => u.id === data.u), new Decimal(data.b), new Decimal(data.g))
  }

  getExperience(): decimal.Decimal {
    return new Decimal(this.world.experience)
  }

  reloadUpIcons() {
    this.unitWithUp.forEach(u => u.checkUp())
  }

  checkResearch() {
    this.resList.filter(r => r.unlocked && r.avabileThisWorld)
      .forEach(res => res.setMaxBuy())
  }

  reloadLists() {
    this.lists.forEach(v => v.reload())
    this.uiLists = this.lists.filter(u => u.uiList && u.uiList.length > 0)
  }

}
