import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Beach implements WorldInterface {

  crab: Unit
  crabFarmer: Unit
  crabQueen: Unit
  shrimp: Unit
  seaRes: Research

  constructor(public game: GameModel) { }

  declareStuff() {
    const beachList = new Array<Unit>()
    this.crab = new Unit(this.game, "crab", "Crab", "Crab yield sand.")
    this.crabFarmer = new Unit(this.game, "crabF", "Farmer Crab", "Farmer Crab yield fungus")
    this.crabQueen = new Unit(this.game, "CrabQ", "Crab Queen", "Crab Queen yield crab")
    this.shrimp = new Unit(this.game, "shrimp", "Shrimp",
      "Shrimp yield sand and cristal")

    beachList.push(this.crabQueen)
    beachList.push(this.crab)
    beachList.push(this.crabFarmer)
    beachList.push(this.shrimp)

    //    Research
    this.seaRes = new Research(
      "seaRes",
      "Sea Helpers", "Unlock Sea Helpers",
      [new Cost(this.game.baseWorld.science, Decimal(30))],
      [this.crab, this.crabFarmer, this.crabQueen, this.shrimp],
      this.game
    )
    this.seaRes.avabileBaseWorld = false
    this.game.lists.push(new TypeList("Beach", beachList))

  }
  initStuff() {
    //    Crab
    this.crab.actions.push(new BuyAction(this.game,
      this.crab,
      [new Cost(this.game.baseWorld.food, Decimal(1E3), this.game.buyExp)]
    ))
    this.crab.actions.push(new UpAction(this.game, this.crab,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.crab.actions.push(new UpHire(this.game, this.crab,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))

    this.game.baseWorld.sand.addProductor(new Production(this.crab))

    //    Crab Farmer
    this.crabFarmer.actions.push(new BuyAction(this.game,
      this.crabFarmer,
      [
        new Cost(this.game.baseWorld.food, Decimal(15E3), this.game.buyExp),
        new Cost(this.crab, Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.crabFarmer.actions.push(new UpAction(this.game, this.crabFarmer,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.crabFarmer.actions.push(new UpHire(this.game, this.crabFarmer,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))

    this.game.baseWorld.fungus.addProductor(new Production(this.crabFarmer))

    //    Crab Queen ?!
    //    Not sure if really exists
    this.crabQueen.actions.push(new BuyAction(this.game,
      this.crabQueen,
      [
        new Cost(this.game.baseWorld.food, Decimal(1E5), this.game.buyExp),
        new Cost(this.crab, Decimal(100), this.game.buyExpUnit)
      ]
    ))
    this.crabQueen.actions.push(new UpAction(this.game, this.crabQueen,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))
    this.crabQueen.actions.push(new UpHire(this.game, this.crabQueen,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))

    this.crab.addProductor(new Production(this.crabQueen))

    //    Shrimp
    this.shrimp.actions.push(new BuyAction(this.game,
      this.shrimp,
      [new Cost(this.game.baseWorld.food, Decimal(3E3), this.game.buyExp)]
    ))
    this.shrimp.actions.push(new UpAction(this.game, this.shrimp,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.shrimp.actions.push(new UpHire(this.game, this.shrimp,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))

    this.game.baseWorld.sand.addProductor(new Production(this.shrimp))
    this.game.baseWorld.cristal.addProductor(new Production(this.shrimp, Decimal(0.5)))
  }
  addWorld() {
    World.worldTypes.push(
      new World(this.game, "Beach", "A beach",
        [this.game.machines.sandDigger, this.game.engineers.sandEnginer],
        [[this.game.baseWorld.sand, Decimal(1.5)], [this.game.baseWorld.fungus, Decimal(0.7)]],
        [new Cost(this.game.beach.crabQueen, Decimal(200))],
        [[this.game.baseWorld.fungus, Decimal(0.7)]],
        [],
        [[this.game.beach.seaRes, Decimal(0)]],
        Decimal(3.5)
      ))
  }
}
