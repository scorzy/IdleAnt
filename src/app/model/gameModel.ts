import { World } from './world';
import { DefaultUrlHandlingStrategy } from '@angular/router/src/url_handling_strategy';
import { Utils } from './utils';
import { Base, Type } from './units/base';
import { Cost } from './cost';
import { Alert, alertArray, IAlert } from './alert';
import { PrestigeList, TypeList } from './typeList';
import { Action, BuyAction, BuyAndUnlockAction, Research, UpAction, UpEfficiency, UpHire, UpSpecial } from './units/action';
import { Production } from './production';
import { Map } from 'rxjs/util/Map';
import { Data } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { isAsciiLetter } from 'codelyzer/angular/styles/chars';
import { Logger } from 'protractor/built/logger'
import * as decimal from 'decimal.js';
import { Unit } from './units/unit'
import { Component, Injectable, Input } from '@angular/core'
import * as LZString from 'lz-string';
import * as strings from './strings';

export class GameModel {

    //    Materials
    food: Unit
    cristal: Unit
    soil: Unit
    science: Unit
    fungus: Unit
    wood: Unit
    sand: Unit
    listMaterial = Array<Unit>()

    //    Jobs
    geologist: Unit
    scientist: Unit
    farmer: Unit
    carpenter: Unit
    lumberjack: Unit
    level1 = Array<Unit>()

    //    Special Ants
    composterAnt: Unit
    refineryAnt: Unit
    laserAnt: Unit

    jobMaterial: Unit[][]

    listJobs = Array<Unit>()

    //    Generators
    littleAnt: Unit
    maxAnt: Unit
    list = Array<Unit>()

    //    Machinery
    mine: Unit
    laserStation: Unit
    sandDigger: Unit
    hydroFarm: Unit
    loggingMachine: Unit
    caterpillar: Unit
    listMachinery = new Array<Unit>()

    //    Research
    up1: Research
    upEfficiency: Research
    rDirt: Research
    resList = Array<Research>()
    specialResearch: Research
    othersResearch: Research

    //    Bee
    nectar: Unit
    honey: Unit
    foragingBee: Unit
    workerBee: Unit
    queenBee: Unit
    hiveBee: Unit
    listBee = new Array<Unit>()

    unitMap: Map<string, Unit> = new Map()
    all: Array<Unit>
    allBase: Array<Base>
    lists = new Array<TypeList>()

    baseUpPrice = Decimal(1.01)

    @Input()
    public alert: IAlert

    //    Prestige
    currentEarning = Decimal(0)
    lifeEarning = Decimal(0)
    world: World
    nextWorlds: World[]
    experience: Unit

    expLists = new Array<TypeList>()
    expAnt = new Array<Unit>()
    allPrestigeUp = new Array<Unit>()

    pAntPower: Unit
    pAntFungus: Unit
    pAntNext: Unit


    //    Special World Units
    crab: Unit
    crabFarmer: Unit
    crabQueen: Unit
    shrimp: Unit
    seaRes: Research

    constructor() {
        this.initialize()
    }

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
        this.prodJobs()

        this.initBee()
        this.initMachinery()

        //    Fungus
        this.fungus.actions.push(new UpSpecial(this, this.fungus))

        //    liste
        this.lists.push(new TypeList("Material", this.listMaterial))
        this.lists.push(new TypeList("Jobs", this.listJobs))
        this.lists.push(new TypeList("Ants", this.list))
        this.lists.push(new TypeList("Bee", this.listBee))
        this.lists.push(new TypeList("Machinery", this.listMachinery))

        this.initResearchs()
        this.initWorld()

        this.all = Array.from(this.unitMap.values()).filter(u => !u.prestige)
        this.alert = alertArray[0]

        this.world = World.getBaseWorld(this)

        World.initialize(this)
        this.generateRandomWorld()
        this.generatePrestige()

