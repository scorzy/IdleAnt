import { World } from './world';
import { DefaultUrlHandlingStrategy } from '@angular/router/src/url_handling_strategy';
import { Utils } from './utils';
import { Base, Type } from './units/base';
import { Cost } from './cost';
import { Alert, alertArray, IAlert } from './alert';
import { PrestigeList, TypeList } from './typeList';
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

export class GameModel {

  isChanged = true

  //    Cost
  buyExp = Decimal(1.1)
  buyExpUnit = Decimal(1)
  scienceCost1 = Decimal(100)
  scienceCost2 = Decimal(1E3)
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

  //    Tier 1
  geologist: Unit
  student: Unit
  carpenter: Unit
  farmer: Unit
  lumberjack: Unit
  level1 = Array<Unit>()

  //    Tier 2
  composterAnt: Unit
  refineryAnt: Unit
  laserAnt: Unit
  hydroAnt: Unit
  planterAnt: Unit
  scientist: Unit
  level2 = Array<Unit>()

  jobMaterial: Unit[][]

  listJobs = Array<Unit>()

  //    Generators
  littleAnt: Unit
  queenAnt: Unit
  nestAnt: Unit
  list = Array<Unit>()

  //    Machinery
  composterStation: Unit
  refineryStation: Unit
  laserStation: Unit
  hydroFarm: Unit
  plantingMachine: Unit

  mine: Unit
  sandDigger: Unit
  loggingMachine: Unit
  honeyMaker: Unit
  burningGlass: Unit

  listMachinery = new Array<Unit>()

  //    Enginers
  composterEnginer: Unit
  laserEnginer: Unit
  hydroEnginer: Unit
  plantingEnginer: Unit
  refineryEnginery: Unit

  mineEnginer: Unit
  sandEnginer: Unit
  woodEnginer: Unit
  beeEnginer: Unit
  lensEnginer: Unit

  listEnginer = new Array<Unit>()

  //    Research
  up1: Research
  rDirt: Research
  resList = Array<Research>()
  specialResearch: Research
  prestigeResearch: Research
  engineerRes: Research
  machineryRes: Research

  experimentResearch: Research
  composterResearch: Research
  refineryResearch: Research
  laserResearch: Research
  hydroResearch: Research
  planterResearch: Research

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
  iceDrillAnt: Unit
  iceMelter: Unit
  iceCollector: Unit
  iceCompacter: Unit
  iceEngineer: Unit
  iceCompEngineer: Unit
  iceResearch: Research
  listFreezig = new Array<Unit>()

  //  Infestation
  poisonousPlant: Unit
  poisonousPlant2: Unit
  weedkiller: Unit
  chemistAnt: Unit
  disinfestationAnt: Unit
  flametrowerAnt: Unit

  disinfestationBeetle: Unit
  flametrowerBeetle: Unit

  chemistBee: Unit

  basicDisinfestationRes: Research
  flametrowerRes: Research
  weedkillerRes: Research

  listInfestation = new Array<Unit>()


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
  expTech = new Array<Unit>()
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

  //    Prestige Tecnology
  pComposter: Unit
  pRefinery: Unit
  pLaser: Unit
  pHydro: Unit
  pPlanter: Unit

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
    this.defineGenerators()
    this.initJobs()
    this.initGenerators()

    this.initMachinery()
    this.initEnginers()

    //    Fungus
    this.fungus.actions.push(new UpSpecial(this, this.fungus))

    //  End of base World

    //  Other Worlds
    this.initBee()
    this.initBeach()
    this.initForest()
    this.initFreezing()
    this.initInfestation()

    //  Researchs
    this.initResearchs()

    //    Lists
    this.lists.push(new TypeList("Material", this.listMaterial))
    this.lists.push(new TypeList("Jobs", this.level1))
    this.lists.push(new TypeList("Advanced Jobs", this.level2))
    this.lists.push(new TypeList("Ants", this.list))
    this.lists.push(new TypeList("Machinery", this.listMachinery))
    this.lists.push(new TypeList("Engineer", this.listEnginer))
    this.lists.push(new TypeList("Bee", this.listBee))
    this.lists.push(new TypeList("Beetle", this.listForest))
    this.lists.push(new TypeList("Freezing", this.listFreezig))
    this.lists.push(new TypeList("Infestation", this.listInfestation))

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

    this.ice = new Unit(this, "ice", "Ice",
      "Ice")
    this.listMaterial.push(this.ice)

