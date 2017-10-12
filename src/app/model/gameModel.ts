import { Engineers } from './worlds/engineer';
import { World } from './world';
import { DefaultUrlHandlingStrategy } from '@angular/router/src/url_handling_strategy';
import { Utils, Unlocable } from './utils';
import { Base, Type } from './units/base';
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
import * as decimal from 'decimal.js';
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

export class GameModel {

  isChanged = true

  //    Cost
  buyExp = Decimal(1.1)
  buyExpUnit = Decimal(1)
  scienceCost1 = Decimal(100)
  scienceCost2 = Decimal(1E3)
  scienceCost3 = Decimal(1E4)
  scienceCost4 = Decimal(1E5)
  upgradeScienceExp = Decimal(4)
  upgradeScienceHireExp = Decimal(6)

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
  allBase: Array<Base>
  lists = new Array<TypeList>()

  @Input()
  public alert: IAlert

  //    Prestige
  currentEarning = Decimal(0)
  lifeEarning = Decimal(0)
  world: World
  nextWorlds: World[]
  prestigeDone = Decimal(0)
  maxLevel = Decimal(0)

  worldTabAv = false
  expTabAv = false
  homeTabAv = false

  constructor() { this.initialize() }

  initialize() {

    this.currentEarning = Decimal(0)
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
    this.alert = alertArray[0]

    this.world = World.getBaseWorld(this)

    this.world.generateAction(this)

    this.generateRandomWorld()

    this.setInitialStat()

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

    // this.research.advancedLesson.unlocked = true
    this.baseWorld.food.quantity = Decimal(100)

    // this.baseWorld.listMaterial.forEach(m => m.quantity = Decimal(1E20))
  }

