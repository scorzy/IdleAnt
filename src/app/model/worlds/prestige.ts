import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, Research, TimeWarp, UpAction, UpHire, UpSpecial, Resupply } from '../units/action';
import { Base } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Prestige implements WorldInterface {

  experience: Unit

  expLists = new Array<TypeList>()
  expAnt = new Array<Unit>()
  expFollower = new Array<Unit>()
  expMachinery = new Array<Unit>()
  expTech = new Array<Unit>()
  allPrestigeUp = new Array<Unit>()

  //  Ant Follower
  pAntPower: Unit
  pAntGeo: Unit
  pAntHunter1: Unit
  pAntHunter2: Unit
  pAntFungus: Unit
  pAntLum: Unit

  //  Ant Power
  pAntNext: Unit
  pGeologistNext: Unit
  pScientistNext: Unit
  pFarmerNext: Unit
  pCarpenterNext: Unit
  pLumberjackNext: Unit

  //    Prestige Machinery
  pMachineryPower: Unit

  //    Prestige Technology
  pComposter: Unit
  pRefinery: Unit
  pLaser: Unit
  pHydro: Unit
  pPlanter: Unit

  //  Supply
  supplyList: Array<Unit>

  //  Efficiency
  effList = new Array<Unit>()
  effListEng = new Array<Unit>()
  effListDep = new Array<Unit>()

  //  Time
  timeList = new Array<Unit>()
  time: Unit
  timeMaker: Unit
  timeBank: Unit

  constructor(public game: GameModel) { }


  public declareStuff() {

  }

  public initStuff() {
    const expIncrement = new Decimal(1.3)

    this.experience = new Unit(this.game, "exp", "Exp",
      "Experience. Experience upgrade do not reset when changing worlds.", true)
    this.expLists = new Array<TypeList>()
    this.expAnt = new Array<Unit>()

    //#region Ants Power
    this.pAntPower = new Unit(this.game, "pap", "Ant Power",
      "Ants yield 30% more food.", true)
    this.pAntGeo = new Unit(this.game, "pAntGeo", "Geologist Power",
      "Geologists yield 30% more crystal.", true)
    this.pAntHunter1 = new Unit(this.game, "phunt1", "Hunter Power",
      "Hunters yield and consume 30% more resources.", true)
    this.pAntHunter2 = new Unit(this.game, "phunt2", "Advanced Hunter",
      "Advanced Hunters yield and consume 30% more resources.", true)
    this.pAntFungus = new Unit(this.game, "paf", "Farmer Power",
      "Farmers yield and consume 30% more resources", true)

    this.expAnt.push(this.pAntPower)
    this.expAnt.push(this.pAntGeo)
    this.expAnt.push(this.pAntHunter1)
    this.expAnt.push(this.pAntHunter2)
    this.expAnt.push(this.pAntFungus)

    this.expAnt.forEach(p => {
      this.allPrestigeUp.push(p)
      p.actions.push(new BuyAction(this.game, p,
        [new Cost(this.experience, new Decimal(15), expIncrement)]))
      p.unlocked = true
    })

    this.game.baseWorld.littleAnt.prestigeBonusProduction.push(this.pAntPower)
    this.game.baseWorld.geologist.prestigeBonusProduction.push(this.pAntGeo)
    this.game.baseWorld.hunter.prestigeBonusProduction.push(this.pAntHunter1)
    this.game.baseWorld.advancedHunter.prestigeBonusProduction.push(this.pAntHunter2)
    this.game.baseWorld.farmer.prestigeBonusProduction.push(this.pAntFungus)

    this.expLists.push(new TypeList("Ant", this.expAnt))

    //#endregion

    //#region Ants in next world
    this.pAntNext = new Unit(this.game, "pan", "Ant follower",
      "Start new worlds with 5 more ants.", true)
    this.pGeologistNext = new Unit(this.game, "pgn", "Geologist follower",
      "Start new worlds with 5 more geologists.", true)
    this.pScientistNext = new Unit(this.game, "psn", "Scientist follower",
      "Start new worlds with 5 more scientists.", true)
    this.pFarmerNext = new Unit(this.game, "pfn", "Farmer follower",
      "Start new worlds with 5 more farmers.", true)
    this.pCarpenterNext = new Unit(this.game, "pcarn", "Carpenter follower",
      "Start new worlds with 5 more carpenters.", true)
    this.pLumberjackNext = new Unit(this.game, "plumn", "Lumberjack follower",
      "Start new worlds with 5 more lumberjacks.", true)

    this.expFollower = [this.pAntNext, this.pGeologistNext, this.pScientistNext,
    this.pFarmerNext, this.pCarpenterNext, this.pLumberjackNext]
    this.expFollower.forEach(n => {
      this.allPrestigeUp.push(n)
      n.actions.push(new BuyAction(this.game, n,
        [new Cost(this.experience, new Decimal(10), expIncrement)]))
    })

    this.game.baseWorld.littleAnt.prestigeBonusStart = this.pAntNext
    this.game.baseWorld.geologist.prestigeBonusStart = this.pGeologistNext
    this.game.science.student.prestigeBonusStart = this.pScientistNext
    this.game.baseWorld.farmer.prestigeBonusStart = this.pFarmerNext
    this.game.baseWorld.carpenter.prestigeBonusStart = this.pCarpenterNext
    this.game.baseWorld.lumberjack.prestigeBonusStart = this.pLumberjackNext

    this.expLists.push(new TypeList("Ant Followers", this.expFollower))

    //#endregion

    //#region Machinery
    this.expMachinery = new Array<Unit>()
    this.pMachineryPower = new Unit(this.game, "pMach", "Machinery Power",
      "Machinery yields and consume 30% more resources.", true)
    this.pMachineryPower.actions.push(new BuyAction(this.game, this.pMachineryPower,
      [new Cost(this.experience, new Decimal(20), expIncrement)]))
    this.expMachinery.push(this.pMachineryPower)
    this.game.machines.listMachinery.forEach(m => m.prestigeBonusProduction.push(this.pMachineryPower))

    this.expLists.push(new TypeList("Machinery", this.expMachinery))

    //#endregion

    //#region Technology
    this.expTech = new Array<Unit>()
    this.pComposter = new Unit(this.game, "pComposter", "Compost",
      "Composter units yield and consume 30% more resources.", true)
    this.pRefinery = new Unit(this.game, "pRefinery", "Refinery",
      "Refinery units yield and consume 30% more resources.", true)
    this.pLaser = new Unit(this.game, "pLaser", "Laser",
      "Laser units yield and consume 30% more resources.", true)
    this.pHydro = new Unit(this.game, "pHydro", "Hydroponics",
      "Hydroponics units yield and consume 30% more resources.", true)
    this.pPlanter = new Unit(this.game, "pPlanter", "Planting",
      "Planting units yield and consume 30% more resources.", true)

    this.expTech.push(this.pComposter)
    this.expTech.push(this.pRefinery)
    this.expTech.push(this.pLaser)
    this.expTech.push(this.pHydro)
    this.expTech.push(this.pPlanter)

    this.expTech.forEach(p => {
      p.actions.push(new BuyAction(this.game, p,
        [new Cost(this.experience, new Decimal(30), expIncrement)]))
    })
    this.expLists.push(new TypeList("Technology", this.expTech))

    this.game.machines.composterStation.prestigeBonusProduction.push(this.pComposter)
    this.game.baseWorld.composterAnt.prestigeBonusProduction.push(this.pComposter)

    this.game.machines.refineryStation.prestigeBonusProduction.push(this.pRefinery)
    this.game.baseWorld.refineryAnt.prestigeBonusProduction.push(this.pRefinery)

    this.game.machines.laserStation.prestigeBonusProduction.push(this.pLaser)
    this.game.baseWorld.laserAnt.prestigeBonusProduction.push(this.pLaser)

    this.game.machines.hydroFarm.prestigeBonusProduction.push(this.pHydro)
    this.game.baseWorld.hydroAnt.prestigeBonusProduction.push(this.pHydro)

    this.game.machines.plantingMachine.prestigeBonusProduction.push(this.pPlanter)
    this.game.baseWorld.planterAnt.prestigeBonusProduction.push(this.pPlanter)

    //#endregion

    //#region Supply
    const supplyMaterials = [
      this.game.baseWorld.food,
      this.game.baseWorld.crystal,
      this.game.baseWorld.soil,
      this.game.baseWorld.wood,
      this.game.baseWorld.sand
    ]
    supplyMaterials.forEach(sm => sm.prestigeBonusQuantityValue = new Decimal(1000))
    this.supplyList = supplyMaterials.map(sm =>
      new Unit(this.game, "supp_" + sm.id, sm.name + " supply.",
        "Start new worlds with 1000 more " + sm.name + ".", true))

    for (let i = 0; i < supplyMaterials.length; i++) {
      const n = this.supplyList[i]
      const resup = new Resupply(this.game, supplyMaterials[i], n)

      this.allPrestigeUp.push(n)
      n.actions.push(new BuyAndUnlockAction(this.game, n,
        [new Cost(this.experience, new Decimal(12), expIncrement)],
        [resup]))

      supplyMaterials[i].prestigeBonusStart = this.supplyList[i]
      supplyMaterials[i].actions.push(resup)
    }


    this.expLists.push(new TypeList("Supply", this.supplyList))
    //#endregion

    //#region Efficiency
    this.effList = new Array<Unit>()
    const names = [
      "Composter", "Refinery", "Laser", "Hydroponics", "Planting"
    ]
    const effMatrix = [
      [
        [this.game.baseWorld.composterAnt, this.game.machines.composterStation]
      ],
      [
        [this.game.baseWorld.refineryAnt, this.game.machines.refineryStation]
      ],
      [
        [this.game.baseWorld.laserAnt, this.game.machines.laserStation]
      ],
      [
        [this.game.baseWorld.hydroAnt, this.game.machines.hydroFarm]
      ],
      [
        [this.game.baseWorld.planterAnt, this.game.machines.plantingMachine]
      ]
    ]

    for (let i = 0; i < 5; i++) {

      const eff = new Unit(this.game, "eff" + names[i], names[i],
        names[i] + " units consume 5% less resources. Max -50%.", true)

      const ba = new BuyAction(this.game, eff,
        [new Cost(this.experience, new Decimal(50), expIncrement)])

      ba.limit = new Decimal(10)

      eff.actions.push(ba)

      effMatrix[i].forEach(u => u.forEach(u2 => u2.produces
        .filter(p => p.efficiency.lessThanOrEqualTo(0))
        .forEach(prod => {
          if (!prod.bonusList)
            prod.bonusList = new Array<[Base, decimal.Decimal]>()

          prod.bonusList.push([eff, new Decimal(-0.05)])

        })
      ))

      this.effList.push(eff)
    }
    this.expLists.push(new TypeList("Efficiency", this.effList))

    //#endregion

    //#region Efficiency 2
    this.effListEng = new Array<Unit>()

    this.game.engineers.listEnginer.forEach(eng => {

      const eff = new Unit(this.game, "effEng" + eng.id, eng.name,
        eng.name + " consume 5% less resources. Max -50%.", true)

      const ba = new BuyAction(this.game, eff,
        [new Cost(this.experience, new Decimal(50), expIncrement)])

      ba.limit = new Decimal(10)

      eff.actions.push(ba)

      eng.produces.filter(p => p.efficiency.lessThanOrEqualTo(0))
        .forEach(prod => {
          if (!prod.bonusList)
            prod.bonusList = new Array<[Base, decimal.Decimal]>()
          prod.bonusList.push([eff, new Decimal(-0.05)])
        })
      this.effListEng.push(eff)
    })

    this.expLists.push(new TypeList("Engineering", this.effListEng))
    //#endregion

    //#region Efficiency 3
    this.effListDep = new Array<Unit>()

    this.game.engineers.listDep.forEach(dep => {

      const eff = new Unit(this.game, "effDep" + dep.id, dep.name,
        dep.name + " consume 5% less resources. Max -50%.", true)

      const ba = new BuyAction(this.game, eff,
        [new Cost(this.experience, new Decimal(60), expIncrement)])

      ba.limit = new Decimal(10)

      eff.actions.push(ba)

      dep.produces.filter(p => p.efficiency.lessThanOrEqualTo(0))
        .forEach(prod => {
          if (!prod.bonusList)
            prod.bonusList = new Array<[Base, decimal.Decimal]>()
          prod.bonusList.push([eff, new Decimal(-0.05)])
        })
      this.effListDep.push(eff)
    })

    this.expLists.push(new TypeList("Departments", this.effListDep))
    //#endregion

    //#region Time
    this.time = new Unit(this.game, "ptime", "Time",
      "Time can be used to go to the future. One unit of time corresponds to one second.", true)

    this.timeMaker = new Unit(this.game, "ptimeMaker", "Time Generator",
      "Time Generator generates time at 1/10 of real life speed. It's not affected by pause and time warps.", true)
    this.timeMaker.percentage = 100
    this.timeMaker.alwaysOn = true

    this.timeBank = new Unit(this.game, "ptimeBank", "Time Bank",
      "Time Bank increases the maxium time storage by 1 hour. Base storage is 4 hours.", true)

    this.timeMaker.actions.push(new BuyAction(this.game, this.timeMaker,
      [new Cost(this.experience, new Decimal(25), expIncrement)]))

    this.timeBank.actions.push(new BuyAction(this.game, this.timeBank,
      [new Cost(this.experience, new Decimal(100), expIncrement)]))

    this.game.actMin = new TimeWarp(this.game, new Decimal(60), "Minutes")
    this.game.actHour = new TimeWarp(this.game, new Decimal(3600), "Hours")

    this.time.actions.push(this.game.actMin)
    this.time.actions.push(this.game.actHour)
    this.time.actions.push(new TimeWarp(this.game, new Decimal(3600 * 24), "Days"))

    // this.time.addProductor(new Production(this.timeMaker, new Decimal(0.1)))

    this.timeList = [this.time, this.timeMaker, this.timeBank]
    this.expLists.push(new TypeList("Time Management", this.timeList))
    //#endregion

    this.expLists.map(l => l.list).forEach(al => al.forEach(l => {
      l.unlocked = true
      l.showTables = false
      l.neverEnding = true
      l.actions.forEach(a => a.unlocked = true)
    }))
  }

  public addWorld() {
  }
}