    this.listMaterial.forEach(material => material.types = [Type.Material])
  }
  defineGenerators() {
    this.littleAnt = new Unit(this, "G1", "Ant",
      "Ant are the lowest class of worker. They continuously gather food.")
    this.queenAnt = new Unit(this, "G2", "Queen",
      "Queen proces ants")
    this.nestAnt = new Unit(this, "G3", "Nest",
      "Nest proces queen")
  }
  initGenerators() {
    this.list.push(this.littleAnt, this.queenAnt, this.nestAnt)
    this.list.forEach(ant => ant.types = [Type.Ant, Type.Generator])

    this.littleAnt.unlocked = true

    this.littleAnt.actions.push(new BuyAndUnlockAction(this,
      this.littleAnt,
      [new Cost(this.food, Decimal(10), Decimal(this.buyExp))],
      [this.queenAnt]
    ))

    this.queenAnt.actions.push(new BuyAndUnlockAction(this,
      this.queenAnt,
      [
        new Cost(this.food, Decimal(1E3), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(10), Decimal(this.buyExpUnit))
      ],
      [this.nestAnt, this.geologist]
    ))

    this.nestAnt.actions.push(new BuyAction(this,
      this.nestAnt,
      [
        new Cost(this.food, Decimal(1E9), Decimal(this.buyExp)),
        new Cost(this.queenAnt, Decimal(1E3), Decimal(this.buyExpUnit))
      ],
    ))

    for (let i = 0; i < this.list.length - 1; i++)
      this.list[i].addProductor(new Production(this.list[i + 1]))

    for (let i = 0; i < this.list.length; i++) {
      this.list[i].actions.push(new UpAction(this, this.list[i],
        [new Cost(this.science, Decimal(Decimal(100).times(Decimal.pow(10, Decimal(i)))), Decimal(10))]))
      this.list[i].actions.push(new UpHire(this, this.list[i],
        [new Cost(this.science, Decimal(Decimal(100).times(Decimal.pow(10, Decimal(i)))), Decimal(10))]))
    }
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
    this.cristal.addProductor(new Production(this.geologist))
    this.science.addProductor(new Production(this.student))
    this.soil.addProductor(new Production(this.carpenter))
    this.wood.addProductor(new Production(this.lumberjack))

    //    Student
    this.student.actions.push(new BuyAndUnlockAction(this,
      this.student,
      [
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.cristal, Decimal(100), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit))
      ],
      [this.science]
    ))

    //    Geologist
    this.geologist.actions.push(new BuyAndUnlockAction(this,
      this.geologist,
      [
        new Cost(this.food, Decimal(1000), this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ],
      [this.cristal, this.student]
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
        new Cost(this.soil, Decimal(100), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit)),
      ],
      [this.wood]
    ))

    //    Farmer
    this.farmer.actions.push(new BuyAndUnlockAction(this,
      this.farmer,
      [
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.soil, Decimal(100), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit)),
      ],
      [this.fungus]
    ))

    this.level1.forEach(l => {
      l.actions.push(new UpAction(this, l, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
      l.actions.push(new UpHire(this, l, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    })


    //
    //    Special
    //
    const specialProduction = Decimal(10)
    const specialCost = Decimal(-5)
    const specialFood = Decimal(1E7)
    const specialRes2 = Decimal(1E4)

    //  Scientist
    this.scientist = new Unit(this, "scie2",
      "Scientist Ant", "Transform cristal into science.")
    this.scientist.types = [Type.Ant]
    this.level2.push(this.scientist)
    this.scientist.actions.push(new BuyAction(this,
      this.scientist,
      [
        new Cost(this.food, specialFood, this.buyExp),
        new Cost(this.cristal, specialRes2, this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.science.addProductor(new Production(this.scientist, specialProduction))
    this.cristal.addProductor(new Production(this.scientist, specialCost))

    //  Composter
    this.composterAnt = new Unit(this, "com",
      "Composter Ant", "Transform wood into soil.")
    this.composterAnt.types = [Type.Ant]
    this.level2.push(this.composterAnt)
    this.composterAnt.actions.push(new BuyAction(this,
      this.composterAnt,
      [
        new Cost(this.food, specialFood, this.buyExp),
        new Cost(this.wood, specialRes2, this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.soil.addProductor(new Production(this.composterAnt, specialProduction))
    this.wood.addProductor(new Production(this.composterAnt, specialCost))

    //  Refinery
    this.refineryAnt = new Unit(this, "ref",
      "Refinery Ant", "Transform soil into sand.")
    this.refineryAnt.types = [Type.Ant]
    this.level2.push(this.refineryAnt)
    this.refineryAnt.actions.push(new BuyAction(this,
      this.refineryAnt,
      [
        new Cost(this.food, specialFood, this.buyExp),
        new Cost(this.soil, specialRes2, this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.sand.addProductor(new Production(this.refineryAnt, specialProduction))
    this.soil.addProductor(new Production(this.refineryAnt, specialCost))

    //  Laser
    this.laserAnt = new Unit(this, "las",
      "Laser Ant", "Transform sand into cristal.")
    this.laserAnt.types = [Type.Ant]
    this.level2.push(this.laserAnt)
    this.laserAnt.actions.push(new BuyAction(this,
      this.laserAnt,
      [
        new Cost(this.food, specialFood, this.buyExp),
        new Cost(this.sand, specialRes2, this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.cristal.addProductor(new Production(this.laserAnt, specialProduction))
    this.sand.addProductor(new Production(this.laserAnt, specialCost))

    //  Hydro
    this.hydroAnt = new Unit(this, "hydroFarmer",
      "Hydroponic Ant", "Transform cristal into fungus.")
    this.hydroAnt.types = [Type.Ant]
    this.level2.push(this.hydroAnt)
    this.hydroAnt.actions.push(new BuyAction(this,
      this.hydroAnt,
      [
        new Cost(this.food, specialFood, this.buyExp),
        new Cost(this.cristal, specialRes2, this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.fungus.addProductor(new Production(this.hydroAnt, specialProduction))
    this.cristal.addProductor(new Production(this.hydroAnt, specialCost))

    //  Planter
    this.planterAnt = new Unit(this, "planterAnt",
      "Planter Ant", "Transform fungus into wood.")
    this.planterAnt.types = [Type.Ant]
    this.level2.push(this.planterAnt)
    this.planterAnt.actions.push(new BuyAction(this,
      this.planterAnt,
      [
        new Cost(this.food, specialFood, this.buyExp),
        new Cost(this.fungus, specialRes2, this.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.wood.addProductor(new Production(this.planterAnt, specialProduction))
    this.fungus.addProductor(new Production(this.planterAnt, specialCost))

    this.level2.forEach(l => {
      l.actions.push(new UpAction(this, l, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
      l.actions.push(new UpHire(this, l, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    })
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


    this.queenBee.actions.push(new BuyAndUnlockAction(this,
      this.queenBee,
      [
        new Cost(this.foragingBee, Decimal(50), this.buyExpUnit),
        new Cost(this.honey, Decimal(1E3), this.buyExp),
        new Cost(this.food, Decimal(1E6), this.buyExp),
      ], [this.hiveBee]
    ))
    this.foragingBee.addProductor(new Production(this.queenBee))

    this.hiveBee.actions.push(new BuyAction(this,
      this.hiveBee,
      [
        new Cost(this.queenBee, Decimal(1E3), this.buyExpUnit),
        new Cost(this.honey, Decimal(1E6), this.buyExp),
        new Cost(this.food, Decimal(1E9), this.buyExp),
      ]
    ))
    this.queenBee.addProductor(new Production(this.hiveBee))

    this.queenBee.actions.push(new UpAction(this, this.queenBee, [new Cost(this.science, this.scienceCost3, Decimal(10))]))
    this.queenBee.actions.push(new UpHire(this, this.queenBee, [new Cost(this.science, this.scienceCost3, Decimal(10))]))

    this.hiveBee.actions.push(new UpAction(this, this.hiveBee, [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    this.hiveBee.actions.push(new UpHire(this, this.hiveBee, [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))

    //   Advanced Bee
    this.scientistBee = new Unit(this, "scBee", "Scientist Bee", "Scientist bee studies honey properties.")
    this.foodBee = new Unit(this, "foodBee", "Food Bee", "Convert honey to food")

    //    Scientist
    this.scientistBee.types = [Type.Bee]
    this.scientistBee.actions.push(new BuyAction(this,
      this.scientistBee,
      [
        new Cost(this.foragingBee, Decimal(1), this.buyExpUnit),
        new Cost(this.honey, Decimal(6E3), this.buyExp),
        new Cost(this.cristal, Decimal(4E3), this.buyExp),
      ]
    ))
    this.science.addProductor(new Production(this.scientistBee, Decimal(10)))
    this.honey.addProductor(new Production(this.scientistBee, Decimal(-2)))
    this.cristal.addProductor(new Production(this.scientistBee, Decimal(-1)))

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
        new Cost(this.honey, Decimal(1E3), this.buyExp)
      ]
    ))
    this.food.addProductor(new Production(this.foodBee, Decimal(10)))
    this.honey.addProductor(new Production(this.foodBee, Decimal(-5)))
    this.foodBee.actions.push(new UpAction(this, this.foodBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    this.foodBee.actions.push(new UpHire(this, this.foodBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))


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

    //    Bee
    this.beeResearch = new Research(
      "beeRes",
      "Bee", "Unlock Bee !",
      [new Cost(this.science, Decimal(1E3))],
      [this.nectar, this.foragingBee, this.workerBee, this.honey, this.advancedBee],
      this
    )
    this.beeResearch.avabileBaseWorld = false

  }
  initMachinery() {

    this.listMachinery = new Array<Unit>()
    const machineryProd = Decimal(150)
    const machineryCost = Decimal(-10)

    const price1 = Decimal(1E5)
    const price2 = Decimal(6E4)
    const price3 = Decimal(3E4)

    //    Composter
    this.composterStation = new Unit(this, "composterStation", "Composter Station", "Turn wood into soil")
    this.composterStation.types = [Type.Machinery]
    this.composterStation.actions.push(new BuyAction(this,
      this.composterStation,
      [
        new Cost(this.wood, price1, this.buyExp),
        new Cost(this.fungus, price2, this.buyExp),
        new Cost(this.cristal, price3, this.buyExp)
      ]
    ))
    this.soil.addProductor(new Production(this.composterStation, machineryProd))
    this.wood.addProductor(new Production(this.composterStation, machineryCost))
    this.listMachinery.push(this.composterStation)

    //    Refinery
    this.refineryStation = new Unit(this, "refineryStation", "Refinery Station", "Turn soil into sand")
    this.refineryStation.types = [Type.Machinery]
    this.refineryStation.actions.push(new BuyAction(this,
      this.refineryStation,
      [
        new Cost(this.soil, price1, this.buyExp),
        new Cost(this.wood, price2, this.buyExp),
        new Cost(this.fungus, price3, this.buyExp)
      ]
    ))
    this.sand.addProductor(new Production(this.refineryStation, machineryProd))
    this.soil.addProductor(new Production(this.refineryStation, machineryCost))

    this.listMachinery.push(this.refineryStation)

    //    Laser
    this.laserStation = new Unit(this, "laserStation", "Laser Station", "Yeld cristal")
    this.laserStation.types = [Type.Machinery]
    this.laserStation.actions.push(new BuyAction(this,
      this.laserStation,
      [
        new Cost(this.sand, price1, this.buyExp),
        new Cost(this.soil, price2, this.buyExp),
        new Cost(this.wood, price3, this.buyExp)
      ]
    ))
    this.cristal.addProductor(new Production(this.laserStation, machineryProd))
    this.sand.addProductor(new Production(this.laserStation, machineryCost))

    this.listMachinery.push(this.laserStation)

    //    Hydroponic Farm
    this.hydroFarm = new Unit(this, "hydroFarm", "Hydroponic Farm", "Yeld fungus")
    this.hydroFarm.types = [Type.Machinery]
    this.hydroFarm.actions.push(new BuyAction(this,
      this.hydroFarm,
      [
        new Cost(this.cristal, price1, this.buyExp),
        new Cost(this.sand, price2, this.buyExp),
        new Cost(this.soil, price3, this.buyExp)
      ]
    ))
    this.fungus.addProductor(new Production(this.hydroFarm, machineryProd))
    this.cristal.addProductor(new Production(this.hydroFarm, machineryCost))
    this.listMachinery.push(this.hydroFarm)

    //    Planting Machine
    this.plantingMachine = new Unit(this, "plantingMac", "Planting Machine", "Yeld wood")
    this.plantingMachine.types = [Type.Machinery]
    this.plantingMachine.actions.push(new BuyAction(this,
      this.plantingMachine,
      [
        new Cost(this.fungus, price1, this.buyExp),
        new Cost(this.cristal, price2, this.buyExp),
        new Cost(this.sand, price3, this.buyExp)
      ]
    ))
    this.wood.addProductor(new Production(this.plantingMachine, machineryProd))
    this.fungus.addProductor(new Production(this.plantingMachine, machineryCost))
    this.listMachinery.push(this.plantingMachine)


    //    Not always avaiable
    const machineryProd2 = machineryProd.div(2)

    //    Sand digger
    this.sandDigger = new Unit(this, "sandDigger", "Sand Digger",
      "Yeld sand")
    this.sandDigger.avabileBaseWorld = false
    this.sandDigger.types = [Type.Machinery]
    this.sandDigger.actions.push(new BuyAction(this,
      this.sandDigger,
      [
        new Cost(this.wood, price1, this.buyExp),
        new Cost(this.cristal, price2, this.buyExp)
      ]
    ))
    this.cristal.addProductor(new Production(this.sandDigger, machineryProd2))
    this.listMachinery.push(this.sandDigger)

    //    Wood
    this.loggingMachine = new Unit(this, "loggingMachine", "Logging Machine",
      "Yeld wood")
    this.loggingMachine.avabileBaseWorld = false
    this.loggingMachine.types = [Type.Machinery]
    this.loggingMachine.actions.push(new BuyAction(this,
      this.loggingMachine,
      [
        new Cost(this.wood, price1, this.buyExp),
        new Cost(this.cristal, price2, this.buyExp)
      ]
    ))
    this.wood.addProductor(new Production(this.loggingMachine, machineryProd2))
    this.listMachinery.push(this.loggingMachine)

    //    Mine
    this.mine = new Unit(this, "mine", "Mine",
      "Yeld cristal")
    this.mine.avabileBaseWorld = false
    this.mine.types = [Type.Machinery]
    this.mine.actions.push(new BuyAction(this,
      this.mine,
      [
        new Cost(this.wood, price1, this.buyExp),
        new Cost(this.soil, price2, this.buyExp)
      ]
    ))
    this.cristal.addProductor(new Production(this.mine, machineryProd2))
    this.listMachinery.push(this.mine)

    //    Honey
    this.honeyMaker = new Unit(this, "honeyMaker", "Honey Maker",
      "Automate the making of honey. Only bee know how it work.")
    this.honeyMaker.avabileBaseWorld = false
    this.honeyMaker.types = [Type.Machinery]
    this.honeyMaker.actions.push(new BuyAction(this,
      this.honeyMaker,
      [
        new Cost(this.nectar, price1, this.buyExp),
        new Cost(this.honey, price2, this.buyExp)
      ]
    ))
    this.honey.addProductor(new Production(this.honeyMaker, machineryProd))
    this.nectar.addProductor(new Production(this.honeyMaker, machineryCost))
    this.listMachinery.push(this.honeyMaker)

    //    Ice Compacter
    this.iceCompacter = new Unit(this, "iceC", "Ice Compacter",
      "Ice Compacter is a machine that compact ice into crystall.")
    this.iceCompacter.avabileBaseWorld = false
    this.iceCompacter.types = [Type.Machinery]
    this.iceCompacter.actions.push(new BuyAction(this,
      this.iceCompacter,
      [
        new Cost(this.cristal, price1, this.buyExp),
        new Cost(this.wood, price2, this.buyExp),
        new Cost(this.soil, price3, this.buyExp)
      ]
    ))
    this.cristal.addProductor(new Production(this.iceCompacter, machineryProd))
    this.ice.addProductor(new Production(this.iceCompacter, machineryCost))
    this.listMachinery.push(this.iceCompacter)

    //    Ice Collector
    this.iceCollector = new Unit(this, "iceK", "Water Tank",
      "A tank of water.")
    this.iceCollector.avabileBaseWorld = false
    this.iceCollector.types = [Type.Machinery]
    this.iceCollector.actions.push(new BuyAction(this,
      this.iceCollector,
      [
        new Cost(this.wood, price1, this.buyExp),
        new Cost(this.soil, price2, this.buyExp)
      ]
    ))
    this.cristal.addProductor(new Production(this.iceCollector, machineryProd2))
    this.listMachinery.push(this.iceCollector)

    //    Ice Burning Glass
    this.burningGlass = new Unit(this, "burningGlass", "Burning Lens",
      "A large convex lens used to concentrate sun's rays. This machine melt ice faster than anything else.")
    this.burningGlass.avabileBaseWorld = false
    this.burningGlass.types = [Type.Machinery]
    this.burningGlass.actions.push(new BuyAction(this,
      this.iceCollector,
      [
        new Cost(this.cristal, price1, this.buyExp),
        new Cost(this.wood, price2, this.buyExp)
      ]
    ))
    this.ice.addProductor(new Production(this.iceCollector, machineryProd2.times(10)))
    this.listMachinery.push(this.burningGlass)
  }
  initEnginers() {
    this.listEnginer = new Array<Unit>()

    this.composterEnginer = new Unit(this, "engCo", "Composter Engineer",
      "Slowly build laser stations.")
    this.laserEnginer = new Unit(this, "engLa", "Laser Engineer",
      "Slowly build laser stations.")
    this.hydroEnginer = new Unit(this, "engHy", "Hydro Engineer",
      "Slowly build hydroponic farms.")
    this.plantingEnginer = new Unit(this, "engSo", "Planting Engineer",
      "Slowly build planting machines.")
    this.refineryEnginery = new Unit(this, "engRef", "Refine Engineer",
      "Slowly build refinery stations.")

    this.mineEnginer = new Unit(this, "engMi", "Mining Engineer",
      "Slowly build mines.")
    this.sandEnginer = new Unit(this, 'engSa', "Sand Engineer",
      'Slowly build sand diggers.')
    this.woodEnginer = new Unit(this, "engWo", "Wood Engineer",
      "Slowly build logging machines.")
    this.beeEnginer = new Unit(this, "engBee", "Bee Engineer",
      "Slowly build honey makers.")
    this.iceEngineer = new Unit(this, "engIce", "Ice Engineer",
      "Slowly build water tanks.")
    this.iceCompEngineer = new Unit(this, "engIceComp", "Compacting Engineer",
      "Slowly build ice compacters.")
    this.lensEnginer = new Unit(this, "lensEnginer", "Burning Lens Engineer",
      "Slowly build burning lens.")

    this.sandEnginer.avabileBaseWorld = false
    this.mineEnginer.avabileBaseWorld = false
    this.woodEnginer.avabileBaseWorld = false
    this.beeEnginer.avabileBaseWorld = false
    this.iceEngineer.avabileBaseWorld = false
    this.iceCompEngineer.avabileBaseWorld = false
    this.lensEnginer.avabileBaseWorld = false

    this.listEnginer.push(this.composterEnginer)
    this.listEnginer.push(this.refineryEnginery)
    this.listEnginer.push(this.laserEnginer)
    this.listEnginer.push(this.hydroEnginer)
    this.listEnginer.push(this.plantingEnginer)
    this.listEnginer.push(this.mineEnginer)
    this.listEnginer.push(this.sandEnginer)
    this.listEnginer.push(this.woodEnginer)
    this.listEnginer.push(this.beeEnginer)
    this.listEnginer.push(this.iceEngineer)
    this.listEnginer.push(this.iceCompEngineer)
    this.listEnginer.push(this.lensEnginer)

    this.laserStation.addProductor(new Production(this.laserEnginer, Decimal(0.01)))
    this.hydroFarm.addProductor(new Production(this.hydroEnginer, Decimal(0.01)))
    this.plantingMachine.addProductor(new Production(this.plantingEnginer, Decimal(0.01)))
    this.mine.addProductor(new Production(this.mineEnginer, Decimal(0.01)))
    this.sandDigger.addProductor(new Production(this.sandEnginer, Decimal(0.01)))
    this.loggingMachine.addProductor(new Production(this.woodEnginer, Decimal(0.01)))
    this.refineryStation.addProductor(new Production(this.refineryEnginery, Decimal(0.01)))
    this.composterStation.addProductor(new Production(this.composterEnginer, Decimal(0.01)))
    this.honeyMaker.addProductor(new Production(this.beeEnginer, Decimal(0.01)))
    this.iceEngineer.addProductor(new Production(this.iceEngineer, Decimal(0.01)))
    this.iceCompacter.addProductor(new Production(this.iceCompEngineer, Decimal(0.01)))
    this.burningGlass.addProductor(new Production(this.lensEnginer, Decimal(0.01)))

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

    this.laserEnginer.buyAction.priceF.push(new Cost(this.laserStation, Decimal(10), this.buyExp))
    this.hydroEnginer.buyAction.priceF.push(new Cost(this.hydroFarm, Decimal(10), this.buyExp))
    this.plantingEnginer.buyAction.priceF.push(new Cost(this.plantingMachine, Decimal(10), this.buyExp))
    this.mineEnginer.buyAction.priceF.push(new Cost(this.mine, Decimal(10), this.buyExp))
    this.sandEnginer.buyAction.priceF.push(new Cost(this.sandDigger, Decimal(10), this.buyExp))
    this.woodEnginer.buyAction.priceF.push(new Cost(this.loggingMachine, Decimal(10), this.buyExp))
    this.refineryEnginery.buyAction.priceF.push(new Cost(this.refineryStation, Decimal(10), this.buyExp))
    this.composterEnginer.buyAction.priceF.push(new Cost(this.composterStation, Decimal(10), this.buyExp))
    this.beeEnginer.buyAction.priceF.push(new Cost(this.honeyMaker, Decimal(10), this.buyExp))
    this.iceEngineer.buyAction.priceF.push(new Cost(this.iceCollector, Decimal(10), this.buyExp))
    this.iceCompEngineer.buyAction.priceF.push(new Cost(this.iceCompacter, Decimal(10), this.buyExp))
    this.lensEnginer.buyAction.priceF.push(new Cost(this.burningGlass, Decimal(10), this.buyExp))
  }
  initForest() {
    this.listForest = new Array<Unit>()

    this.larva = new Unit(this, "larva", "Larva",
      "Larva is the juvenile form of many insect.")
    this.beetle = new Unit(this, "beetle", "Beetle",
      "Yield various resources.")
    this.ambrosiaBeetle = new Unit(this, "ambrosiaBeetle", "Ambrosia beetle",
      "Yield wood.")
    this.beetleNest = new Unit(this, "beetleNest", "Beetle Nest",
      "Yield larvae.")
    this.ladybird = new Unit(this, "ladybird", "Ladybird",
      "Yield science.")
    this.beetleColony = new Unit(this, "beetleColony", "Beetle Colony",
      "Yield nest.")
    this.powderpostBeetle = new Unit(this, "powder", "Powderpost Beetle",
      "Powderpost beetles are a group of woodboring beetles.")

    this.listForest.push(this.beetleColony)
    this.listForest.push(this.beetleNest)
    this.listForest.push(this.beetle)
    this.listForest.push(this.larva)
    this.listForest.push(this.powderpostBeetle)
    this.listForest.push(this.ambrosiaBeetle)
    this.listForest.push(this.ladybird)

    this.food.addProductor(new Production(this.larva, Decimal(0.1)))

    this.cristal.addProductor(new Production(this.beetle, Decimal(0.2)))
    this.soil.addProductor(new Production(this.beetle, Decimal(0.5)))
    this.food.addProductor(new Production(this.beetle))

    this.science.addProductor(new Production(this.ladybird, Decimal(5)))

    this.fungus.addProductor(new Production(this.ambrosiaBeetle, Decimal(-6)))
    this.wood.addProductor(new Production(this.ambrosiaBeetle, Decimal(15)))

    this.larva.addProductor(new Production(this.beetleNest))
    this.beetleNest.addProductor(new Production(this.beetleColony))

    this.food.addProductor(new Production(this.powderpostBeetle))
    this.wood.addProductor(new Production(this.powderpostBeetle))

    //    Larva
    this.larva.actions.push(new BuyAndUnlockAction(this,
      this.larva,
      [new Cost(this.food, Decimal(10), this.buyExp)],
      [this.beetle, this.powderpostBeetle]
    ))
    this.larva.actions.push(new UpAction(this, this.larva, [new Cost(this.science, this.scienceCost1, this.upgradeScienceExp)]))
    this.larva.actions.push(new UpHire(this, this.larva, [new Cost(this.science, this.scienceCost1, this.upgradeScienceExp)]))

    //    Beetle
    this.beetle.actions.push(new BuyAndUnlockAction(this,
      this.beetle,
      [
        new Cost(this.larva, Decimal(1), this.buyExpUnit),
        new Cost(this.wood, Decimal(200), this.buyExp),
        new Cost(this.food, Decimal(2000), this.buyExp)
      ],
      [this.beetleNest]
    ))
    this.beetle.actions.push(new UpAction(this, this.beetle, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.beetle.actions.push(new UpHire(this, this.beetle, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //    Beetle Nest
    this.beetleNest.actions.push(new BuyAndUnlockAction(this,
      this.beetleNest,
      [
        new Cost(this.beetle, Decimal(100), this.buyExpUnit),
        new Cost(this.wood, Decimal(1E6), this.buyExp),
        new Cost(this.soil, Decimal(1E3), this.buyExp),
        new Cost(this.food, Decimal(1E3), this.buyExp)
      ],
      [this.beetleColony]
    ))
    this.beetleNest.actions.push(new UpAction(this, this.beetleNest, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    this.beetleNest.actions.push(new UpHire(this, this.beetleNest, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))

    //    Beetle Colony
    this.beetleColony.actions.push(new BuyAction(this,
      this.beetleColony,
      [
        new Cost(this.beetleNest, Decimal(10), this.buyExpUnit),
        new Cost(this.powderpostBeetle, Decimal(10), this.buyExpUnit),
        new Cost(this.ambrosiaBeetle, Decimal(10), this.buyExpUnit),
        new Cost(this.fungus, Decimal(1E6), this.buyExp),
        new Cost(this.wood, Decimal(1E9), this.buyExp),
        new Cost(this.soil, Decimal(1E6), this.buyExp),
        new Cost(this.food, Decimal(1E6), this.buyExp)
      ]
    ))
    this.beetleColony.actions.push(new UpAction(this, this.beetleColony,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    this.beetleColony.actions.push(new UpHire(this, this.beetleColony,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))

    //    Lady Beetle
    this.ladybird.actions.push(new BuyAction(this,
      this.ladybird,
      [
        new Cost(this.larva, Decimal(1), this.buyExp),
        new Cost(this.cristal, Decimal(1E4), this.buyExp),
        new Cost(this.food, Decimal(1E6), this.buyExp)
      ]
    ))
    this.ladybird.actions.push(new UpAction(this, this.ladybird, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    this.ladybird.actions.push(new UpHire(this, this.ladybird, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))


    //    Ambrosia Beetle
    this.ambrosiaBeetle.actions.push(new BuyAction(this,
      this.ambrosiaBeetle,
      [
        new Cost(this.larva, Decimal(1), this.buyExp),
        new Cost(this.fungus, Decimal(1E4), this.buyExp),
        new Cost(this.wood, Decimal(1E4), this.buyExp),
        new Cost(this.food, Decimal(1E7), this.buyExp)
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
        new Cost(this.wood, Decimal(1000), this.buyExp),
        new Cost(this.food, Decimal(5000), this.buyExp)
      ]
    ))
    this.powderpostBeetle.actions.push(new UpAction(this, this.powderpostBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.powderpostBeetle.actions.push(new UpHire(this, this.powderpostBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    const advancedBeetle = new Research("advBeetle",
      "Advanced Beetle Jobs", "More beetle jobs",
      [new Cost(this.science, Decimal(30))],
      [this.ambrosiaBeetle, this.ladybird],
      this
    )
    this.beetleResearch = new Research("beetleRes",
      "Beetle", "Unlock Beetle",
      [new Cost(this.science, Decimal(600))],
      [this.larva, advancedBeetle],
      this
    )
    this.beetleResearch.avabileBaseWorld = false
  }
  initFreezing() {
    this.listFreezig = new Array<Unit>()

    this.iceAnt = new Unit(this, "iceA", "Ice Provisioner",
      "Collect Ice")
    this.iceDrillAnt = new Unit(this, "iceDrill", "Ice Drilling",
      "Equip an ant with an ice drill to destroy ice.")
    this.iceMelter = new Unit(this, "iceMelter", "Ice Melter",
      "Equip an ant with a flametrower to destroy ice.")

    this.listFreezig.push(this.iceAnt)
    this.listFreezig.push(this.iceDrillAnt)
    this.listFreezig.push(this.iceMelter)

    //  Ice Provisioner
    this.ice.addProductor(new Production(this.iceAnt))
    this.iceAnt.actions.push(new BuyAction(this,
      this.iceAnt,
      [
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit))
      ]
    ))
    this.iceAnt.actions.push(new UpAction(this, this.iceAnt, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.iceAnt.actions.push(new UpHire(this, this.iceAnt, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //  Ice Driller
    this.ice.addProductor(new Production(this.iceDrillAnt, Decimal(-10)))
    this.iceDrillAnt.actions.push(new BuyAction(this,
      this.iceDrillAnt,
      [
        new Cost(this.food, Decimal(1000), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit))
      ]
    ))
    this.iceDrillAnt.actions.push(new UpAction(this, this.iceDrillAnt, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.iceDrillAnt.actions.push(new UpHire(this, this.iceDrillAnt, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    // Ice Melter
    this.ice.addProductor(new Production(this.iceMelter, Decimal(-100)))
    this.wood.addProductor(new Production(this.iceMelter, Decimal(-5)))
    this.iceMelter.actions.push(new BuyAction(this,
      this.iceMelter,
      [
        new Cost(this.food, Decimal(1E7), Decimal(this.buyExp)),
        new Cost(this.wood, Decimal(1E4), Decimal(this.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.buyExpUnit))
      ]
    ))
    this.iceMelter.actions.push(new UpAction(this, this.iceMelter, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    this.iceMelter.actions.push(new UpHire(this, this.iceMelter, [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))

    const iceResearch2 = new Research(
      "iceRes2", "Flametrower",
      "Use fire to melt ice.",
      [new Cost(this.science, Decimal(800))],
      [this.iceMelter],
      this
    )

    this.iceResearch = new Research(
      "iceRes", "Ice",
      "Ice",
      [new Cost(this.science, Decimal(30))],
      [this.iceAnt, this.iceDrillAnt, iceResearch2],
      this
    )
    this.iceResearch.avabileBaseWorld = false

  }
  initResearchs() {

    //    Engineer
    this.engineerRes = new Research(
      "engineerRes",
      "Engineer", "Engineer will slowly build machinery.",
      [new Cost(this.science, Decimal(1E9))],
      this.listEnginer,
      this
    )

    //    Planter
    this.planterResearch = new Research(
      "planRes",
      "Planting", "Tree planting is the process of transplanting tree seedlings.",
      [new Cost(this.science, Decimal(1E3))],
      [this.planterAnt],
      this
    )

    //    Hydro
    this.hydroResearch = new Research(
      "hydroRes",
      "Hydroponics", "Hydroponics is the art of growing plants without soil.",
      [new Cost(this.science, Decimal(1E3))],
      [this.hydroAnt],
      this
    )
    //    Laser
    this.laserResearch = new Research(
      "lasRes",
      "Laser", "Sand can be fused to cristal.",
      [new Cost(this.science, Decimal(1E3))],
      [this.laserAnt],
      this
    )

    //    Refinery
    this.refineryResearch = new Research(
      "refRes",
      "Refinery", "Soil can be refined to sand.",
      [new Cost(this.science, Decimal(1E3))],
      [this.refineryAnt],
      this
    )

    //    Compost
    this.composterResearch = new Research(
      "compRes",
      "Compost", "Wood can be degraded to fertile soil.",
      [new Cost(this.science, Decimal(1E3))],
      [this.composterAnt],
      this
    )

    //    Experiment
    this.experimentResearch = new Research(
      "experimentRes",
      "Experiment", "Unlock scientist Ant",
      [new Cost(this.science, Decimal(600))],
      [this.scientist],
      this
    )

    //    Prestige
    this.prestigeResearch = new Research(
      "prestigeRes",
      "Travel", "Allow you to move to new worlds",
      [new Cost(this.science, Decimal(1E12))],
      [],
      this
    )

    //    Machinery
    let listM = new Array<Base>()
    listM = listM.concat(this.listMachinery, [this.engineerRes])
    this.machineryRes = new Research(
      "machiRes",
      "Machinery", "Unlock powerfull machinery.",
      [new Cost(this.science, Decimal(1E6))],
      listM,
      this
    )

    //    Special
    this.specialResearch = new Research(
      "speRes",
      "Tecnology", "Allow you to research new technologies.",
      [new Cost(this.science, Decimal(1E3))],
      [this.composterResearch, this.refineryResearch, this.laserResearch, this.hydroResearch,
      this.planterResearch, this.experimentResearch,
      this.machineryRes, this.beeResearch, this.prestigeResearch],
      this
    )

    //    Up Hire
    const allUpH = Array.from(this.unitMap.values()).filter(u => u.upHire).map(u => u.upHire)
    const r4 = new Research(
      "R4",
      "Twin", "Allow you to get more units for the same price.",
      [new Cost(this.science, Decimal(1E4))],
      allUpH,
      this
    )

    //    Up 2
    const allUp = Array.from(this.unitMap.values()).filter(u => u.upAction).map(u => u.upAction)
    allUp.push(r4)
    const r2 = new Research(
      "R2",
      "Teamwork 2", "Upgrade even your unit's production bonus.",
      [new Cost(this.science, Decimal(500))],
      allUp,
      this
    )

    //    Up basic
    this.up1 = new Research(
      "RUp1",
      "Teamwork", "Give a production bonus based on how many times you have bought a unit.",
      [new Cost(this.science, Decimal(50))],
      [r2],
      this
    )

    //    Fungus up
    const r3 = new Research(
      "R3",
      "Fungus experiments", "Allow you to do experiments to increase fungus's food production.",
      [new Cost(this.science, Decimal(1000))],
      [this.fungus.upSpecial], this
    )

    //    Farming
    const r1 = new Research(
      "R1",
      "Ant–fungus symbiosis", "Allow you to cultivate fungus. Fungus is a source of food.",
      [new Cost(this.science, Decimal(100))],
      [this.farmer, r3, this.lumberjack, this.specialResearch], this
    )

    //    Soil
    this.rDirt = new Research(
      "RDirt",
      "Soil", "Allow you to collect soil for future usage.",
      [new Cost(this.science, Decimal(50))],
      [this.soil, this.carpenter, r1, this.up1], this
    )
  }
  initBeach() {
    //    Crab
    const beachList = new Array<Unit>()
    this.crab = new Unit(this, "crab", "Crab", "Crab yield sand.")
    this.crab.actions.push(new BuyAction(this,
      this.crab,
      [new Cost(this.food, Decimal(1E3), this.buyExp)]
    ))
    this.crab.actions.push(new UpAction(this, this.crab,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.crab.actions.push(new UpHire(this, this.crab,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    this.sand.addProductor(new Production(this.crab))

    //    Crab Farmer
    this.crabFarmer = new Unit(this, "crabF", "Farmer Crab", "Farmer Crab yield fungus")
    this.crabFarmer.actions.push(new BuyAction(this,
      this.crabFarmer,
      [
        new Cost(this.food, Decimal(15E3), this.buyExp),
        new Cost(this.crab, Decimal(1), this.buyExpUnit)
      ]
    ))
    this.crabFarmer.actions.push(new UpAction(this, this.crabFarmer,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.crabFarmer.actions.push(new UpHire(this, this.crabFarmer,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    this.fungus.addProductor(new Production(this.crabFarmer))

    //    Crab Queen ?!
    //    Not sure if really exists
    this.crabQueen = new Unit(this, "CrabQ", "Crab Queen", "Crab Queen yield crab")
    this.crabQueen.actions.push(new BuyAction(this,
      this.crabQueen,
      [
        new Cost(this.food, Decimal(1E5), this.buyExp),
        new Cost(this.crab, Decimal(100), this.buyExpUnit)
      ]
    ))
    this.crabQueen.actions.push(new UpAction(this, this.crabQueen,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    this.crabQueen.actions.push(new UpHire(this, this.crabQueen,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))

    this.crab.addProductor(new Production(this.crabQueen))

    //    Shrimp
    this.shrimp = new Unit(this, "shrimp", "Shrimp",
      "Shrimp yield sand and cristal")
    this.shrimp.actions.push(new BuyAction(this,
      this.shrimp,
      [new Cost(this.food, Decimal(3E3), this.buyExp)]
    ))
    this.shrimp.actions.push(new UpAction(this, this.shrimp,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.shrimp.actions.push(new UpHire(this, this.shrimp,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    this.sand.addProductor(new Production(this.shrimp))
    this.cristal.addProductor(new Production(this.shrimp, Decimal(0.5)))

    beachList.push(this.crabQueen)
    beachList.push(this.crab)
    beachList.push(this.crabFarmer)
    beachList.push(this.shrimp)

    //    Research
    this.seaRes = new Research(
      "seaRes",
      "Sea Helpers", "Unlock Sea Helpers",
      [new Cost(this.science, Decimal(30))],
      [this.crab, this.crabFarmer, this.crabQueen, this.shrimp],
      this
    )
    this.seaRes.avabileBaseWorld = false
    this.lists.push(new TypeList("Beach", beachList))
  }
  initInfestation() {
    this.listInfestation = new Array<Unit>()

    this.poisonousPlant = new Unit(this, "poisPlant", "Poisonous Plant",
      "This plant may kill them all.")
    this.poisonousPlant2 = new Unit(this, "poisPlant2", "Old Poisonous Plant",
      "Process poisonus plants!.")
    this.disinfestationAnt = new Unit(this, "defAnt", "Disinfestation Ant",
      "Destroy poisonus plants.")
    this.flametrowerAnt = new Unit(this, "flameAnt", "Flamethrower Ant",
      "Burn poisonus plants.")
    this.weedkiller = new Unit(this, "weedkiller", "Weedkiller",
      "Destroy poisonus plants efficently.")
    this.chemistAnt = new Unit(this, "chemistAnt", "Chemist Ant",
      "Proces weedkiller.")
    this.disinfestationBeetle = new Unit(this, "disinfestationBeetle", "Disinfestation Beetle",
      "Beetle are also good at killing plants.")
    this.flametrowerBeetle = new Unit(this, "flametrowerBeetle", "flametrower Beetle",
      "A beetle with a flametrower.")
    this.chemistBee = new Unit(this, "chemistBee", "Chemist Bee",
      "A chemist bee.")

    this.poisonousPlant2.alwaysOn = true

    this.poisonousPlant.addProductor(new Production(this.poisonousPlant2))
    this.poisonousPlant.addProductor(new Production(this.disinfestationAnt, Decimal(-10)))
    this.poisonousPlant.addProductor(new Production(this.disinfestationBeetle, Decimal(-12)))
    this.poisonousPlant.addProductor(new Production(this.flametrowerBeetle, Decimal(-100)))
    this.poisonousPlant.addProductor(new Production(this.flametrowerAnt, Decimal(-120)))
    this.poisonousPlant.addProductor(new Production(this.flametrowerAnt, Decimal(-5)))
    this.poisonousPlant.addProductor(new Production(this.weedkiller, Decimal(0.01)))
    this.fungus.addProductor(new Production(this.chemistAnt, Decimal(-10)))
    this.soil.addProductor(new Production(this.chemistAnt, Decimal(-10)))
    this.weedkiller.addProductor(new Production(this.chemistAnt, Decimal(1)))

    this.listInfestation.push(this.poisonousPlant)
    this.listInfestation.push(this.poisonousPlant2)
    this.listInfestation.push(this.weedkiller)
    this.listInfestation.push(this.chemistAnt)
    this.listInfestation.push(this.disinfestationAnt)
    this.listInfestation.push(this.flametrowerAnt)
    this.listInfestation.push(this.disinfestationBeetle)
    this.listInfestation.push(this.flametrowerBeetle)
    this.listInfestation.push(this.chemistBee)


    //  Disinfestation
    this.disinfestationAnt.actions.push(new BuyAction(this, this.disinfestationAnt,
      [
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit),
        new Cost(this.food, Decimal(1000), this.buyExp),
        new Cost(this.cristal, Decimal(100), this.buyExp)
      ]
    ))
    this.disinfestationAnt.actions.push(new UpAction(this, this.disinfestationAnt,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.disinfestationAnt.actions.push(new UpHire(this, this.disinfestationAnt,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //  Flametrower
    this.flametrowerAnt.actions.push(new BuyAction(this, this.flametrowerAnt,
      [
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit),
        new Cost(this.food, Decimal(12E3), this.buyExp),
        new Cost(this.wood, Decimal(8E3), this.buyExp),
        new Cost(this.cristal, Decimal(4E3), this.buyExp)
      ]
    ))
    this.flametrowerAnt.actions.push(new UpAction(this, this.flametrowerAnt,
      [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))
    this.flametrowerAnt.actions.push(new UpHire(this, this.flametrowerAnt,
      [new Cost(this.science, this.scienceCost3, this.upgradeScienceExp)]))

    //  Chemist
    this.chemistAnt.actions.push(new BuyAction(this, this.chemistAnt,
      [
        new Cost(this.littleAnt, Decimal(1), this.buyExpUnit),
        new Cost(this.food, Decimal(12E3), this.buyExp),
        new Cost(this.fungus, Decimal(1E5), this.buyExp),
        new Cost(this.soil, Decimal(6E4), this.buyExp)
      ]
    ))
    this.chemistAnt.actions.push(new UpAction(this, this.chemistAnt,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))
    this.chemistAnt.actions.push(new UpHire(this, this.chemistAnt,
      [new Cost(this.science, this.scienceCost4, this.upgradeScienceExp)]))

    //    Beetle
    this.disinfestationBeetle.actions.push(new BuyAction(this,
      this.disinfestationBeetle,
      [
        new Cost(this.larva, Decimal(1), this.buyExpUnit),
        new Cost(this.wood, Decimal(300), this.buyExp),
        new Cost(this.food, Decimal(3000), this.buyExp)
      ]
    ))
    this.disinfestationBeetle.actions.push(new UpAction(this,
      this.disinfestationBeetle, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.disinfestationBeetle.actions.push(new UpHire(this,
      this.disinfestationBeetle, [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.disinfestationBeetle.avabileBaseWorld = false

    //  Flametrower  Beetle
    this.flametrowerBeetle.actions.push(new BuyAction(this,
      this.flametrowerBeetle,
      [
        new Cost(this.larva, Decimal(1), this.buyExp),
        new Cost(this.wood, Decimal(15E3), this.buyExp),
        new Cost(this.food, Decimal(5E3), this.buyExp),
        new Cost(this.soil, Decimal(6E4), this.buyExp)
      ]
    ))
    this.flametrowerBeetle.actions.push(new UpAction(this, this.flametrowerBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))
    this.flametrowerBeetle.actions.push(new UpHire(this, this.flametrowerBeetle,
      [new Cost(this.science, this.scienceCost2, this.upgradeScienceExp)]))

    //    Weedkiller
    this.weedkillerRes = new Research(
      "weedkillerRes",
      "Weedkiller", "Weedkiller.",
      [new Cost(this.science, Decimal(1E4))],
      [this.weedkiller, this.chemistAnt],
      this
    )

    //    Flame
    this.flametrowerRes = new Research(
      "flametrowerRes",
      "Flametrower", "Burn poisonus plants.",
      [new Cost(this.science, Decimal(1E3))],
      [this.flametrowerAnt, this.flametrowerBeetle],
      this
    )

    //    Disinfestation
    this.basicDisinfestationRes = new Research(
      "basicDisinfestationRes",
      "Disinfestation", "Unlock basic bisinfestation units.",
      [new Cost(this.science, Decimal(100))],
      [
        this.disinfestationAnt, this.disinfestationBeetle,
        this.flametrowerRes, this.weedkillerRes
      ],
      this
    )
    this.basicDisinfestationRes.avabileBaseWorld = false

  }
  generatePrestige() {
    const expIncrement = Decimal(1.3)

    this.experience = new Unit(this, "exp", "Experience", "Experience", true)
    this.expLists = new Array<TypeList>()
    this.expAnt = new Array<Unit>()

    //    Ant food
    this.pAntPower = new Unit(this, "pap", "Ant Power", "Ant yeld 100% more Food.", true)
    this.allPrestigeUp.push(this.pAntPower)
    this.pAntPower.actions.push(new BuyAction(this, this.pAntPower,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expAnt.push(this.pAntPower)
    this.littleAnt.prestigeBonusProduction.push(this.pAntPower)

    //    Ant fungus
    this.pAntFungus = new Unit(this, "paf", "Farmer Power", "Farmer yeld 100% more Fungus.", true)
    this.allPrestigeUp.push(this.pAntFungus)
    this.pAntFungus.actions.push(new BuyAction(this, this.pAntFungus,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expAnt.push(this.pAntFungus)
    this.farmer.prestigeBonusProduction.push(this.pAntFungus)

    //    Ant in next world
    this.pAntNext = new Unit(this, "pan", "Ant follower",
      "Start new worlds with 5 more ants.", true)
    this.pGeologistNext = new Unit(this, "pgn", "Geologist follower",
      "Start new worlds with 5 more geologist.", true)
    this.pScientistNext = new Unit(this, "psn", "Scientist follower",
      "Start new worlds with 5 more scientist.", true)
    this.pFarmerNext = new Unit(this, "pfn", "Farmer follower",
      "Start new worlds with 5 more farmer.", true)

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

    //    Tecnology
    this.expTech = new Array<Unit>()
    this.pComposter = new Unit(this, "pComposter", "Compost",
      "Composter units are 100% better.", true)
    this.pRefinery = new Unit(this, "pRefinery", "Refinery",
      "Refinery units are 100% better.", true)
    this.pLaser = new Unit(this, "pLaser", "Laser",
      "Laser units are 100% better.", true)
    this.pHydro = new Unit(this, "pHydro", "Hydroponics",
      "Hydroponics units are 100% better.", true)
    this.pPlanter = new Unit(this, "pPlanter", "Planting",
      "Planting units are 100% better.", true)

    this.expTech.push(this.pComposter)
    this.expTech.push(this.pRefinery)
    this.expTech.push(this.pLaser)
    this.expTech.push(this.pHydro)
    this.expTech.push(this.pPlanter)

    this.expTech.forEach(p => {
      p.actions.push(new BuyAction(this, p,
        [new Cost(this.experience, Decimal(10), expIncrement)]))
    })
    this.expLists.push(new TypeList("Tecnology", this.expTech))

    this.composterStation.prestigeBonusProduction.push(this.pComposter)
    this.composterAnt.prestigeBonusProduction.push(this.pComposter)

    this.refineryStation.prestigeBonusProduction.push(this.pRefinery)
    this.refineryAnt.prestigeBonusProduction.push(this.pRefinery)

    this.laserStation.prestigeBonusProduction.push(this.pLaser)
    this.hydroAnt.prestigeBonusProduction.push(this.pLaser)

    this.hydroFarm.prestigeBonusProduction.push(this.pHydro)
    this.hydroAnt.prestigeBonusProduction.push(this.pHydro)

    this.plantingMachine.prestigeBonusProduction.push(this.pPlanter)
    this.planterAnt.prestigeBonusProduction.push(this.pPlanter)

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

    this.food.quantity = Decimal(1E20)

    this.listMaterial.forEach(m => m.quantity = Decimal(1E20))
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

    if (this.isChanged) {
      this.reloadProduction()
      this.isChanged = false
    }

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
    if (remaning > Number.EPSILON) {
      this.isChanged = true
      this.longUpdate(remaning)
    }
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
    save.list = Array.from(this.unitMap.entries())
      .filter(u => u[1].unlocked)
      .map(v => v[1].getData())
    save.last = Date.now()
    save.cur = this.currentEarning
    save.life = this.lifeEarning
    save.w = this.world.getData()
    save.nw = this.nextWorlds.map(w => w.getData())
    save.pre = this.allPrestigeUp.map(p => p.getData())
    save.res = this.resList.filter(res => res.owned()).map(r => r.getData())
    save.pd = this.prestigeDone
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
      console.log(saveRaw)
      this.currentEarning = Decimal(save.cur)
      this.lifeEarning = Decimal(save.life)
      this.world.restore(save.w)

      for (const s of save.list) {
        const unit = this.unitMap.get(s.id)
        if (unit)
          unit.restore(s)
      }

      this.nextWorlds[0].restore(save.nw[0])
      this.nextWorlds[1].restore(save.nw[1])
      this.nextWorlds[2].restore(save.nw[2])

      for (const s of save.pre) {
        const up = this.allPrestigeUp.find(p => p.id === s.id)
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

      this.reloadProduction()
      return save.last
    }
    return null
  }

  reloadProduction() {
    this.all.forEach(u => u.loadProduction())
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
