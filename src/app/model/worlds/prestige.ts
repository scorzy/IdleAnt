import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import {  Base } from '../units/base';
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

  constructor(public game: GameModel) { }


  public declareStuff() {

  }

  public initStuff() {
    const expIncrement = Decimal(1.3)

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
        [new Cost(this.experience, Decimal(15), expIncrement)]))
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
      "Start new worlds with 5 more lumberjack.", true)

    this.expFollower = [this.pAntNext, this.pGeologistNext, this.pScientistNext,
    this.pFarmerNext, this.pCarpenterNext, this.pLumberjackNext]
    this.expFollower.forEach(n => {
      this.allPrestigeUp.push(n)
      n.actions.push(new BuyAction(this.game, n,
        [new Cost(this.experience, Decimal(10), expIncrement)]))
    })

    this.game.baseWorld.littleAnt.prestigeBonusStart = this.pAntNext
    this.game.baseWorld.geologist.prestigeBonusStart = this.pGeologistNext
    this.game.science.student.prestigeBonusStart = this.pScientistNext
    this.game.baseWorld.farmer.prestigeBonusStart = this.pFarmerNext
    this.game.baseWorld.carpenter.prestigeBonusStart = this.pCarpenterNext
    this.game.baseWorld.lumberjack.prestigeBonusStart = this.pLumberjackNext

    this.expLists.push(new TypeList("Ant Followers", this.expFollower))

    //#endregion

    //#region  Machinery
    this.expMachinery = new Array<Unit>()
    this.pMachineryPower = new Unit(this.game, "pMach", "Machinery Power",
      "Machinery yeild and consume 30% more resources.", true)
    this.pMachineryPower.actions.push(new BuyAction(this.game, this.pMachineryPower,
      [new Cost(this.experience, Decimal(20), expIncrement)]))
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
        [new Cost(this.experience, Decimal(30), expIncrement)]))
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
    supplyMaterials.forEach(sm => sm.prestigeBonusQuantityValue = Decimal(100))
    this.supplyList = supplyMaterials.map(sm =>
      new Unit(this.game, "supp_" + sm.id, sm.name + " supply.",
        "Start new worlds with 100 more " + sm.name + ".", true))

    this.supplyList.forEach(n => {
      this.allPrestigeUp.push(n)
      n.actions.push(new BuyAction(this.game, n,
        [new Cost(this.experience, Decimal(12), expIncrement)]))
    })

    for (let i = 0; i < supplyMaterials.length; i++)
      supplyMaterials[i].prestigeBonusStart = this.supplyList[i]


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
        [new Cost(this.experience, Decimal(50), expIncrement)])

      ba.limit = Decimal(10)

      eff.actions.push(ba)

      effMatrix[i].forEach(u => u.forEach(u2 => u2.produces
        .filter(p => p.efficiency.lessThanOrEqualTo(0))
        .forEach(prod => {
          if (!prod.bonusList)
            prod.bonusList = new Array<[Base, decimal.Decimal]>()

          prod.bonusList.push([eff, Decimal(-0.05)])

        })
      ))

      this.effList.push(eff)
    }
    this.expLists.push(new TypeList("Efficiency", this.effList))

    //#endregion

    this.expLists.map(l => l.list).forEach(al => al.forEach(l => {
      l.unlocked = true
      l.buyAction.unlocked = true
    }))
  }

  public addWorld() {
  }
}
