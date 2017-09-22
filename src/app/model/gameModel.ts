import { World } from './world';
import { DefaultUrlHandlingStrategy } from '@angular/router/src/url_handling_strategy';
import { Utils } from './utils';
import { Base, Type } from './units/base';
import { Cost } from './cost';
import { Alert, alertArray, IAlert } from './alert';
import { PrestigeList, TypeList } from './typeList';
import { Action, BuyAction, BuyAndUnlockAction, Research, UpAction, UpEfficiency, UpHire, UpSpecial, UnlockProd } from './units/action';
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

export class GameModel {

  //    Cost
  buyExp = Decimal(1.1)
  buyExpUnit = Decimal(1)
  scienceCost1 = Decimal(100)
  scienceCost2 = Decimal(1E4)
  scienceCost3 = Decimal(1E6)
  scienceCost4 = Decimal(1E8)
  upgradeScienceExp = Decimal(10)

  //    Materials
  food: Unit
  cristal: Unit
  soil: Unit
  science: Unit
  fungus: Unit
  wood: Unit
  sand: Unit
  listMaterial = Array<Unit>()

  //    Jobs Tier 1
  geologist: Unit
  student: Unit
  carpenter: Unit
  farmer: Unit
  lumberjack: Unit
  level1 = Array<Unit>()

  //  Jobs Tier 2
  geologist2: Unit
  student2: Unit
  carpenter2: Unit
  farmer2: Unit
  lumberjack2: Unit
  level2 = Array<Unit>()
  level2Actions = Array<Action>()

  //    Special Ants
  composterAnt: Unit
  refineryAnt: Unit
  laserAnt: Unit

  jobMaterial: Unit[][]

  listJobs = Array<Unit>()

  //    Generators
  littleAnt: Unit
  queenAnt: Unit
  nestAnt: Unit
  list = Array<Unit>()

  //    Machinery
  laserStation: Unit
  hydroFarm: Unit
  caterpillar: Unit
  refineryStation: Unit
  mine: Unit
  sandDigger: Unit
  loggingMachine: Unit

  listMachinery = new Array<Unit>()

  //    Enginers
  laserEnginer: Unit
  hydroEnginer: Unit
  soilEnginer: Unit
  refineryEnginery: Unit
  mineEnginer: Unit
  sandEnginer: Unit
  woodEnginer: Unit

  listEnginer = new Array<Unit>()

  //    Research
  up1: Research
  upEfficiency: Research
  rDirt: Research
  resList = Array<Research>()
  specialResearch: Research
  othersResearch: Research
  prestigeResearch: Research
  engineerRes: Research
  machineryRes: Research
  laserResearch: Research
  refineryResearch: Research
  composterResearch: Research

  //    Bee
  nectar: Unit
  honey: Unit
  foragingBee: Unit
  workerBee: Unit
  queenBee: Unit
  hiveBee: Unit
  beeResearch: Research

  scientistBee: Unit
  foodBee: Unit
  advancedBee: Research
  listBee = new Array<Unit>()

  //    Forest
  larva: Unit
  beetle: Unit
  ambrosiaBeetle: Unit
  powderpostBeetle: Unit
  ladybird: Unit
  beetleNest: Unit
  beetleColony: Unit
  beetleResearch: Research
  listForest = new Array<Unit>()

  //  Freezing
  ice: Unit
  iceAnt: Unit
  iceCollector: Unit
  iceCompacter: Unit
  iceEngineer: Unit
  listFreezig = new Array<Unit>()

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
  experience: Unit
  prestigeDone = Decimal(0)

  expLists = new Array<TypeList>()
  expAnt = new Array<Unit>()
  expMachinery = new Array<Unit>()
  allPrestigeUp = new Array<Unit>()

  //    Prestige Ant
  pAntPower: Unit
  pAntFungus: Unit
  pAntNext: Unit
  pGeologistNext: Unit
  pScientistNext: Unit
  pFarmerNext: Unit

  //    Prestige Machinery
  pMachineryPower: Unit

  //    Special World Units
  crab: Unit
  crabFarmer: Unit
  crabQueen: Unit
  shrimp: Unit
  seaRes: Research

  constructor() { this.initialize() }

