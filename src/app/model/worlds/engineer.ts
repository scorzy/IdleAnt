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
    this.listEnginer.push(this.sandEnginer)
    this.listEnginer.push(this.woodEnginer)
    this.listEnginer.push(this.mineEnginer)
    this.listEnginer.push(this.beeEnginer)
    this.listEnginer.push(this.iceCompEngineer)
    this.listEnginer.push(this.iceEngineer)
    this.listEnginer.push(this.lensEnginer)

    this.game.lists.push(new TypeList("Engineers", this.listEnginer))
  }
  initStuff() {

    this.listEnginer.forEach(e => {
      e.actions.push(new BuyAction(this.game,
        e,
        [
          new Cost(this.game.baseWorld.littleAnt, Decimal(1E4), this.game.buyExpUnit),
          new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.buyExp)
        ]
      ))
      e.actions.push(new UpAction(this.game, e,
        [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))
      e.actions.push(new UpHire(this.game, e,
        [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceHireExp)]))
    })


    for (let i = 0; i < this.listEnginer.length; i++) {
      const engineer = this.listEnginer[i]
      const machine = this.game.machines.listMachinery[i]

      machine.addProductor(new Production(engineer, Decimal(0.01)))
      this.game.baseWorld.science.addProductor(new Production(engineer, Decimal(-200)))

      machine.buyAction.priceF.forEach(price => {
        price.unit.addProductor(new Production(engineer, price.basePrice.div(-50)))
        engineer.buyAction.priceF.push(new Cost(price.unit, price.basePrice.times(5), this.game.buyExpUnit))
      })



    }

  }
  addWorld() {
  }
}