  getProduction(prod: Production,
    level: decimal.Decimal,
    factorial: decimal.Decimal,
    fraction: decimal.Decimal,
    previous = Decimal(1)
  ): decimal.Decimal {

    let ret = Decimal(0)

    const production = prod.getprodPerSec()

    if (prod.unlocked)
      ret = Decimal.pow(fraction, level)                    //    exponential
        .times(prod.unit.quantity)                          //    time
        .times(production)                        //    efficenty
        .div(factorial)
        .times(previous)

    const prod2 = prod.unit.producedBy.filter(p => p.unlocked)
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
  longUpdate(dif: number) {
    this.reloadProduction()

    const unl = this.all.filter(u => u.unlocked)
    let maxTime = dif
    let unitZero: Unit = null

    this.all.filter(u => u.quantity.lessThan(1)).forEach(res => {
      res.producedBy.filter(p => p.efficiency.lessThan(0))
        .forEach(p => p.unit.percentage = 0)
    })

    this.all.forEach(a => a.endIn = Number.POSITIVE_INFINITY)

    for (const res of unl.filter(u =>
      u.producedBy.filter(p => p.efficiency.lessThan(0)).length > 0)) {

      let a = Decimal(0)
      let b = Decimal(0)
      let c = Decimal(0)
      const d = res.quantity

      for (const prod1 of res.producedBy.filter(r => r.unlocked && r.unit.unlocked)) {
        // x
        const prodX = prod1.getprodPerSec()
        c = c.plus(prodX.times(prod1.unit.quantity))
        for (const prod2 of prod1.unit.producedBy.filter(r2 => r2.unlocked && r2.unit.unlocked)) {
          // x^2
          const prodX2 = prod2.getprodPerSec().times(prodX)
          b = b.plus(prodX2.times(prod2.unit.quantity))
          for (const prod3 of prod2.unit.producedBy.filter(r3 => r3.unlocked && r3.unit.unlocked)) {
            // x^3
            const prodX3 = prod3.getprodPerSec().times(prodX2)
            a = a.plus(prodX3.times(prod3.unit.quantity))
          }
        }
      }
      a = a.div(6)
      b = b.div(2)

      if (a.lessThan(0)
        || b.lessThan(0)
        || c.lessThan(0)
        || d.lessThan(0)) {

        const solution = Utils.solveCubic(a, b, c, d).filter(s => s.greaterThan(0))

        if (d.lessThan(Number.EPSILON)) {
          res.quantity = Decimal(0)
        }

        for (const s of solution) {
          if (maxTime > s.toNumber() * 1000) {
            maxTime = s.toNumber() * 1000
            unitZero = res
          }
          res.endIn = Math.min(s.toNumber() * 1000, res.endIn)
        }
      }
    }

    if (maxTime > Number.EPSILON)
      this.update(maxTime)
    if (unitZero)
      unitZero.producedBy.filter(p => p.efficiency.lessThan(0)).forEach(p => p.unit.percentage = 0)
    const remaning = dif - maxTime
    if (remaning > Number.EPSILON) {
      this.isChanged = true
      this.reloadProduction()
      this.longUpdate(remaning)
    }

  //  this.reloadProduction()
  }

  /**
   * Called when update end, adjust some values.
   */
  postUpdate() {
    this.all.filter(u => u.quantity.lessThan(Number.EPSILON)).forEach(u => u.quantity = Decimal(0))
  }

  /**
   * Perform an update without handling negative quantity number, can result in negative quantity.
   *
   * @param dif time elapsed in millisecond
   */
  update(dif: number) {
    const fraction = Decimal(dif / 1000)
    const all = Array.from(this.unitMap.values())
    for (const res of all)
      for (const prod of res.producedBy.filter(p => p.unlocked && p.unit.unlocked))
        res.toAdd = res.toAdd.plus(this.getProduction(prod, Decimal(1), Decimal(1), fraction))

    all.forEach(u => {
      u.quantity = u.quantity.plus(u.toAdd)
      u.toAdd = Decimal(0)
    })
  }

  /**
   * Unlock units and recheck dependencies.
   */
  unlockUnits(units: Unlocable[], message: string = null) {
    return () => {
      const ok = false
      units.filter(u => u.avabileThisWorld).forEach(u => {
        u.unlocked = true
        if (u instanceof Unit) {
          if (u.buyAction)
            u.buyAction.unlocked = true
        }
      })

      this.all.filter(u => u.unlocked).forEach(u2 => u2.produces.forEach(p =>
        p.productor.unlocked = p.productor.avabileThisWorld))
      return ok
    }
  }

  /**
   * Initialize 3 random world
   */
  generateRandomWorld() {
    this.nextWorlds = [
      World.getRandomWorld(this),
      World.getRandomWorld(this),
      World.getRandomWorld(this)
    ]
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
    save.pre = this.prestige.allPrestigeUp.map(p => p.getData())
    save.res = this.resList.map(r => r.getData())
    save.pd = this.prestigeDone
    save.worldTabAv = this.worldTabAv
    save.expTabAv = this.expTabAv
    save.ml = this.maxLevel
    save.htv = this.homeTabAv

    save.gameVers = "0.0.1"
    return LZString.compressToBase64(JSON.stringify(save))

  }

  /**
   * Load a savegame
   * @param saveRaw
   */
  load(saveRaw: string): number {
    if (saveRaw) {
      this.setInitialStat()
      saveRaw = LZString.decompressFromBase64(saveRaw)
      const save = JSON.parse(saveRaw)
      // console.log(saveRaw)
      this.currentEarning = Decimal(save.cur)
      this.lifeEarning = Decimal(save.life)
      this.world.restore(save.w)
      this.maxLevel = Decimal(save.ml)

      for (const s of save.list) {
        const unit = this.unitMap.get(s.id)
        if (unit)
          unit.restore(s)
      }

      this.nextWorlds[0].restore(save.nw[0])
      this.nextWorlds[1].restore(save.nw[1])
      this.nextWorlds[2].restore(save.nw[2])

      for (const s of save.pre) {
        const up = this.prestige.allPrestigeUp.find(p => p.id === s.id)
        if (up)
          up.restore(s)
      }

      for (const s of save.res) {
        const res = this.resList.find(p => p.id === s.id)
        if (res)
          res.restore(s)
      }

      if (save.pd)
        this.prestigeDone = Decimal(save.pd)

      if (save.worldTabAv)
        this.worldTabAv = save.worldTabAv

      if (save.expTabAv)
        this.expTabAv = save.expTabAv

      if (save.htv)
        this.homeTabAv = save.htv

      this.reloadProduction()


      this.science.science1Production.unlocked = true

      return save.last
    }
    return null
  }

  reloadProduction() {
    this.all.forEach(u => {
      u.loadProduction()
      // u.reloadtAct()
    })

    this.actionList.forEach(a => a.reload())

  }
  getCost(data: any): Cost {
    return new Cost(this.all.find(u => u.id === data.u), Decimal(data.b), Decimal(data.g))
  }

  getExperience(): decimal.Decimal {
    return Decimal(this.world.experience)
  }

  getUnits(types: Type[]): Unit[] {
    return this.all.filter(u => {
      let yes = true
      types.forEach(t => yes = yes && u.types.includes(t))
      return yes
    })
  }

}