  initialize() {

    this.currentEarning = Decimal(0)
    this.allBase = []
    this.listMaterial = []
    this.level1 = []
    this.jobMaterial = []
    this.listJobs = []
    this.list = []
    this.unitMap = new Map()
    this.lists = new Array<TypeList>()

    this.initMaterials()
    this.initGenerators()
    this.initJobs()

    //    Production
    this.prodGenerators()

    this.initBee()
    this.initMachinery()
    this.initEnginers()

    //    Fungus
    this.fungus.actions.push(new UpSpecial(this, this.fungus))

    //    Lists
    this.lists.push(new TypeList("Material", this.listMaterial))
    this.lists.push(new TypeList("Jobs", this.listJobs))
    this.lists.push(new TypeList("Ants", this.list))
    this.lists.push(new TypeList("Machinery", this.listMachinery))
    this.lists.push(new TypeList("Engineer", this.listEnginer))
    this.lists.push(new TypeList("Bee", this.listBee))
    this.lists.push(new TypeList("Beetle", this.listForest))
    this.lists.push(new TypeList("Freezing", this.listForest))

    //  Researchs
    this.initResearchs()

    //  End of base World

    //  Other Worlds
    this.initWorld()
    this.initForest()
    this.initFreezing()

    this.all = Array.from(this.unitMap.values()).filter(u => !u.neverEnding)
    this.alert = alertArray[0]

    this.world = World.getBaseWorld(this)

    World.initialize(this)
    this.world.generateAction(this)

    this.generatePrestige()
    this.generateRandomWorld()

    this.list = this.list.reverse()
    this.setInitialStat()

    // this.all.forEach(a => {
    //   a.unlocked = true
    //   if (a.buyAction)
    //     a.buyAction.unlocked = true
    // })

  }
  initMaterials() {
    this.food = new Unit(this, "food", "Food", "Food is used to support almost all your units.")
    this.food.unlocked = true
    this.listMaterial.push(this.food)

    this.cristal = new Unit(this, "cri", "Cristal", "Cristals are needed to get science.")
    this.listMaterial.push(this.cristal)

    this.soil = new Unit(this, "soil", "Soil", "Soil is used to make nests.")
    this.listMaterial.push(this.soil)

    this.science = new Unit(this, "sci", "Science", "Science is used to improve and unlock stuff.")
    this.listMaterial.push(this.science)

    this.fungus = new Unit(this, "fun", "Fungus", "Fungus is a source of food.")
    this.listMaterial.push(this.fungus)

    this.wood = new Unit(this, "wood", "Wood", "Wood is used to make better nest and machinery.")
    this.listMaterial.push(this.wood)

    this.sand = new Unit(this, "sand", "Sand", "Sand can be used to make cristals.")
    this.listMaterial.push(this.sand)

    this.nectar = new Unit(this, "nectar", "Nectar", "Nectar is used to make honey.")
    this.listMaterial.push(this.nectar)

    this.honey = new Unit(this, "honey", "Honey", "Honey is the main resource for bees.")
    this.listMaterial.push(this.honey)

    this.listMaterial.forEach(material => material.types = [Type.Material])
  }
  initGenerators() {
    this.littleAnt = new Unit(this, "G1", "Ant",
      "Ant are the lowest class of worker. They continuously gather food.")
    this.queenAnt = new Unit(this, "G2", "Queen",
      "Queen proces ants")
    this.nestAnt = new Unit(this, "G3", "Nest",
      "Nest proces queen")

    this.list.push(this.littleAnt, this.queenAnt, this.nestAnt)
    this.list.forEach(ant => ant.types = [Type.Ant, Type.Generator])

    this.littleAnt.unlocked = true
  }
  initJobs() {
    this.student = new Unit(this, "scn", "Student", "Student yield science.")
    this.student.types = [Type.Ant, Type.Scientist]
    this.listJobs.push(this.student)

    this.geologist = new Unit(this, "geo", "Geologist", "Geologist yield cristal.")
    this.geologist.types = [Type.Ant, Type.Mining]
    this.listJobs.push(this.geologist)

    this.carpenter = new Unit(this, "car", "Carpenter", "carpenters yield soil.")
    this.carpenter.types = [Type.Ant, Type.SoilG]
    this.listJobs.push(this.carpenter)

    this.farmer = new Unit(this, "far", "Farmer", "Farmer yield fungus.")
    this.farmer.types = [Type.Ant, Type.Farmer]
    this.listJobs.push(this.farmer)

    this.lumberjack = new Unit(this, "lum", "Lumberjack", "Lumberjack yield wood.")
    this.lumberjack.types = [Type.Ant, Type.WoodG]
    this.listJobs.push(this.lumberjack)

    this.level1 = [this.geologist, this.student, this.farmer, this.carpenter, this.lumberjack]

    //    Prices && Production
    this.food.addProductor(new Production(this.littleAnt))
    this.food.addProductor(new Production(this.fungus))
    this.fungus.addProductor(new Production(this.farmer))
    this.soil.addProductor(new Production(this.farmer, Decimal(-1)))
    this.cristal.addProductor(new Production(this.geologist, Decimal(1)))
    this.science.addProductor(new Production(this.student))
    this.cristal.addProductor(new Production(this.student, Decimal(-1)))
    this.soil.addProductor(new Production(this.carpenter))
    this.wood.addProductor(new Production(this.lumberjack))

    //    Geologist
    this.geologist.actions.push(new BuyAndUnlockAction(this,
      this.geologist,
      [
        new Cost(this.food, Decimal(1000), this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ],
      [this.cristal, this.student]
    ))

    //    Scientist
    this.student.actions.push(new BuyAndUnlockAction(this,
      this.student,
      [
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.cristal, Decimal(100), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit))
      ],
      [this.science]
    ))

