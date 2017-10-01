import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Bee implements WorldInterface {

  foragingBee: Unit
  workerBee: Unit
  queenBee: Unit
  hiveBee: Unit
  beeResearch: Research

  scientistBee: Unit
  foodBee: Unit
  advancedBee: Research
  listBee = new Array<Unit>()

  constructor(public game: GameModel) { }

  declareStuff() {

    this.foragingBee = new Unit(this.game, "forBee", "Foraging Bee",
      "Foraging Bee yield nectar.")

    this.queenBee = new Unit(this.game, "qBee", "Queen Bee",
      "Yeld Foraging Bee.")

    this.hiveBee = new Unit(this.game, "hBee", "Hive Bee",
      "Yeld Queen")

    this.workerBee = new Unit(this.game, "worBee", "Worker Bee",
      "Worker Bee converts nectar to honey.")

    this.scientistBee = new Unit(this.game, "scBee", "Scientist Bee",
      "Scientist bee studies honey properties.")
    this.foodBee = new Unit(this.game, "foodBee", "Food Bee",
      "Convert honey to food")

    this.listBee.push(this.hiveBee)
    this.listBee.push(this.queenBee)
    this.listBee.push(this.foragingBee)
    this.listBee.push(this.workerBee)
    this.listBee.push(this.scientistBee)
    this.listBee.push(this.foodBee)

    this.game.lists.push(new TypeList("Bee", this.listBee))
  }

  initStuff() {
    const beeTeamUp = this.game.upgradeScienceExp.times(0.8)
    const beeHireUp = this.game.upgradeScienceHireExp.times(0.8)

    //    Foragging
    this.foragingBee.types = [Type.Bee]
    this.foragingBee.actions.push(new BuyAction(this.game,
      this.foragingBee,
      [new Cost(this.game.baseWorld.food, Decimal(100), this.game.buyExp)]
    ))
    this.game.baseWorld.nectar.addProductor(new Production(this.foragingBee))
    this.foragingBee.actions.push(new UpAction(this.game,

      this.foragingBee, [new Cost(this.game.baseWorld.science, this.game.scienceCost1, beeTeamUp)]))
    this.foragingBee.actions.push(new UpHire(this.game,
      this.foragingBee, [new Cost(this.game.baseWorld.science, this.game.scienceCost1, beeHireUp)]))

    this.queenBee.types = [Type.Bee]
    this.hiveBee.types = [Type.Bee]

    //    Worker
    this.workerBee.types = [Type.Bee]
    this.workerBee.actions.push(new BuyAndUnlockAction(this.game,
      this.workerBee,
      [
        new Cost(this.game.baseWorld.nectar, Decimal(100), this.game.buyExp),
        new Cost(this.game.baseWorld.food, Decimal(1000), this.game.buyExp),
        new Cost(this.foragingBee, Decimal(1), this.game.buyExpUnit)
      ], [this.queenBee]
    ))
    this.game.baseWorld.nectar.addProductor(new Production(this.workerBee, Decimal(-2)))
    this.game.baseWorld.honey.addProductor(new Production(this.workerBee, Decimal(1)))

    this.workerBee.actions.push(new UpAction(this.game,
      this.workerBee, [new Cost(this.game.baseWorld.science, this.game.scienceCost2, beeTeamUp)]))

    this.workerBee.actions.push(new UpHire(this.game,
      this.workerBee, [new Cost(this.game.baseWorld.science, this.game.scienceCost2, beeHireUp)]))

    //  Queen
    this.queenBee.actions.push(new BuyAndUnlockAction(this.game,
      this.queenBee,
      [
        new Cost(this.foragingBee, Decimal(50), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.honey, Decimal(1E3), this.game.buyExp),
        new Cost(this.game.baseWorld.food, Decimal(1E6), this.game.buyExp),
      ], [this.hiveBee]
    ))
    this.foragingBee.addProductor(new Production(this.queenBee))

    this.hiveBee.actions.push(new BuyAction(this.game,
      this.hiveBee,
      [
        new Cost(this.queenBee, Decimal(1E3), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.honey, Decimal(1E6), beeTeamUp),
        new Cost(this.game.baseWorld.food, Decimal(1E9), this.game.buyExp),
      ]
    ))
    this.queenBee.addProductor(new Production(this.hiveBee))

    this.queenBee.actions.push(new UpAction(this.game, this.queenBee,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, beeTeamUp)]))
    this.queenBee.actions.push(new UpHire(this.game, this.queenBee,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, Decimal(10))]))

    this.hiveBee.actions.push(new UpAction(this.game, this.hiveBee,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, beeTeamUp)]))
    this.hiveBee.actions.push(new UpHire(this.game, this.hiveBee,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, beeHireUp)]))

    //    Scientist
    this.scientistBee.types = [Type.Bee]
    this.scientistBee.actions.push(new BuyAction(this.game,
      this.scientistBee,
      [
        new Cost(this.foragingBee, Decimal(1), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.honey, Decimal(6E3), this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, Decimal(4E3), this.game.buyExp),
      ]
    ))
    this.game.baseWorld.science.addProductor(new Production(this.scientistBee, Decimal(10)))
    this.game.baseWorld.honey.addProductor(new Production(this.scientistBee, Decimal(-2)))
    this.game.baseWorld.cristal.addProductor(new Production(this.scientistBee, Decimal(-1)))

    this.scientistBee.actions.push(new UpAction(this.game, this.scientistBee,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, beeTeamUp)]))
    this.scientistBee.actions.push(new UpHire(this.game, this.scientistBee,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, beeHireUp)]))

    //    Food
    this.foodBee.types = [Type.Bee]
    this.foodBee.actions.push(new BuyAction(this.game,
      this.foodBee,
      [
        new Cost(this.foragingBee, Decimal(1), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.honey, Decimal(1E3), this.game.buyExp)
      ]
    ))
    this.game.baseWorld.food.addProductor(new Production(this.foodBee, Decimal(10)))
    this.game.baseWorld.honey.addProductor(new Production(this.foodBee, Decimal(-5)))
    this.foodBee.actions.push(new UpAction(this.game, this.foodBee,
      [new Cost(this.game.baseWorld.science, Decimal(1E3), Decimal(10))]))
    this.foodBee.actions.push(new UpHire(this.game, this.foodBee,
      [new Cost(this.game.baseWorld.science, Decimal(1E3), Decimal(10))]))

    //  Research
    this.advancedBee = new Research(
      "advBee",
      "Advanced Bee", "More jobs for bees",
      [new Cost(this.game.baseWorld.science, Decimal(1))],
      [this.scientistBee, this.foodBee],
      this.game
    )

    //    Bee
    this.beeResearch = new Research(
      "beeRes",
      "Bee", "Unlock Bee !",
      [new Cost(this.game.baseWorld.science, Decimal(1E3))],
      [this.game.baseWorld.nectar, this.foragingBee, this.workerBee, this.game.baseWorld.honey, this.advancedBee],
      this.game
    )
    this.beeResearch.avabileBaseWorld = false
  }

  addWorld() {
    World.worldSuffix.push(

      new World(this.game, "of Bee", "",
        [], [], [],
        [[this.foragingBee, Decimal(2)]], [],
        [[this.beeResearch, Decimal(0)]]
      )

    )
  }
}