        this.list = this.list.reverse()
        this.setInitialStat()
    }

    initMaterials() {
        //    Material
        this.food = new Unit(this, "food")
        this.food.name = "food"
        this.food.description = "food"
        this.food.unlocked = true
        this.food.btType = "danger"
        this.food.types = [Type.Material]
        this.listMaterial.push(this.food)

        this.cristal = new Unit(this, "cri")
        this.cristal.name = "Cristal"
        this.cristal.description = "Cristals are needed to get science"
        this.cristal.btType = "info"
        this.cristal.types = [Type.Material]
        this.listMaterial.push(this.cristal)

        this.soil = new Unit(this, "soil")
        this.soil.name = "Soil"
        this.soil.description = "Soil is used to make nests"
        this.soil.btType = "warning"
        this.soil.types = [Type.Material]
        this.listMaterial.push(this.soil)

        this.science = new Unit(this, "sci")
        this.science.name = "Science"
        this.science.description = "Science is used to improve stuff"
        this.science.types = [Type.Material]
        this.listMaterial.push(this.science)

        this.fungus = new Unit(this, "fun")
        this.fungus.name = "Fungus"
        this.fungus.description = "Fungus yeld food"
        this.fungus.btType = "success"
        this.fungus.types = [Type.Material]
        this.listMaterial.push(this.fungus)

        this.wood = new Unit(this, "wood")
        this.wood.name = "Wood"
        this.wood.description = "Wood"
        this.wood.types = [Type.Material]
        this.listMaterial.push(this.wood)

        this.sand = new Unit(this, "sand", "Sand", "Sand")
        this.sand.types = [Type.Material]
        this.listMaterial.push(this.sand)

        this.nectar = new Unit(this, "nectar", "Nectar", "Nectar")
        this.nectar.types = [Type.Material]
        this.listMaterial.push(this.nectar)

        this.honey = new Unit(this, "honey", "Honey", "Honey")
        this.honey.types = [Type.Material]
        this.listMaterial.push(this.honey)

    }
    initGenerators() {
        //    Generators 
        let current: Unit
        let last: Unit
        for (let i = 1; i < strings.genNames.length; i++) {
            current = new Unit(this, "G" + i)
            current.name = strings.genNames[i - 1][0]
            current.description = strings.genNames[i - 1][1]
            current.types = [Type.Ant]
            this.list.push(current)
        }
        this.littleAnt = this.list[0]
        this.littleAnt.types = [Type.Ant]
        this.littleAnt.unlocked = true
        this.maxAnt = this.list[this.list.length - 1]
    }
    initJobs() {
        //    Jobs 1
        this.geologist = new Unit(this, "geo")
        this.geologist.name = "Geologist"
        this.geologist.description = "Geologist yeld cristal"
        this.geologist.types = [Type.Ant]
        this.listJobs.push(this.geologist)

        this.scientist = new Unit(this, "scn")
        this.scientist.name = "Scientist"
        this.scientist.description = "Scientist yeld science"
        this.scientist.types = [Type.Ant]
        this.listJobs.push(this.scientist)

        this.carpenter = new Unit(this, "car")
        this.carpenter.name = "carpenter"
        this.carpenter.description = "carpenters yeld soil"
        this.carpenter.types = [Type.Ant]
        this.listJobs.push(this.carpenter)

        this.farmer = new Unit(this, "far")
        this.farmer.name = "farmer"
        this.farmer.description = "farmer yeld fungus"
        this.farmer.types = [Type.Ant]
        this.listJobs.push(this.farmer)

        this.lumberjack = new Unit(this, "lum")
        this.lumberjack.name = "Lumberjack"
        this.lumberjack.description = "Lumberjack yeld food"
        this.lumberjack.types = [Type.Ant]
        this.listJobs.push(this.lumberjack)

        this.level1 = [this.geologist, this.scientist, this.farmer, this.carpenter, this.lumberjack]

        //
        //    Special
        //
        this.composterAnt = new Unit(this, "com", "Composter Ant", "Transform fungus into soil")
        this.composterAnt.types = [Type.Ant]
        this.listJobs.push(this.composterAnt)
        this.composterAnt.actions.push(new BuyAction(this,
            this.composterAnt,
            [
                new Cost(this.food, Decimal(1), Decimal(1.01)),
                new Cost(this.littleAnt, Decimal(1), Decimal(1.01))
            ]
        ))
        this.soil.addProductor(new Production(this.composterAnt))
        this.fungus.addProductor(new Production(this.composterAnt, Decimal(-5)))


        this.refineryAnt = new Unit(this, "ref", "Refinery Ant", "Transform soil into sand")
        this.refineryAnt.types = [Type.Ant]
        this.listJobs.push(this.refineryAnt)
        this.refineryAnt.actions.push(new BuyAction(this,
            this.refineryAnt,
            [
                new Cost(this.food, Decimal(1), Decimal(1.01)),
                new Cost(this.littleAnt, Decimal(1), Decimal(1.01))
            ]
        ))
        this.sand.addProductor(new Production(this.refineryAnt))
        this.soil.addProductor(new Production(this.refineryAnt, Decimal(-5)))


        this.laserAnt = new Unit(this, "las", "Laser Ant", "Transform sand into cristal")
        this.laserAnt.types = [Type.Ant]
        this.listJobs.push(this.laserAnt)
        this.laserAnt.actions.push(new BuyAction(this,
            this.laserAnt,
            [
                new Cost(this.food, Decimal(1), Decimal(1.01)),
                new Cost(this.littleAnt, Decimal(1), Decimal(1.01))
            ]
        ))
        this.cristal.addProductor(new Production(this.laserAnt))
        this.sand.addProductor(new Production(this.laserAnt, Decimal(-5)))

        const consumer = [this.composterAnt, this.refineryAnt, this.laserAnt]
        consumer.forEach(l =>
            l.actions.push(new UpEfficiency(this, l, [new Cost(this.science, Decimal(1), Decimal(10))])))

        this.level1.push(this.composterAnt, this.refineryAnt, this.laserAnt)
    }
    prodGenerators() {
        //    Generators
        const genBaseCost = Decimal(10)

        this.list[0].actions.push(new BuyAndUnlockAction(this,
            this.list[0],
            [new Cost(
                this.food,
                Decimal.pow(genBaseCost, 2).div(10),
                Decimal(this.baseUpPrice))],
            [this.list[1]]
        ))

        for (let i = 1; i < this.list.length; i++) {
            let toUnlock = Array<Unit>()
            if (i + 1 < this.list.length)
                toUnlock.push(this.list[i + 1])
            if (this.list[i].id == "G2")
                toUnlock.push(this.geologist)

            this.list[i].actions.push(new BuyAndUnlockAction(this,
                this.list[i],
                [
                    new Cost(
                        this.food,
                        Decimal.pow(genBaseCost, 2 * (1 + i)).div(10),
                        Decimal(this.baseUpPrice)),
                    new Cost(
                        this.list[i - 1],
                        Decimal.pow(10, i),
                        Decimal(this.baseUpPrice)
                    )
                ],
                toUnlock
            ))
            if (i > 1)
                this.list[i].buyAction.priceF.push(new Cost(
                    this.fungus,
                    Decimal.pow(genBaseCost, 2 * (1 + i)).div(100),
                    Decimal(this.baseUpPrice)))
            if (i > 2)
                this.list[i].buyAction.priceF.push(new Cost(
                    this.soil,
                    Decimal.pow(genBaseCost, 2 * (1 + i)).div(1000),
                    Decimal(this.baseUpPrice)))
            if (i > 3)
                this.list[i].buyAction.priceF.push(new Cost(
                    this.wood,
                    Decimal.pow(genBaseCost, 2 * (1 + i)).div(10000),
                    Decimal(this.baseUpPrice)))
            if (i > 4)
                this.list[i].buyAction.priceF.push(new Cost(
                    this.cristal,
                    Decimal.pow(genBaseCost, 2 * (1 + i)).div(100000),
                    Decimal(this.baseUpPrice)))
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
    prodJobs() {
        //    Prices && Production
        this.food.addProductor(new Production(this.littleAnt))
        this.food.addProductor(new Production(this.fungus))

        this.fungus.addProductor(new Production(this.farmer))
        this.cristal.addProductor(new Production(this.geologist))
        this.science.addProductor(new Production(this.scientist))
        this.soil.addProductor(new Production(this.carpenter))
        this.wood.addProductor(new Production(this.lumberjack))

        //    Geologist
        this.geologist.actions.push(new BuyAndUnlockAction(this,
            this.geologist,
            [
                new Cost(this.food, Decimal(1000), Decimal(1.01)),
                new Cost(this.littleAnt, Decimal(10), Decimal(1.01))
            ],
            [this.cristal, this.scientist]
        ))

        //    Scientist
        this.scientist.actions.push(new BuyAndUnlockAction(this,
            this.scientist,
            [
                new Cost(this.food, Decimal(1000), Decimal(this.baseUpPrice)),
                new Cost(this.cristal, Decimal(1), Decimal(this.baseUpPrice)),
                new Cost(this.littleAnt, Decimal(10), Decimal(this.baseUpPrice))
            ],
            [this.science]
        ))

        //    Carpenter
        this.carpenter.actions.push(new BuyAndUnlockAction(this,
            this.carpenter,
            [
                new Cost(this.food, Decimal(1000), Decimal(this.baseUpPrice)),
                new Cost(this.littleAnt, Decimal(10), Decimal(this.baseUpPrice))
            ],
            [this.science]
        ))

        //    Lumberjack
        this.lumberjack.actions.push(new BuyAndUnlockAction(this,
            this.lumberjack,
            [
                new Cost(this.food, Decimal(1000), Decimal(this.baseUpPrice)),
                new Cost(this.littleAnt, Decimal(10), Decimal(this.baseUpPrice))
            ],
            [this.wood]
        ))

        //    Farmer
        this.farmer.actions.push(new BuyAndUnlockAction(this,
            this.farmer,
            [
                new Cost(this.littleAnt, Decimal(10), Decimal(this.baseUpPrice)),
                new Cost(this.food, Decimal(50), Decimal(this.baseUpPrice)),
                new Cost(this.soil, Decimal(100), Decimal(this.baseUpPrice))
            ],
            [this.fungus]
        ))

        this.level1.forEach(l => {
            l.actions.push(new UpAction(this, l, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
            l.actions.push(new UpHire(this, l, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
        })


    }

    initBee() {

        this.foragingBee = new Unit(this, "forBee", "Foraging Bee", "Get nectar")
        this.foragingBee.types = [Type.Bee]
        this.listBee.push(this.foragingBee)
        this.foragingBee.actions.push(new BuyAction(this,
            this.foragingBee,
            [new Cost(this.food, Decimal(1), Decimal(1.01))]
        ))
        this.nectar.addProductor(new Production(this.foragingBee))
        this.foragingBee.actions.push(new UpAction(this, this.foragingBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
        this.foragingBee.actions.push(new UpHire(this, this.foragingBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))

        this.queenBee = new Unit(this, "qBee", "Queen Bee", "Yeld Foraging Bee")
        this.queenBee.types = [Type.Bee]
        this.hiveBee = new Unit(this, "hBee", "Hive Bee", "Yeld Queen")
        this.hiveBee.types = [Type.Bee]

        this.workerBee = new Unit(this, "worBee", "Worker Bee", "Convert nectar to honey")
        this.workerBee.types = [Type.Bee]
        this.listBee.push(this.workerBee)
        this.workerBee.actions.push(new BuyAndUnlockAction(this,
            this.workerBee,
            [
                new Cost(this.food, Decimal(1), Decimal(1.01)),
                new Cost(this.foragingBee, Decimal(1), Decimal(1.01))
            ], [this.queenBee]
        ))
        this.nectar.addProductor(new Production(this.workerBee, Decimal(-2)))
        this.honey.addProductor(new Production(this.workerBee, Decimal(1)))
        this.workerBee.actions.push(new UpAction(this, this.workerBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
        this.workerBee.actions.push(new UpHire(this, this.workerBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))

        this.listBee.push(this.queenBee)
        this.queenBee.actions.push(new BuyAndUnlockAction(this,
            this.queenBee,
            [
                new Cost(this.food, Decimal(1), Decimal(1.01)),
                new Cost(this.foragingBee, Decimal(1), Decimal(1.01)),
                new Cost(this.honey, Decimal(1), Decimal(1.01)),
            ], [this.hiveBee]
        ))
        this.foragingBee.addProductor(new Production(this.queenBee))

        this.listBee.push(this.hiveBee)
        this.hiveBee.actions.push(new BuyAction(this,
            this.hiveBee,
            [
                new Cost(this.food, Decimal(1), Decimal(1.01)),
                new Cost(this.queenBee, Decimal(1), Decimal(1.01)),
                new Cost(this.honey, Decimal(1), Decimal(1.01)),
            ]
        ))
        this.queenBee.addProductor(new Production(this.hiveBee))

        this.queenBee.actions.push(new UpAction(this, this.queenBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
        this.queenBee.actions.push(new UpHire(this, this.queenBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))

        this.hiveBee.actions.push(new UpAction(this, this.hiveBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
        this.hiveBee.actions.push(new UpHire(this, this.hiveBee, [new Cost(this.science, Decimal(1E3), Decimal(10))]))
    }

    initMachinery() {

        this.listMachinery = new Array<Unit>()

        //    Laser
        this.laserStation = new Unit(this, "laserStation", "Laser Station", "Yeld cristal")
        this.laserStation.types = [Type.Machinery]
        this.laserStation.actions.push(new BuyAction(this,
            this.laserStation,
            [
                new Cost(this.wood, Decimal(1E6), Decimal(1.01)),
                new Cost(this.cristal, Decimal(1E6), Decimal(1.01))
            ]
        ))
        this.cristal.addProductor(new Production(this.laserStation, Decimal(1E3)))
        this.sand.addProductor(new Production(this.laserStation, Decimal(-5E2)))
        this.listMachinery.push(this.laserStation)

        //    Hydroponic Farm
        this.hydroFarm = new Unit(this, "hydroFarm", "Hydroponic Farm", "Yeld fungus")
        this.hydroFarm.types = [Type.Machinery]
        this.hydroFarm.actions.push(new BuyAction(this,
            this.hydroFarm,
            [
                new Cost(this.wood, Decimal(5E5), Decimal(1.01)),
                new Cost(this.cristal, Decimal(1E6), Decimal(1.01)),
                new Cost(this.fungus, Decimal(1E5), Decimal(1.01))
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
                new Cost(this.wood, Decimal(5E5), Decimal(1.01)),
                new Cost(this.cristal, Decimal(1E6), Decimal(1.01)),
                new Cost(this.soil, Decimal(1E5), Decimal(1.01))
            ]
        ))
        this.wood.addProductor(new Production(this.caterpillar, Decimal(1E3)))
        this.listMachinery.push(this.caterpillar)


        //    Not always avaiable

        //    Sand digger
        this.sandDigger = new Unit(this, "sandDigger", "Sand Digger", "Yeld sand")
        this.sandDigger.avabileBaseWorld = false
        this.sandDigger.types = [Type.Machinery]
        this.sandDigger.actions.push(new BuyAction(this,
            this.sandDigger,
            [new Cost(this.wood, Decimal(1E6), Decimal(1.01))]
        ))
        this.cristal.addProductor(new Production(this.sandDigger, Decimal(1E3)))
        this.listMachinery.push(this.sandDigger)

        //    Hydroponic Farm
        this.loggingMachine = new Unit(this, "loggingMachine", "Logging Machine", "Yeld wood")
        this.loggingMachine.avabileBaseWorld = false
        this.loggingMachine.types = [Type.Machinery]
        this.loggingMachine.actions.push(new BuyAction(this,
            this.loggingMachine,
            [
                new Cost(this.wood, Decimal(5E5), Decimal(1.01)),
                new Cost(this.cristal, Decimal(1E6), Decimal(1.01)),
                new Cost(this.soil, Decimal(1E5), Decimal(1.01))
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
            [new Cost(this.wood, Decimal(1E6), Decimal(1.01))]
        ))
        this.cristal.addProductor(new Production(this.mine, Decimal(1E3)))
        this.listMachinery.push(this.mine)

    }

    initResearchs() {

        //    Machinery
        const machineryRes = new Research(
            "machiRes",
            "Machinery", "Unlock powerfull machinery",
            [new Cost(this.science, Decimal(1))],
            this.listMachinery,
            this
        )

        //    Bee
        const beeResearch = new Research(
            "beeRes",
            "Bee", "Unlock Bee !",
            [new Cost(this.science, Decimal(1))],
            [this.nectar, this.foragingBee, this.workerBee, this.honey],
            this
        )

        //    Others
        this.othersResearch = new Research(
            "otherRes",
            "Other Helers", "Unlock friendly units",
            [new Cost(this.science, Decimal(1))],
            [beeResearch],
            this
        )

        //    Compost
        const laserResearch = new Research(
            "lasRes",
            "Laser", "Unlock laser Ant",
            [new Cost(this.science, Decimal(1))],
            [this.laserAnt],
            this
        )

        //    Refinery
        const refineryResearch = new Research(
            "refRes",
            "Refinery", "Unlock refinery Ant",
            [new Cost(this.science, Decimal(1))],
            [this.refineryAnt],
            this
        )

        //    Compost
        const composterResearch = new Research(
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
            [composterResearch, refineryResearch, laserResearch, 
                this.othersResearch, this.upEfficiency, machineryRes],
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

        //    Up
        const allUp = Array.from(this.unitMap.values()).filter(u => u.upAction).map(u => u.upAction)
        allUp.push(r4)
        const r2 = new Research(
            "R2",
            "Upgrade", "Up desc",
            [new Cost(this.science, Decimal(1))],
            allUp,
            this
        )

        //    Up up
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
            [this.farmer, r3, this.lumberjack, this.specialResearch], this
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

        //        shrimp
        this.shrimp = new Unit(this, "shrimp", "Shrimp", "Shrimp yeld sand and cristal")
        this.shrimp.actions.push(new BuyAction(this,
            this.shrimp,
            [new Cost(this.food, Decimal(1), Decimal(1.01))]
        ))
        this.shrimp.actions.push(new UpAction(this, this.crab,
            [new Cost(this.science, Decimal(1E3), Decimal(10))]))
        this.shrimp.actions.push(new UpHire(this, this.crab,
            [new Cost(this.science, Decimal(1E3), Decimal(10))]))

        beachList.push(this.shrimp)
        this.sand.addProductor(new Production(this.shrimp))
        this.cristal.addProductor(new Production(this.shrimp, Decimal(0.1)))

        //        research
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
        this.experience = new Unit(this, "exp", "Experience", "Experience", true)
        this.expLists = new Array<TypeList>()
        this.expAnt = new Array<Unit>()

        //    Ant food
        this.pAntPower = new Unit(this, "pap", "Ant Power", "Ant yeld 100% more Food", true)
        this.allPrestigeUp.push(this.pAntPower)
        this.pAntPower.unlocked = true
        this.pAntPower.actions.push(new BuyAction(this, this.pAntPower,
            [new Cost(this.experience, Decimal(1), Decimal(10))]))
        this.expAnt.push(this.pAntPower)
        this.littleAnt.prestigeBonusProduction.push(this.pAntPower)

        //    Ant fungus
        this.pAntFungus = new Unit(this, "paf", "Ant Fungus", "Farmer yeld 100% more Fungus", true)
        this.allPrestigeUp.push(this.pAntFungus)
        this.pAntFungus.unlocked = true
        this.pAntFungus.actions.push(new BuyAction(this, this.pAntFungus,
            [new Cost(this.experience, Decimal(1), Decimal(10))]))
        this.expAnt.push(this.pAntFungus)
        this.farmer.prestigeBonusProduction.push(this.pAntFungus)

        //    Ant in next world
        this.pAntNext = new Unit(this, "pan", "Ant Next", "Ant Next", true)
        this.allPrestigeUp.push(this.pAntNext)
        this.pAntNext.unlocked = true
        this.pAntNext.actions.push(new BuyAction(this, this.pAntNext,
            [new Cost(this.experience, Decimal(1), Decimal(10))]))
        this.expAnt.push(this.pAntNext)
        this.littleAnt.prestigeBonusStart = [this.pAntNext]

        this.expLists.push(new TypeList("Ant", this.expAnt))

    }

    setInitialStat() {
        this.all.forEach(u => {
            u.initialize()
            u.actions.forEach(a => a.initialize())
        })
        this.resList.forEach(r => r.initialize())
        this.food.unlocked = true
        this.food.quantity = Decimal(5E5)
        this.littleAnt.unlocked = true
        this.rDirt.unlocked = true
    }

    getProduction(prod: Production,
        level: decimal.Decimal,
        factorial: decimal.Decimal,
        fraction: decimal.Decimal
    ): decimal.Decimal {

        let ret = Decimal.pow(fraction, level)                  //    exponential            
            .times(prod.unit.quantity)                          //    time
            .times(prod.getprodPerSec())                        //    efficenty
            .div(factorial)

        const prod2 = prod.unit.producedBy.filter(p => p.unit.quantity.greaterThan(Decimal(0)))
        for (const p2 of prod2)
            ret = ret.plus(
                this.getProduction(p2, level.plus(1),
                    factorial.times(level.plus(1)),
                    fraction)
            )
        return ret
    }

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
            let d = res.quantity

            for (const prod1 of res.producedBy) {
                // x
                c = c.plus(prod1.getprodPerSec().times(prod1.unit.quantity))
                for (const prod2 of prod1.unit.producedBy) {
                    // x^2
                    b = b.plus(prod2.getprodPerSec().times(prod2.unit.quantity))
                    for (const prod3 of prod2.unit.producedBy) {
                        // x^3
                        a = a.plus(prod3.getprodPerSec().times(prod3.unit.quantity))
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

    postUpdate() {
        this.all.filter(u => u.quantity.lessThan(Number.EPSILON)).forEach(u => u.quantity = Decimal(0))
    }

    update(dif: number) {
        const fraction = Decimal(dif / 1000)
        const all = Array.from(this.unitMap.values())
        for (const res of all)
            for (const prod of res.producedBy)
                res.toAdd = res.toAdd.plus(this.getProduction(prod, Decimal(1), Decimal(1), fraction))

        all.forEach(u => {
            u.quantity = u.quantity.plus(u.toAdd)
            u.toAdd = Decimal(0)
        })

        if (this.cristal.quantity.greaterThanOrEqualTo(10))
            this.scientist.unlocked = true

    }

    unlockUnits(units: Base[], message: string = null) {
        return () => {
            let string = ""
            let ok = false
            units.filter(u => !u.unlocked && u.avabileThisWorld).forEach(u => {
                u.unlocked = true
                string += " " + u.name
                ok = true
            })
            if (ok)
                this.alert = new Alert("info", message ? message : "unlocked:" + string)

            //console.log(string)
            this.all.filter(u => u.unlocked).forEach(u2 => u2.produces.forEach(p =>
                p.productor.unlocked = p.productor.avabileThisWorld))
            return ok
        }
    }

    generateRandomWorld() {
        this.nextWorlds = [
            World.getRandomWorld(this),
            World.getRandomWorld(this),
            World.getRandomWorld(this)
        ]
    }

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
        return LZString.compressToUTF16(JSON.stringify(save))

    }

    load(saveRaw: string): number {
        if (saveRaw) {
            saveRaw = LZString.decompressFromUTF16(saveRaw)
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
                this.allPrestigeUp.find(p => p.id == s.id).restore(s)

            for (const s of save.res)
                this.resList.find(p => p.id == s.id).restore(s)

            return save.last

        }
        return null
    }

    getCost(data: any): Cost {
        return new Cost(this.all.find(u => u.id == data.u), Decimal(data.b), Decimal(data.g))
    }

    getExperience(): decimal.Decimal {
        return this.currentEarning.div(10E1).pow(1 / 3).times(this.world.expMulti)
    }

    getUnits(types: Type[]): Unit[] {
        return this.all.filter(u => {
            let yes = true
            types.forEach(t => yes = yes && u.types.includes(t))
            return yes
        })
    }

}