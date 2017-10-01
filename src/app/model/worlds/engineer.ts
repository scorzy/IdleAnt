import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';

export class Engineers implements WorldInterface {

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
  iceEngineer: Unit
  iceCompEngineer: Unit

  listEnginer = new Array<Unit>()

  constructor(public game: GameModel) { }

  declareStuff() {
    this.listEnginer = new Array<Unit>()

    this.composterEnginer = new Unit(this.game, "engCo", "Composter Engineer",
      "Slowly build laser stations.")
    this.laserEnginer = new Unit(this.game, "engLa", "Laser Engineer",
      "Slowly build laser stations.")
    this.hydroEnginer = new Unit(this.game, "engHy", "Hydro Engineer",
      "Slowly build hydroponic farms.")
    this.plantingEnginer = new Unit(this.game, "engSo", "Planting Engineer",
      "Slowly build planting machines.")
    this.refineryEnginery = new Unit(this.game, "engRef", "Refine Engineer",
      "Slowly build refinery stations.")

    this.mineEnginer = new Unit(this.game, "engMi", "Mining Engineer",
      "Slowly build mines.")
    this.sandEnginer = new Unit(this.game, 'engSa', "Sand Engineer",
      'Slowly build sand diggers.')
    this.woodEnginer = new Unit(this.game, "engWo", "Wood Engineer",
      "Slowly build logging machines.")
    this.beeEnginer = new Unit(this.game, "engBee", "Bee Engineer",
      "Slowly build honey makers.")
    this.iceEngineer = new Unit(this.game, "engIce", "Ice Engineer",
      "Slowly build water tanks.")
    this.iceCompEngineer = new Unit(this.game, "engIceComp", "Compacting Engineer",
      "Slowly build ice compacters.")
    this.lensEnginer = new Unit(this.game, "lensEnginer", "Burning Lens Engineer",
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

    this.game.lists.push(new TypeList("Engineers", this.listEnginer))
  }
  initStuff() {
    this.game.machines.laserStation.addProductor(new Production(this.laserEnginer, Decimal(0.01)))
    this.game.machines.hydroFarm.addProductor(new Production(this.hydroEnginer, Decimal(0.01)))
    this.game.machines.plantingMachine.addProductor(new Production(this.plantingEnginer, Decimal(0.01)))
    this.game.machines.mine.addProductor(new Production(this.mineEnginer, Decimal(0.01)))
    this.game.machines.sandDigger.addProductor(new Production(this.sandEnginer, Decimal(0.01)))
    this.game.machines.loggingMachine.addProductor(new Production(this.woodEnginer, Decimal(0.01)))
    this.game.machines.refineryStation.addProductor(new Production(this.refineryEnginery, Decimal(0.01)))
    this.game.machines.composterStation.addProductor(new Production(this.composterEnginer, Decimal(0.01)))
    this.game.machines.honeyMaker.addProductor(new Production(this.beeEnginer, Decimal(0.01)))
    this.game.machines.iceCollector.addProductor(new Production(this.iceEngineer, Decimal(0.01)))
    this.game.machines.iceCompacter.addProductor(new Production(this.iceCompEngineer, Decimal(0.01)))
    this.game.machines.burningGlass.addProductor(new Production(this.lensEnginer, Decimal(0.01)))

    this.listEnginer.forEach(e => {
      e.actions.push(new BuyAction(this.game,
        e,
        [
          new Cost(this.game.baseWorld.littleAnt, Decimal(1E3), this.game.buyExpUnit),
          new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.buyExp)
        ]
      ))
      e.actions.push(new UpAction(this.game, e,
        [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))
      e.actions.push(new UpHire(this.game, e,
        [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceHireExp)]))
    })

    this.laserEnginer.buyAction.priceF.push(new Cost(this.game.machines.laserStation, Decimal(1), this.game.buyExpUnit))
    this.hydroEnginer.buyAction.priceF.push(new Cost(this.game.machines.hydroFarm, Decimal(1), this.game.buyExpUnit))
    this.plantingEnginer.buyAction.priceF.push(new Cost(this.game.machines.plantingMachine, Decimal(1), this.game.buyExpUnit))
    this.mineEnginer.buyAction.priceF.push(new Cost(this.game.machines.mine, Decimal(1), this.game.buyExpUnit))
    this.sandEnginer.buyAction.priceF.push(new Cost(this.game.machines.sandDigger, Decimal(1), this.game.buyExpUnit))
    this.woodEnginer.buyAction.priceF.push(new Cost(this.game.machines.loggingMachine, Decimal(1), this.game.buyExpUnit))
    this.refineryEnginery.buyAction.priceF.push(new Cost(this.game.machines.refineryStation, Decimal(1), this.game.buyExpUnit))
    this.composterEnginer.buyAction.priceF.push(new Cost(this.game.machines.composterStation, Decimal(1), this.game.buyExpUnit))
    this.beeEnginer.buyAction.priceF.push(new Cost(this.game.machines.honeyMaker, Decimal(1), this.game.buyExpUnit))
    this.iceEngineer.buyAction.priceF.push(new Cost(this.game.machines.iceCollector, Decimal(1), this.game.buyExpUnit))
    this.iceCompEngineer.buyAction.priceF.push(new Cost(this.game.machines.iceCompacter, Decimal(1), this.game.buyExpUnit))
    this.lensEnginer.buyAction.priceF.push(new Cost(this.game.machines.burningGlass, Decimal(1), this.game.buyExpUnit))
  }
  addWorld() {
  }
}