    //    Carpenter
    this.carpenter.actions.push(new BuyAndUnlockAction(this,
      this.carpenter,
      [
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit))
      ],
      [this.science]
    ))

    //    Lumberjack
    this.lumberjack.actions.push(new BuyAndUnlockAction(this,
      this.lumberjack,
      [
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit))
      ],
      [this.wood]
    ))

    //    Farmer
    this.farmer.actions.push(new BuyAndUnlockAction(this,
      this.farmer,
      [
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit)),
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.soil, Decimal(100), Decimal(this.buyExp))
      ],
      [this.fungus]
    ))

    this.level1.forEach(l => {
      l.actions.push(new UpAction(this, l, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
      l.actions.push(new UpHire(this, l, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    })
    this.student.actions.push(new UpEfficiency(this, this.student, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.farmer.actions.push(new UpEfficiency(this, this.farmer, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))


    //  Level 2
    //  Yes, it's almost a copy paste of level 1
    this.student2 = new Unit(this, "scn2", "University", "University yield science.")
    this.student2.types = [Type.Ant, Type.Scientist]
    this.listJobs.push(this.student2)

    this.geologist2 = new Unit(this, "geo2", "Mine", "Mine yield cristal.")
    this.geologist2.types = [Type.Ant, Type.Mining]
    this.listJobs.push(this.geologist2)

    this.carpenter2 = new Unit(this, "car2", "Digging Team", "carpenters yield soil.")
    this.carpenter2.types = [Type.Ant, Type.SoilG]
    this.listJobs.push(this.carpenter2)

    this.farmer2 = new Unit(this, "far2", "Farm", "Farm yield fungus.")
    this.farmer2.types = [Type.Ant, Type.Farmer]
    this.listJobs.push(this.farmer2)

    this.lumberjack2 = new Unit(this, "lum2", "Forestry Serivce", "Forestry Serivce yield wood.")
    this.lumberjack2.types = [Type.Ant, Type.WoodG]
    this.listJobs.push(this.lumberjack2)

    this.level2 = [this.geologist2, this.student2, this.farmer2, this.carpenter2, this.lumberjack2]

    //    Prices && Production
    this.fungus.addProductor(new Production(this.farmer2, Decimal(100)))
    this.soil.addProductor(new Production(this.farmer2, Decimal(-40)))
    this.cristal.addProductor(new Production(this.geologist2, Decimal(100)))
    this.science.addProductor(new Production(this.student2, Decimal(100)))
    this.cristal.addProductor(new Production(this.student2, Decimal(-40)))
    this.soil.addProductor(new Production(this.carpenter2, Decimal(100)))
    this.wood.addProductor(new Production(this.lumberjack2, Decimal(100)))

    //    Geologist
    this.geologist2.actions.push(new BuyAction(this,
      this.geologist2,
      [
        new Cost(this.food, Decimal(1E6), this.buyExp),
        new Cost(this.geologist, Decimal(10), this.buyExpUnit)
      ]
    ))

    //    Scientist
    this.student2.actions.push(new BuyAction(this,
      this.student2,
      [
        new Cost(this.food, Decimal(1E6), Decimal(this.buyExp)),
        new Cost(this.cristal, Decimal(1E5), Decimal(this.buyExp)),
        new Cost(this.student, Decimal(10), Decimal(this.buyExpUnit))
      ]
    ))

    //    Carpenter
    this.carpenter2.actions.push(new BuyAction(this,
      this.carpenter2,
      [
        new Cost(this.food, Decimal(1E6), Decimal(this.buyExp)),
        new Cost(this.carpenter, Decimal(10), Decimal(this.buyExpUnit))
      ]
    ))

    //    Lumberjack
    this.lumberjack2.actions.push(new BuyAction(this,
      this.lumberjack2,
      [
        new Cost(this.food, Decimal(1E6), Decimal(this.buyExp)),
        new Cost(this.lumberjack, Decimal(10), Decimal(this.buyExpUnit))
      ]
    ))

    //    Farmer
    this.farmer2.actions.push(new BuyAction(this,
      this.farmer2,
      [
        new Cost(this.farmer, Decimal(10), Decimal(this.buyExpUnit)),
        new Cost(this.food, Decimal(1E6), Decimal(this.buyExp)),
        new Cost(this.soil, Decimal(1E5), Decimal(this.buyExp))
      ]
    ))

    this.level2.forEach(l => {
      l.actions.push(new UpAction(this, l, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
      l.actions.push(new UpHire(this, l, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    })

    this.student2.actions.push(new UpEfficiency(this, this.student2, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    this.farmer2.actions.push(new UpEfficiency(this, this.farmer2, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))

    this.level2Actions = new Array<Action>()
    for (let n = 0; n < this.level2.length; n++) {
      const producer = this.level2[n]
      const product = this.level1[n]
      const prod = new Production(producer, Decimal(1), false)
      product.addProductor(prod)
      const act = new UnlockProd(this, producer,
        [new Cost(this.science, Decimal(1E6))], prod
      )
      this.level2Actions.push(act)
      producer.actions.push(act)
    }


    //
    //    Special
    //

    //  Composter
    this.composterAnt = new Unit(this, "com",
      "Composter Ant", "Transform fungus into soil.")
    this.composterAnt.types = [Type.Ant]
    this.listJobs.push(this.composterAnt)
    this.composterAnt.actions.push(new BuyAction(this,
      this.composterAnt,
      [
        new Cost(this.food, Decimal(1E4), this.buyExp),
        new Cost(this.fungus, Decimal(5E3), this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.soil.addProductor(new Production(this.composterAnt))
    this.fungus.addProductor(new Production(this.composterAnt, Decimal(-2)))

    //  Refinery
    this.refineryAnt = new Unit(this, "ref",
      "Refinery Ant", "Transform soil into sand.")
    this.refineryAnt.types = [Type.Ant]
    this.listJobs.push(this.refineryAnt)
    this.refineryAnt.actions.push(new BuyAction(this,
      this.refineryAnt,
      [
        new Cost(this.food, Decimal(1E4), this.buyExp),
        new Cost(this.soil, Decimal(5E3), this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.sand.addProductor(new Production(this.refineryAnt))
    this.soil.addProductor(new Production(this.refineryAnt, Decimal(-2)))

    //  Laser
    this.laserAnt = new Unit(this, "las",
      "Laser Ant", "Transform sand into cristal.")
    this.laserAnt.types = [Type.Ant]
    this.listJobs.push(this.laserAnt)
    this.laserAnt.actions.push(new BuyAction(this,
      this.laserAnt,
      [
        new Cost(this.food, Decimal(1E4), this.buyExp),
        new Cost(this.sand, Decimal(5E3), this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.cristal.addProductor(new Production(this.laserAnt))
    this.sand.addProductor(new Production(this.laserAnt, Decimal(-2)))

    const consumer = [this.composterAnt, this.refineryAnt, this.laserAnt]
    consumer.forEach(l =>
      l.actions.push(new UpEfficiency(this, l, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)])))

    this.level1.push(this.composterAnt, this.refineryAnt, this.laserAnt)
  }
  prodGenerators() {
    const genBaseCost = Decimal(10)

    this.list[0].actions.push(new BuyAndUnlockAction(this,
      this.list[0],
      [new Cost(
        this.food,
        Decimal.pow(genBaseCost, 2).div(10),
        Decimal(this.buyExp))],
      [this.list[1]]
    ))

    for (let i = 1; i < this.list.length; i++) {
      const toUnlock = Array<Unit>()
      if (i + 1 < this.list.length) toUnlock.push(this.list[i + 1])
      if (this.list[i].id === "G2") toUnlock.push(this.geologist)

      this.list[i].actions.push(new BuyAndUnlockAction(this,
        this.list[i],
        [
          new Cost(
            this.food,
            Decimal.pow(genBaseCost, 2 * (1 + i)).div(10),
            Decimal(this.buyExp)),
          new Cost(
            this.list[i - 1],
            Decimal.pow(10, i),
            Decimal(this.buyExpUnit)
          )
        ],
        toUnlock
      ))
      if (i > 1) {
        this.list[i].buyAction.priceF.push(new Cost(
          this.fungus,
          Decimal.pow(genBaseCost, 2 * (1 + i)).div(100),
          Decimal(this.buyExp)))
        this.list[i].buyAction.priceF.push(new Cost(
          this.soil,
          Decimal.pow(genBaseCost, 2 * (1 + i)).div(1000),
          Decimal(this.buyExp)))
        this.list[i].buyAction.priceF.push(new Cost(
          this.wood,
          Decimal.pow(genBaseCost, 2 * (1 + i)).div(10000),
          Decimal(this.buyExp)))
        this.list[i].buyAction.priceF.push(new Cost(
          this.cristal,
          Decimal.pow(genBaseCost, 2 * (1 + i)).div(100000),
          Decimal(this.buyExp)))
      }
    }
    for (let i = 0; i < this.list.length - 1; i++)
      this.list[i].addProductor(new Production(this.list[i + 1], Decimal(i + 1)))

    for (let i = 0; i < this.list.length; i++) {
      this.list[i].actions.push(new UpAction(this, this.list[i],
        [new Cost(this.science, Decimal(Decimal(100).times(Decimal.pow(10, Decimal(i)))), Decimal(10))]))
      this.list[i].actions.push(new UpHire(this, this.list[i],
        [new Cost(this.science, Decimal(Decimal(100).times(Decimal.pow(10, Decimal(i)))), Decimal(10))]))
    }
  }
  initBee() {
    //    Foragging
    this.foragingBee = new Unit(this, "forBee", "Foraging Bee",
      "Foraging Bee yield nectar.")
    this.foragingBee.types = [Type.Bee]
    this.foragingBee.actions.push(new BuyAction(this,
      this.foragingBee,
      [new Cost(this.food, Decimal(100), this.buyExp)]
    ))
    this.nectar.addProductor(new Production(this.foragingBee))
    this.foragingBee.actions.push(new UpAction(this, this.foragingBee, [new Cost(this.science, this.scienceCost1, this.upgradeScienceExp)]))
    this.foragingBee.actions.push(new UpHire(this, this.foragingBee, [new Cost(this.science, this.scienceCost1, this.upgradeScienceExp)]))

    this.queenBee = new Unit(this, "qBee", "Queen Bee",
      "Yeld Foraging Bee.")
    this.queenBee.types = [Type.Bee]
    this.hiveBee = new Unit(this, "hBee", "Hive Bee",
      "Yeld Queen")
    this.hiveBee.types = [Type.Bee]

    //    Worker
    this.workerBee = new Unit(this, "worBee", "Worker Bee",
      "Worker Bee converts nectar to honey.")
    this.workerBee.types = [Type.Bee]
    this.workerBee.actions.push(new BuyAndUnlockAction(this,
      this.workerBee,
      [
        new Cost(this.nectar, Decimal(100), this.buyExp),
        new Cost(this.food, Decimal(1000), this.buyExp),
        new Cost(this.foragingBee, Decimal(1), this.buyExpUnit)
      ], [this.queenBee]
    ))
    this.nectar.addProductor(new Production(this.workerBee, Decimal(-2)))
    this.honey.addProductor(new Production(this.workerBee, Decimal(1)))
    this.workerBee.actions.push(new UpAction(this, this.workerBee, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.workerBee.actions.push(new UpHire(this, this.workerBee, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.workerBee.actions.push(new UpEfficiency(this, this.workerBee, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))


    this.queenBee.actions.push(new BuyAndUnlockAction(this,
      this.queenBee,
      [
        new Cost(this.foragingBee, Decimal(100), this.buyExpUnit),
        new Cost(this.honey, Decimal(1E4), this.buyExp),
        new Cost(this.food, Decimal(1E5), this.buyExp),
      ], [this.hiveBee]
    ))
    this.foragingBee.addProductor(new Production(this.queenBee))

    this.hiveBee.actions.push(new BuyAction(this,
      this.hiveBee,
      [
        new Cost(this.queenBee, Decimal(10000), this.buyExpUnit),
        new Cost(this.honey, Decimal(1E7), this.buyExp),
        new Cost(this.food, Decimal(1E8), this.buyExp),
      ]
    ))
    this.queenBee.addProductor(new Production(this.hiveBee))

    this.queenBee.actions.push(new UpAction(this, this.queenBee, [new Cost(this.science, this.scienceCost3, Decimal(10))]))
    this.queenBee.actions.push(new UpHire(this, this.queenBee, [new Cost(this.science, this.scienceCost3, Decimal(10))]))

    this.hiveBee.actions.push(new UpAction(this, this.hiveBee, [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    this.hiveBee.actions.push(new UpHire(this, this.hiveBee, [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))

    //   Advanced Bee
    this.scientistBee = new Unit(this, "scBee", "Scientist Bee", "Yeld science")
    this.foodBee = new Unit(this, "foodBee", "Food Bee", "Convert honey to food")

    //    Scientist
    this.scientistBee.types = [Type.Bee]
    this.scientistBee.actions.push(new BuyAction(this,
      this.scientistBee,
      [
        new Cost(this.foragingBee, Decimal(1), this.buyExpUnit),
        new Cost(this.honey, Decimal(100), this.buyExp),
        new Cost(this.cristal, Decimal(100), this.buyExp),
      ]
    ))
    this.science.addProductor(new Production(this.scientistBee))
    this.scientistBee.actions.push(new UpAction(this, this.scientistBee,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    this.scientistBee.actions.push(new UpHire(this, this.scientistBee,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //    Food
    this.foodBee.types = [Type.Bee]
    this.foodBee.actions.push(new BuyAction(this,
      this.foodBee,
      [
        new Cost(this.foragingBee, Decimal(1), this.buyExpUnit),
        new Cost(this.honey, Decimal(100), this.buyExp),
        new Cost(this.cristal, Decimal(100), this.buyExp),
      ]
    ))
    this.food.addProductor(new Production(this.foodBee))
    this.honey.addProductor(new Production(this.foodBee, Decimal(-0.5)))
    this.foodBee.actions.push(new UpAction(this, this.foodBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    this.foodBee.actions.push(new UpHire(this, this.foodBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    this.foodBee.actions.push(new UpEfficiency(this, this.foodBee, [new Cost(this.science, Decimal(1), Decimal(10))]))

    this.advancedBee = new Research(
      "advBee",
      "Advanced Bee", "More jobs for bees",
      [new Cost(this.science, Decimal(1))],
      [this.scientistBee, this.foodBee],
      this
    )

    this.listBee.push(this.hiveBee)
    this.listBee.push(this.queenBee)
    this.listBee.push(this.foragingBee)
    this.listBee.push(this.workerBee)
    this.listBee.push(this.scientistBee)
    this.listBee.push(this.foodBee)

  }
  initMachinery() {

    this.listMachinery = new Array<Unit>()

    //    Laser
    this.laserStation = new Unit(this, "laserStation", "Laser Station", "Yeld cristal")
    this.laserStation.types = [Type.Machinery]
    this.laserStation.actions.push(new BuyAction(this,
      this.laserStation,
      [
        new Cost(this.soil, Decimal(1E6), this.buyExp),
        new Cost(this.wood, Decimal(1E7), this.buyExp),
        new Cost(this.cristal, Decimal(1E7), this.buyExp)
      ]
    ))
    this.cristal.addProductor(new Production(this.laserStation, Decimal(1E3)))
    this.sand.addProductor(new Production(this.laserStation, Decimal(-5E2)))
    this.laserStation.actions.push(new UpEfficiency(this, this.laserStation,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    this.listMachinery.push(this.laserStation)

    //    Hydroponic Farm
    this.hydroFarm = new Unit(this, "hydroFarm", "Hydroponic Farm", "Yeld fungus")
    this.hydroFarm.types = [Type.Machinery]
    this.hydroFarm.actions.push(new BuyAction(this,
      this.hydroFarm,
      [
        new Cost(this.fungus, Decimal(1E6), this.buyExp),
        new Cost(this.wood, Decimal(5E6), this.buyExp),
        new Cost(this.cristal, Decimal(1E7), this.buyExp)
      ]
    ))
    this.fungus.addProductor(new Production(this.hydroFarm, Decimal(1E3)))
    this.listMachinery.push(this.hydroFarm)

    //    Caterpillar
    this.caterpillar = new Unit(this, "caterpillar", "Caterpillar", "Yeld soil")
    this.caterpillar.types = [Type.Machinery]
    this.caterpillar.actions.push(new BuyAction(this,
      this.caterpillar,
      [
        new Cost(this.soil, Decimal(1E6), this.buyExp),
        new Cost(this.cristal, Decimal(5E6), this.buyExp),
        new Cost(this.wood, Decimal(1E7), this.buyExp)

      ]
    ))
    this.wood.addProductor(new Production(this.caterpillar, Decimal(1E3)))
    this.listMachinery.push(this.caterpillar)

    //    Refinery
    this.refineryStation = new Unit(this, "refineryStation", "Refinery Station", "Turn soil into sand")
    this.refineryStation.types = [Type.Machinery]
    this.refineryStation.actions.push(new BuyAction(this,
      this.refineryStation,
      [
        new Cost(this.wood, Decimal(1E6), this.buyExp),
        new Cost(this.cristal, Decimal(1E6), this.buyExp),
        new Cost(this.soil, Decimal(1E7), this.buyExp)
      ]
    ))
    this.sand.addProductor(new Production(this.refineryStation, Decimal(1E3)))
    this.soil.addProductor(new Production(this.refineryStation, Decimal(-5E2)))
    this.refineryStation.actions.push(new UpEfficiency(this, this.refineryStation,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    this.listMachinery.push(this.refineryStation)


    //    Not always avaiable

    //    Sand digger
    this.sandDigger = new Unit(this, "sandDigger", "Sand Digger", "Yeld sand")
    this.sandDigger.avabileBaseWorld = false
    this.sandDigger.types = [Type.Machinery]
    this.sandDigger.actions.push(new BuyAction(this,
      this.sandDigger,
      [new Cost(this.wood, Decimal(1E6), this.buyExp)]
    ))
    this.cristal.addProductor(new Production(this.sandDigger, Decimal(1E3)))
    this.listMachinery.push(this.sandDigger)

    //    Wood
    this.loggingMachine = new Unit(this, "loggingMachine", "Logging Machine", "Yeld wood")
    this.loggingMachine.avabileBaseWorld = false
    this.loggingMachine.types = [Type.Machinery]
    this.loggingMachine.actions.push(new BuyAction(this,
      this.loggingMachine,
      [
        new Cost(this.wood, Decimal(1E6), this.buyExp),
        new Cost(this.cristal, Decimal(1E6), this.buyExp),
        new Cost(this.soil, Decimal(1E7), this.buyExp)
      ]
    ))
    this.wood.addProductor(new Production(this.loggingMachine, Decimal(1E3)))
    this.listMachinery.push(this.loggingMachine)

    //    Mine
    this.mine = new Unit(this, "mine", "Mine", "Yeld cristal")
    this.mine.avabileBaseWorld = false
    this.mine.types = [Type.Machinery]
    this.mine.actions.push(new BuyAction(this,
      this.mine,
      [
        new Cost(this.cristal, Decimal(1E6), this.buyExp),
        new Cost(this.wood, Decimal(1E7), this.buyExp)
      ]
    ))
    this.cristal.addProductor(new Production(this.mine, Decimal(1E3)))
    this.listMachinery.push(this.mine)

  }
  initEnginers() {
    this.listEnginer = new Array<Unit>()

    this.laserEnginer = new Unit(this, "engLa", "Laser Engineer",
      "Slowly build laser stations.")
    this.hydroEnginer = new Unit(this, "engHy", "Hydro Engineer",
      "Slowly build hydroponic farms.")
    this.soilEnginer = new Unit(this, "engSo", "Soil Engineer",
      "Slowly build caterpillars.")
    this.mineEnginer = new Unit(this, "engMi", "Mining Engineer",
      "Slowly build mines.")
    this.sandEnginer = new Unit(this, 'engSa', "Sand Engineer",
      'Slowly build sand diggers.')
    this.woodEnginer = new Unit(this, "engWo", "Wood Engineer",
      "Slowly build logging machines.")
    this.refineryEnginery = new Unit(this, "engRef", "Refine Engineer",
      "Slowly build refinery stations.")

    this.sandEnginer.avabileBaseWorld = false
    this.mineEnginer.avabileBaseWorld = false
    this.woodEnginer.avabileBaseWorld = false

    this.listEnginer.push(this.laserEnginer)
    this.listEnginer.push(this.hydroEnginer)
    this.listEnginer.push(this.soilEnginer)
    this.listEnginer.push(this.mineEnginer)
    this.listEnginer.push(this.sandEnginer)
    this.listEnginer.push(this.woodEnginer)
    this.listEnginer.push(this.refineryEnginery)

    this.laserStation.addProductor(new Production(this.laserEnginer, Decimal(0.01)))
    this.hydroFarm.addProductor(new Production(this.hydroEnginer, Decimal(0.01)))
    this.caterpillar.addProductor(new Production(this.soilEnginer, Decimal(0.01)))
    this.mine.addProductor(new Production(this.mineEnginer, Decimal(0.01)))
    this.sandDigger.addProductor(new Production(this.sandEnginer, Decimal(0.01)))
    this.loggingMachine.addProductor(new Production(this.woodEnginer, Decimal(0.01)))
    this.refineryStation.addProductor(new Production(this.refineryEnginery, Decimal(0.01)))

    this.listEnginer.forEach(e => {
      e.actions.push(new BuyAction(this,
        e,
        [
          new Cost(this.littleAnt, Decimal(1E3), this.buyExpUnit),
          new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)
        ]
      ))
      e.actions.push(new UpAction(this, e, [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
      e.actions.push(new UpHire(this, e, [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    })

    this.laserEnginer.buyAction.priceF.push(new Cost(this.laserStation, Decimal(100), this.buyExp))
    this.hydroEnginer.buyAction.priceF.push(new Cost(this.hydroFarm, Decimal(100), this.buyExp))
    this.soilEnginer.buyAction.priceF.push(new Cost(this.caterpillar, Decimal(100), this.buyExp))
    this.mineEnginer.buyAction.priceF.push(new Cost(this.mine, Decimal(100), this.buyExp))
    this.sandEnginer.buyAction.priceF.push(new Cost(this.sandDigger, Decimal(100), this.buyExp))
    this.woodEnginer.buyAction.priceF.push(new Cost(this.loggingMachine, Decimal(100), this.buyExp))
    this.refineryEnginery.buyAction.priceF.push(new Cost(this.refineryStation, Decimal(100), this.buyExp))

  }
  initForest() {
    this.listEnginer = new Array<Unit>()

    this.larva = new Unit(this, "larva", "Larva", "Yeld food")
    this.beetle = new Unit(this, "beetle", "Beetle", "Yeld soil and food")
    this.ambrosiaBeetle = new Unit(this, "ambrosiaBeetle", "Ambrosia beetle", "Yeld wood")
    this.beetleNest = new Unit(this, "beetleNest", "Beetle Nest", "Yeld larvae")
    this.ladybird = new Unit(this, "ladybird", "Ladybird", "Yeld science")
    this.beetleColony = new Unit(this, "beetleColony", "Beetle Colony", "Yeld nest")
    this.powderpostBeetle = new Unit(this, "powder", "Powderpost Beetle", "Powderpost beetles are a group of woodboring beetles.")

    this.listForest.push(this.beetleColony)
    this.listForest.push(this.beetleNest)
    this.listForest.push(this.beetle)
    this.listForest.push(this.larva)
    this.listForest.push(this.powderpostBeetle)
    this.listForest.push(this.ambrosiaBeetle)
    this.listForest.push(this.ladybird)

    this.food.addProductor(new Production(this.larva))

    this.cristal.addProductor(new Production(this.beetle, Decimal(0.2)))
    this.soil.addProductor(new Production(this.beetle, Decimal(0.5)))
    this.food.addProductor(new Production(this.beetle))

    this.science.addProductor(new Production(this.ladybird, Decimal(0.01)))
    this.fungus.addProductor(new Production(this.ambrosiaBeetle, Decimal(-0.5)))
    this.wood.addProductor(new Production(this.ambrosiaBeetle, Decimal(2)))
    this.larva.addProductor(new Production(this.beetleNest))
    this.beetleNest.addProductor(new Production(this.beetleColony))

    this.food.addProductor(new Production(this.powderpostBeetle))
    this.wood.addProductor(new Production(this.powderpostBeetle))

    //    Larva
    this.larva.actions.push(new BuyAndUnlockAction(this,
      this.larva,
      [new Cost(this.food, Decimal(10), Decimal(1.01))],
      [this.beetle]
    ))
    this.larva.actions.push(new UpAction(this, this.larva, [new Cost(this.science, this.scienceCost1, this.upgradeScienceExp)]))
    this.larva.actions.push(new UpHire(this, this.larva, [new Cost(this.science, this.scienceCost1, this.upgradeScienceExp)]))

    //    Beetle
    this.beetle.actions.push(new BuyAndUnlockAction(this,
      this.beetle,
      [
        new Cost(this.larva, Decimal(1), this.buyExp),
        new Cost(this.soil, Decimal(100), this.buyExp),
        new Cost(this.food, Decimal(1000), this.buyExp)
      ],
      [this.beetleNest]
    ))
    this.beetle.actions.push(new UpAction(this, this.beetle, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.beetle.actions.push(new UpHire(this, this.beetle, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //    Beetle Nest
    this.beetleNest.actions.push(new BuyAndUnlockAction(this,
      this.beetleNest,
      [
        new Cost(this.beetle, Decimal(10), this.buyExp),
        new Cost(this.wood, Decimal(10000), this.buyExp),
        new Cost(this.soil, Decimal(10000), this.buyExp),
        new Cost(this.food, Decimal(100000), this.buyExp)
      ],
      [this.beetleColony]
    ))
    this.beetleNest.actions.push(new UpAction(this, this.beetleNest, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.beetleNest.actions.push(new UpHire(this, this.beetleNest, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //    Beetle Colony
    this.beetleColony.actions.push(new BuyAction(this,
      this.beetleColony,
      [
        new Cost(this.beetleNest, Decimal(10), this.buyExp),
        new Cost(this.powderpostBeetle, Decimal(100), this.buyExp),
        new Cost(this.ambrosiaBeetle, Decimal(100), this.buyExp),
        new Cost(this.fungus, Decimal(1000000), this.buyExp),
        new Cost(this.wood, Decimal(1000000), this.buyExp),
        new Cost(this.soil, Decimal(1000000), this.buyExp),
        new Cost(this.food, Decimal(10000000), this.buyExp)
      ]
    ))
    this.beetleColony.actions.push(new UpAction(this, this.beetleColony,
      [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    this.beetleColony.actions.push(new UpHire(this, this.beetleColony,
      [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))

    //    Lady Beetle
    this.ladybird.actions.push(new BuyAction(this,
      this.ladybird,
      [
        new Cost(this.larva, Decimal(1), this.buyExp),
        new Cost(this.cristal, Decimal(100), this.buyExp),
        new Cost(this.food, Decimal(1000), this.buyExp)
      ]
    ))
    this.ladybird.actions.push(new UpAction(this, this.ladybird, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.ladybird.actions.push(new UpHire(this, this.ladybird, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))


    //    Ambrosia Beetle
    this.ambrosiaBeetle.actions.push(new BuyAction(this,
      this.ambrosiaBeetle,
      [
        new Cost(this.larva, Decimal(1), this.buyExp),
        new Cost(this.fungus, Decimal(100), this.buyExp),
        new Cost(this.wood, Decimal(100), this.buyExp),
        new Cost(this.food, Decimal(1000), this.buyExp)
      ]
    ))
    this.ambrosiaBeetle.actions.push(new UpAction(this, this.ambrosiaBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.ambrosiaBeetle.actions.push(new UpHire(this, this.ambrosiaBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //    Powderpost
    this.powderpostBeetle.actions.push(new BuyAction(this,
      this.powderpostBeetle,
      [
        new Cost(this.larva, Decimal(1), this.buyExp),
        new Cost(this.wood, Decimal(100), this.buyExp),
        new Cost(this.food, Decimal(1000), this.buyExp)
      ]
    ))
    this.powderpostBeetle.actions.push(new UpAction(this, this.powderpostBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.powderpostBeetle.actions.push(new UpHire(this, this.powderpostBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    const advancedBeetle = new Research("advBeetle",
      "Advanced Beetle Jobs", "More beetle jobs",
      [new Cost(this.science, Decimal(1))],
      [this.ambrosiaBeetle, this.ladybird],
      this
    )
    this.beetleResearch = new Research("beetleRes",
      "Beetle", "Unlock Beetle",
      [new Cost(this.science, Decimal(1))],
      [this.larva, advancedBeetle],
      this
    )
    this.beetleResearch.avabileBaseWorld = false
    this.othersResearch.toUnlock.push(this.beetleResearch)
  }
  initFreezing() {
    this.listFreezig = new Array<Unit>()

    this.ice = new Unit(this, "ice", "Ice",
      "Ice")
    this.iceAnt = new Unit(this, "iceA", "Ice Provisioner",
      "Ice")
    this.iceCompacter = new Unit(this, "iceC", "Ice Compacter",
      "Ice Compacter is a machine that compact ice into crystall.")
    this.iceEngineer = new Unit(this, "iceE", "Ice Engineer",
      "Ice Engineer")

    this.listMaterial.push(this.ice)
    this.listFreezig.push(this.iceAnt)
    this.listFreezig.push(this.iceCollector)
    this.listFreezig.push(this.iceCompacter)
    this.listFreezig.push(this.iceEngineer)

    this.ice.addProductor(new Production(this.iceAnt))
    this.ice.addProductor(new Production(this.iceCompacter, Decimal(-1)))
    this.cristal.addProductor(new Production(this.iceCompacter, Decimal(0.5)))
    this.iceCompacter.addProductor(new Production(this.iceEngineer, Decimal(0.01)))

  }
  initResearchs() {

    //    Prestige
    this.prestigeResearch = new Research(
      "prestigeRes",
      "Travel", "Move to new Worlds",
      [new Cost(this.science, Decimal(1))],
      [],
      this
    )

    //    Engineer
    this.engineerRes = new Research(
      "engineerRes",
      "Engineer", "Engineer will slowly build machinery",
      [new Cost(this.science, Decimal(1))],
      this.listEnginer,
      this
    )

    let listM = new Array<Base>()
    listM = listM.concat(this.listMachinery, [this.engineerRes])
    //    Machinery
    this.machineryRes = new Research(
      "machiRes",
      "Machinery", "Unlock powerfull machinery",
      [new Cost(this.science, Decimal(1))],
      listM,
      this
    )

    //    Bee
    this.beeResearch = new Research(
      "beeRes",
      "Bee", "Unlock Bee !",
      [new Cost(this.science, Decimal(1))],
      [this.nectar, this.foragingBee, this.workerBee, this.honey, this.advancedBee],
      this
    )
    this.beeResearch.avabileBaseWorld = false

    //    Others
    this.othersResearch = new Research(
      "otherRes",
      "Other Helers", "Unlock friendly units",
      [new Cost(this.science, Decimal(1))],
      [this.beeResearch, this.prestigeResearch],
      this
    )

    //    Compost
    this.laserResearch = new Research(
      "lasRes",
      "Laser", "Unlock laser Ant",
      [new Cost(this.science, Decimal(1))],
      [this.laserAnt],
      this
    )

    //    Refinery
    this.refineryResearch = new Research(
      "refRes",
      "Refinery", "Unlock refinery Ant",
      [new Cost(this.science, Decimal(1))],
      [this.refineryAnt],
      this
    )

    //    Compost
    this.composterResearch = new Research(
      "compRes",
      "Compost", "Unlock composter Ant",
      [new Cost(this.science, Decimal(1))],
      [this.composterAnt],
      this
    )

    //    Efficiency
    const allUpEff = Array.from(this.unitMap.values()).filter(u => u.upEfficiency).map(u => u.upEfficiency)
    this.upEfficiency = new Research(
      "effiRes",
      "Efficiency", "Unlock Efficiency Upgrade",
      [new Cost(this.science, Decimal(1))],
      allUpEff, this
    )

    //    Special
    this.specialResearch = new Research(
      "speRes",
      "Special Jobs", "Unlock special Jobs",
      [new Cost(this.science, Decimal(1))],
      [this.composterResearch, this.refineryResearch, this.laserResearch,
      this.othersResearch, this.upEfficiency, this.machineryRes],
      this
    )

    //    Level 2 generators
    const level2ActResearch = new Research(
      "lv2g",
      "Special Jobs", "Unlock special Jobs",
      [new Cost(this.science, Decimal(1))],
      this.level2Actions,
      this
    )
    const tier2Unlock: Array<Base> = [this.specialResearch]
    //    Tier 2 Jobs
    const tier2Research = new Research(
      "tier2JRes",
      "Tier 2 Jobs", "Unlock tier 2 Jobs",
      [new Cost(this.science, Decimal(1))],
      tier2Unlock.concat(this.level2).concat(level2ActResearch),
      this
    )

    //    Up Hire
    const allUpH = Array.from(this.unitMap.values()).filter(u => u.upHire).map(u => u.upHire)
    const r4 = new Research(
      "R4",
      "Upgrade", "Up hire",
      [new Cost(this.science, Decimal(1))],
      allUpH,
      this
    )

    //    Up 2
    const allUp = Array.from(this.unitMap.values()).filter(u => u.upAction).map(u => u.upAction)
    allUp.push(r4)
    const r2 = new Research(
      "R2",
      "Upgrade", "Up desc",
      [new Cost(this.science, Decimal(1))],
      allUp,
      this
    )

    //    Up basic
    this.up1 = new Research(
      "RUp1",
      "Upgrade", "up",
      [new Cost(this.science, Decimal(1))],
      [r2],
      this
    )

    //    Fungus up
    const r3 = new Research(
      "R3",
      "Fungus up", "Fungus up",
      [new Cost(this.science, Decimal(1))],
      [this.fungus.upSpecial], this
    )

    //    Farming
    const r1 = new Research(
      "R1",
      "Farming", "Farming desc",
      [new Cost(this.science, Decimal(1))],
      [this.farmer, r3, this.lumberjack, tier2Research], this
    )

    //    Soil
    this.rDirt = new Research(
      "RDirt",
      "Soil", "Soil",
      [new Cost(this.science, Decimal(1))],
      [this.soil, this.carpenter, r1, this.up1], this
    )

  }
  initWorld() {
    /**
     * Beach World
     */
    //    Crab
    const beachList = new Array<Unit>()
    this.crab = new Unit(this, "crab", "Crab", "Crab yeld sand")
    this.crab.actions.push(new BuyAction(this,
      this.crab,
      [new Cost(this.food, Decimal(1), Decimal(1.01))]
    ))
    this.crab.actions.push(new UpAction(this, this.crab,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    this.crab.actions.push(new UpHire(this, this.crab,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))

    beachList.push(this.crab)
    this.sand.addProductor(new Production(this.crab))

    //    Crab Farmer
    this.crabFarmer = new Unit(this, "crabF", "Farmer Crab", "Farmer Crab yeld fungus")
    this.crabFarmer.actions.push(new BuyAction(this,
      this.crabFarmer,
      [
        new Cost(this.food, Decimal(1), Decimal(1.01)),
        new Cost(this.crab, Decimal(1), Decimal(1.01))
      ]
    ))
    this.crabFarmer.actions.push(new UpAction(this, this.crabFarmer,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    this.crabFarmer.actions.push(new UpHire(this, this.crabFarmer,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))

    beachList.push(this.crabFarmer)
    this.fungus.addProductor(new Production(this.crabFarmer))

    //    Crab Queen ?
    this.crabQueen = new Unit(this, "CrabQ", "Crab Queen", "Crab Queen yeld crab")
    this.crabQueen.actions.push(new BuyAction(this,
      this.crabQueen,
      [
        new Cost(this.food, Decimal(1), Decimal(1.01)),
        new Cost(this.crab, Decimal(1), Decimal(1.01))
      ]
    ))
    this.crabQueen.actions.push(new UpAction(this, this.crabQueen,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    this.crabQueen.actions.push(new UpHire(this, this.crabQueen,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))

    beachList.push(this.crabQueen)
    this.crab.addProductor(new Production(this.crabQueen))

    //    Shrimp
    this.shrimp = new Unit(this, "shrimp", "Shrimp", "Shrimp yeld sand and cristal")
    this.shrimp.actions.push(new BuyAction(this,
      this.shrimp,
      [new Cost(this.food, Decimal(1), Decimal(1.01))]
    ))
    this.shrimp.actions.push(new UpAction(this, this.shrimp,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    this.shrimp.actions.push(new UpHire(this, this.shrimp,
      [new Cost(this.science, Decimal(1E3), Decimal(10))]))

    beachList.push(this.shrimp)
    this.sand.addProductor(new Production(this.shrimp))
    this.cristal.addProductor(new Production(this.shrimp, Decimal(0.1)))

    //    Research
    this.seaRes = new Research(
      "seaRes",
      "Sea Helpers", "Sea Helpers",
      [new Cost(this.science, Decimal(1))],
      [this.crab, this.crabFarmer, this.crabQueen, this.shrimp],
      this
    )
    this.seaRes.avabileBaseWorld = false
    this.othersResearch.toUnlock.push(this.seaRes)
    this.lists.push(new TypeList("Beach", beachList))
  }
  generatePrestige() {
    const expIncrement = Decimal(1.3)

    this.experience = new Unit(this, "exp", "Experience", "Experience", true)
    this.expLists = new Array<TypeList>()
    this.expAnt = new Array<Unit>()

    //    Ant food
    this.pAntPower = new Unit(this, "pap", "Ant Power", "Ant yeld 100% more Food", true)
    this.allPrestigeUp.push(this.pAntPower)
    this.pAntPower.actions.push(new BuyAction(this, this.pAntPower,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expAnt.push(this.pAntPower)
    this.littleAnt.prestigeBonusProduction.push(this.pAntPower)

    //    Ant fungus
    this.pAntFungus = new Unit(this, "paf", "Ant Fungus", "Farmer yeld 100% more Fungus", true)
    this.allPrestigeUp.push(this.pAntFungus)
    this.pAntFungus.actions.push(new BuyAction(this, this.pAntFungus,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expAnt.push(this.pAntFungus)
    this.farmer.prestigeBonusProduction.push(this.pAntFungus)

    //    Ant in next world
    this.pAntNext = new Unit(this, "pan", "Ant Next", "Ant Next", true)
    this.pGeologistNext = new Unit(this, "pgn", "Geologist Next", "Geologist Next", true)
    this.pScientistNext = new Unit(this, "psn", "Scientist Next", "Scientist Next", true)
    this.pFarmerNext = new Unit(this, "pfn", "Farmer Next", "Farmer Next", true)

    const listNext = [this.pAntNext, this.pGeologistNext, this.pScientistNext, this.pFarmerNext]
    listNext.forEach(n => {
      this.allPrestigeUp.push(n)
      n.actions.push(new BuyAction(this, n,
        [new Cost(this.experience, Decimal(10), expIncrement)]))
      this.expAnt.push(n)
    })

    this.littleAnt.prestigeBonusStart = this.pAntNext
    this.geologist.prestigeBonusStart = this.pGeologistNext
    this.student.prestigeBonusStart = this.pScientistNext
    this.farmer.prestigeBonusStart = this.pFarmerNext

    this.expLists.push(new TypeList("Ant", this.expAnt))

    //    Machinery
    this.expMachinery = new Array<Unit>()
    this.pMachineryPower = new Unit(this, "pMach", "Machinery Power", "Machinery Power", true)
    this.pMachineryPower.actions.push(new BuyAction(this, this.pMachineryPower,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expMachinery.push(this.pMachineryPower)
    this.listMachinery.forEach(m => m.prestigeBonusProduction.push(this.pMachineryPower))

    this.expLists.push(new TypeList("Machinery", this.expMachinery))

    this.expLists.map(l => l.list).forEach(al => al.forEach(l => {
      l.unlocked = true
      l.buyAction.unlocked = true
    }))

  }

  setInitialStat() {
    this.all.forEach(u => {
      u.initialize()
      u.actions.forEach(a => a.initialize())
    })
    this.resList.forEach(r => r.initialize())
    this.food.unlocked = true
    this.littleAnt.unlocked = true
    this.littleAnt.buyAction.unlocked = true
    this.rDirt.unlocked = true

    this.listMaterial.forEach(m => m.quantity = Decimal(1E8))
  }

  getProduction(prod: Production,
    level: decimal.Decimal,
    factorial: decimal.Decimal,
    fraction: decimal.Decimal
  ): decimal.Decimal {

    let ret = Decimal(0)
    if (prod.active)
      ret = Decimal.pow(fraction, level)                    //    exponential
        .times(prod.unit.quantity)                          //    time
        .times(prod.getprodPerSec())                        //    efficenty
        .div(factorial)

    const prod2 = prod.unit.producedBy.filter(p => p.active && p.unit.quantity.greaterThan(Decimal(0)))
    for (const p2 of prod2)
      ret = ret.plus(
        this.getProduction(p2, level.plus(1),
          factorial.times(level.plus(1)),
          fraction)
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
    const unl = this.all.filter(u => u.unlocked)
    let maxTime = dif
    let unitZero: Unit = null

    this.all.filter(u => u.quantity.lessThan(1)).forEach(res => {
      res.producedBy.filter(p => p.efficiency.lessThan(0))
        .forEach(p => p.unit.percentage = 0)
    })

    this.all.forEach(a => a.endIn = Number.POSITIVE_INFINITY)

    for (const res of unl.filter(u =>
      u.quantity.greaterThan(0.1) &&
      u.producedBy.filter(p => p.efficiency.lessThan(0)).length > 0)) {

      let a = Decimal(0)
      let b = Decimal(0)
      let c = Decimal(0)
      const d = res.quantity

      for (const prod1 of res.producedBy.filter(r => r.active)) {
        // x
        const prodX = prod1.getprodPerSec()
        c = c.plus(prodX.times(prod1.unit.quantity))
        for (const prod2 of prod1.unit.producedBy.filter(r2 => r2.active)) {
          // x^2
          const prodX2 = prod2.getprodPerSec().times(prodX)
          b = b.plus(prodX2.times(prod2.unit.quantity))
          for (const prod3 of prod2.unit.producedBy.filter(r3 => r3.active)) {
            // x^3
            const prodX3 = prod3.getprodPerSec().times(prodX2)
            a = a.plus(prodX3.times(prod3.unit.quantity))
          }
        }
      }

      // console.log(res.name + " " +
      // a.toString() + "x^3 " + b.toString() + "x^2 " + c.toString() + "x " + d.toString())

      if (a.lessThan(0)
        || b.lessThan(0)
        || c.lessThan(0)
        || d.lessThan(Number.EPSILON)) {

        let solution = Utils.solveCubic(a, b, c, d).filter(s => s.greaterThan(0))
        if (d.lessThan(Number.EPSILON)) {
          solution = [Decimal(0)]
          res.quantity = Decimal(0)
        }

        for (const s of solution) {
          // console.log("sol " + s.toString() )
          if (maxTime > s.toNumber() * 1000) {
            maxTime = s.toNumber() * 1000
            unitZero = res
            console.log(unitZero.name + " stop " + maxTime)
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
    if (remaning > Number.EPSILON)
      this.longUpdate(remaning)
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
      for (const prod of res.producedBy.filter(p => p.active))
        res.toAdd = res.toAdd.plus(this.getProduction(prod, Decimal(1), Decimal(1), fraction))

    all.forEach(u => {
      u.quantity = u.quantity.plus(u.toAdd)
      u.toAdd = Decimal(0)
    })
  }

  /**
   * Unlock units and recheck dependencies.
   */
  unlockUnits(units: Base[], message: string = null) {
    return () => {
      const ok = false
      units.filter(u => u.avabileThisWorld).forEach(u => {
        u.unlocked = true
        if (u.buyAction)
          u.buyAction.unlocked = true
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
    save.pre = this.allPrestigeUp.map(p => p.getData())
    save.res = this.resList.map(r => r.getData())
    save.pd = this.prestigeDone
    return LZString.compressToBase64(JSON.stringify(save))

  }

  /**
   * Load a savegame
   * @param saveRaw 
   */
  load(saveRaw: string): number {
    if (saveRaw) {
      saveRaw = LZString.decompressFromBase64(saveRaw)
      const save = JSON.parse(saveRaw)
      this.currentEarning = Decimal(save.cur)
      this.lifeEarning = Decimal(save.life)
      this.world.restore(save.w)

      for (const s of save.list)
        this.unitMap.get(s.id).restore(s)

      this.nextWorlds[0].restore(save.nw[0])
      this.nextWorlds[1].restore(save.nw[1])
      this.nextWorlds[2].restore(save.nw[2])

      for (const s of save.pre)
        this.allPrestigeUp.find(p => p.id === s.id).restore(s)

      for (const s of save.res)
        this.resList.find(p => p.id === s.id).restore(s)

      if (save.pd)
        this.prestigeDone = Decimal(save.pd)
      return save.last

    }
    return null
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
