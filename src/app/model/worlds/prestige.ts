import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Type, Base } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Prestige implements WorldInterface {

  experience: Unit

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

  constructor(public game: GameModel) { }


  public declareStuff() {

  }

  public initStuff() {
    const expIncrement = Decimal(1.3)

    this.experience = new Unit(this.game, "exp", "Experience", "Experience", true)
    this.expLists = new Array<TypeList>()
    this.expAnt = new Array<Unit>()

    //    Ant food
    this.pAntPower = new Unit(this.game, "pap", "Ant Power", "Ant yeld 100% more Food.", true)
    this.allPrestigeUp.push(this.pAntPower)
    this.pAntPower.actions.push(new BuyAction(this.game, this.pAntPower,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expAnt.push(this.pAntPower)
    this.game.baseWorld.littleAnt.prestigeBonusProduction.push(this.pAntPower)

    //    Ant fungus
    this.pAntFungus = new Unit(this.game, "paf", "Farmer Power", "Farmer yeld 100% more Fungus.", true)
    this.allPrestigeUp.push(this.pAntFungus)
    this.pAntFungus.actions.push(new BuyAction(this.game, this.pAntFungus,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expAnt.push(this.pAntFungus)
    this.game.baseWorld.farmer.prestigeBonusProduction.push(this.pAntFungus)

    //    Ant in next world
    this.pAntNext = new Unit(this.game, "pan", "Ant follower",
      "Start new worlds with 5 more ants.", true)
    this.pGeologistNext = new Unit(this.game, "pgn", "Geologist follower",
      "Start new worlds with 5 more geologist.", true)
    this.pScientistNext = new Unit(this.game, "psn", "Scientist follower",
      "Start new worlds with 5 more scientist.", true)
    this.pFarmerNext = new Unit(this.game, "pfn", "Farmer follower",
      "Start new worlds with 5 more farmer.", true)

    const listNext = [this.pAntNext, this.pGeologistNext, this.pScientistNext, this.pFarmerNext]
    listNext.forEach(n => {
      this.allPrestigeUp.push(n)
      n.actions.push(new BuyAction(this.game, n,
        [new Cost(this.experience, Decimal(10), expIncrement)]))
      this.expAnt.push(n)
    })

    this.game.baseWorld.littleAnt.prestigeBonusStart = this.pAntNext
    this.game.baseWorld.geologist.prestigeBonusStart = this.pGeologistNext
    this.game.science.student.prestigeBonusStart = this.pScientistNext
    this.game.baseWorld.farmer.prestigeBonusStart = this.pFarmerNext

    this.expLists.push(new TypeList("Ant", this.expAnt))

    //    Machinery
    this.expMachinery = new Array<Unit>()
    this.pMachineryPower = new Unit(this.game, "pMach", "Machinery Power", "Machinery Power", true)
    this.pMachineryPower.actions.push(new BuyAction(this.game, this.pMachineryPower,
      [new Cost(this.experience, Decimal(10), expIncrement)]))
    this.expMachinery.push(this.pMachineryPower)
    this.game.machines.listMachinery.forEach(m => m.prestigeBonusProduction.push(this.pMachineryPower))

    this.expLists.push(new TypeList("Machinery", this.expMachinery))

    this.expLists.map(l => l.list).forEach(al => al.forEach(l => {
      l.unlocked = true
      l.buyAction.unlocked = true
    }))

    //    Tecnology
    this.expTech = new Array<Unit>()
    this.pComposter = new Unit(this.game, "pComposter", "Compost",
      "Composter units are 100% better.", true)
    this.pRefinery = new Unit(this.game, "pRefinery", "Refinery",
      "Refinery units are 100% better.", true)
    this.pLaser = new Unit(this.game, "pLaser", "Laser",
      "Laser units are 100% better.", true)
    this.pHydro = new Unit(this.game, "pHydro", "Hydroponics",
      "Hydroponics units are 100% better.", true)
    this.pPlanter = new Unit(this.game, "pPlanter", "Planting",
      "Planting units are 100% better.", true)

    this.expTech.push(this.pComposter)
    this.expTech.push(this.pRefinery)
    this.expTech.push(this.pLaser)
    this.expTech.push(this.pHydro)
    this.expTech.push(this.pPlanter)

    this.expTech.forEach(p => {
      p.actions.push(new BuyAction(this.game, p,
        [new Cost(this.experience, Decimal(10), expIncrement)]))
    })
    this.expLists.push(new TypeList("Tecnology", this.expTech))

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

    this.expLists.map(l => l.list).forEach(al => al.forEach(l => {
      l.unlocked = true
      l.buyAction.unlocked = true
    }))
  }

  public addWorld() {
  }
}
