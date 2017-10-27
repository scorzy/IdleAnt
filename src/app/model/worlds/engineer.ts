import { debounce } from 'rxjs/operator/debounce';
import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial } from '../units/action';
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

  composterDep: Unit
  laserDep: Unit
  hydroDep: Unit
  plantingDep: Unit
  refineryDep: Unit

  mineDep: Unit
  sandDep: Unit
  woodDep: Unit
  beeDep: Unit
  lensDep: Unit
  iceDep: Unit
  iceCompDep: Unit

  listEnginer = new Array<Unit>()
  listDep = new Array<Unit>()

  constructor(public game: GameModel) { }

  declareStuff() {
    this.listEnginer = new Array<Unit>()

    this.composterEnginer = new Unit(this.game, "engCo", "Composter E.",
      "Slowly build composter stations.")
    this.laserEnginer = new Unit(this.game, "engLa", "Laser E.",
      "Slowly build laser stations.")
    this.hydroEnginer = new Unit(this.game, "engHy", "Hydro E.",
      "Slowly build hydroponic farms.")
    this.plantingEnginer = new Unit(this.game, "engSo", "Planting E.",
      "Slowly build planting machines.")
    this.refineryEnginery = new Unit(this.game, "engRef", "Refine E.",
      "Slowly build refinery stations.")

    this.mineEnginer = new Unit(this.game, "engMi", "Mining E.",
      "Slowly build mines.")
    this.sandEnginer = new Unit(this.game, 'engSa', "Sand E.",
      'Slowly build sand diggers.')
    this.woodEnginer = new Unit(this.game, "engWo", "Wood E.",
      "Slowly build logging machines.")
    this.beeEnginer = new Unit(this.game, "engBee", "Bee E.",
      "Slowly build honey makers.")
    this.iceEngineer = new Unit(this.game, "engIce", "Ice E.",
      "Slowly build water tanks.")
    this.iceCompEngineer = new Unit(this.game, "engIceComp", "Compacting E.",
      "Slowly build ice compacters.")
    this.lensEnginer = new Unit(this.game, "lensEnginer", "Burning Lens E.",
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

    this.composterDep = new Unit(this.game, "depaCo", "Composting Department",
      "Yeild engineers.")
    this.laserDep = new Unit(this.game, "depaLa", "Laser Department",
      "Yeild engineers.")
    this.hydroDep = new Unit(this.game, "depaHy", "Hydro Department",
      "Yeild engineers.")
    this.plantingDep = new Unit(this.game, "depaSo", "Planting Department",
      "Yeild engineers.")
    this.refineryDep = new Unit(this.game, "depaRef", "Refine Department",
      "Yeild engineers.")

    this.mineDep = new Unit(this.game, "depaMi", "Mining Department",
      "Yeild engineers.")
    this.sandDep = new Unit(this.game, 'depaSa', "Sand Department",
      'Yeild engineers.')
    this.woodDep = new Unit(this.game, "depaWo", "Wood Department",
      "Yeild engineers.")
    this.beeDep = new Unit(this.game, "depaBee", "Bee Department",
      "Yeild engineers.")
    this.iceDep = new Unit(this.game, "depaIce", "Ice Department",
      "Yeild engineers.")
    this.iceCompDep = new Unit(this.game, "depaIceComp", "Compacting Department",
      "Yeild engineers.")
    this.lensDep = new Unit(this.game, "depaEnginer", "Burning Lens Department",
      "Yeild engineers.")

    this.sandDep.avabileBaseWorld = false
    this.mineDep.avabileBaseWorld = false
    this.woodDep.avabileBaseWorld = false
    this.beeDep.avabileBaseWorld = false
    this.iceDep.avabileBaseWorld = false
    this.iceCompDep.avabileBaseWorld = false
    this.lensDep.avabileBaseWorld = false

    this.listDep.push(this.composterDep)
    this.listDep.push(this.refineryDep)
    this.listDep.push(this.laserDep)
    this.listDep.push(this.hydroDep)
    this.listDep.push(this.plantingDep)
    this.listDep.push(this.sandDep)
    this.listDep.push(this.woodDep)
    this.listDep.push(this.mineDep)
    this.listDep.push(this.beeDep)
    this.listDep.push(this.iceCompDep)
    this.listDep.push(this.iceDep)
    this.listDep.push(this.lensDep)

    this.game.lists.push(new TypeList("Departments", this.listDep))
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

    //  Bee engineer should actually be a Bee
    this.beeEnginer.buyAction.priceF = [
      new Cost(this.game.bee.foragingBee, Decimal(1E4), this.game.buyExpUnit),
      new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.buyExp)
    ]

    this.beeEnginer.upAction.priceF[0].basePrice = this.beeEnginer.upAction.priceF[0].basePrice.times(0.8)
    this.beeEnginer.upHire.priceF[0].basePrice = this.beeEnginer.upHire.priceF[0].basePrice.times(0.8)

    //  departments
    for (let i = 0; i < this.listEnginer.length; i++) {
      const engineer = this.listEnginer[i]
      const machine = this.game.machines.listMachinery[i]
      const dep = this.listDep[i]

      engineer.addProductor(new Production(dep, Decimal(1)))
      this.game.baseWorld.science.addProductor(new Production(dep, Decimal(-2000)))

      dep.actions.push(new BuyAction(this.game,
        dep,
        [
          new Cost(this.game.science.university, Decimal(1), this.game.buyExpUnit),
          new Cost(engineer, Decimal(100), this.game.buyExp),
          new Cost(machine, Decimal(1E4), this.game.buyExp)
        ]
      ))

    }
  }
  addWorld() {
  }
}
