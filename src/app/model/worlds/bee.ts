import { TogableProduction } from '../units/togableProductions';
import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';
import { Engineers } from './engineer';

export class Bee implements WorldInterface {

  foragingBee: Unit
  workerBee: Unit
  queenBee: Unit
  hiveBee: Unit
  beeResearch: Research
  universityBee: Unit

  scientistBee: Unit
  foodBee: Unit
  advancedBee: Research
  universityResBee: Research
  universityResBee2: Research

  engineersProd: Production

  listBee = new Array<Unit>()

  constructor(public game: GameModel) { }

  declareStuff() {

    this.foragingBee = new Unit(this.game, "forBee", "Foraging Bee",
      "Foraging Bee yield nectar.")

    this.queenBee = new Unit(this.game, "qBee", "Queen Bee",
      "Yeld Foraging Bee.")

    this.hiveBee = new Unit(this.game, "hBee", "Hive Bee",
      "Hives yeld queens and instruct foraggin bee to become workers.")

    this.workerBee = new Unit(this.game, "worBee", "Worker Bee",
      "Worker Bee converts nectar to honey.")

    this.scientistBee = new Unit(this.game, "scBee", "Scientist Bee",
      "Scientist bee studies honey properties.")

    this.foodBee = new Unit(this.game, "foodBee", "Food Bee",
      "Convert honey to food.")

    this.universityBee = new Unit(this.game, "universityBee", "University of Bee",
      "Instruct new Scientist Bee")

    this.listBee.push(this.hiveBee)
    this.listBee.push(this.queenBee)
    this.listBee.push(this.foragingBee)
    this.listBee.push(this.workerBee)
    this.listBee.push(this.universityBee)
    this.listBee.push(this.scientistBee)
    this.listBee.push(this.foodBee)

    this.game.lists.push(new TypeList("Bee", this.listBee))

    this.engineersProd = new Production(this.universityBee, Decimal(0.1), false)
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
    this.game.baseWorld.honey.addProductor(new Production(this.workerBee, Decimal(1.5)))

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

    //  Hive
    this.hiveBee.actions.push(new BuyAction(this.game,
      this.hiveBee,
      [
        new Cost(this.queenBee, Decimal(100), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.honey, this.game.baseWorld.prestigeOther1.times(1.5),
          this.game.buyExp.times(1.1)),
        new Cost(this.game.baseWorld.food, this.game.baseWorld.prestigeFood.times(0.8), this.game.buyExp),
      ]
    ))
    this.queenBee.addProductor(new Production(this.hiveBee))
    this.foragingBee.addProductor(new Production(this.hiveBee, Decimal(-5)))
    this.workerBee.addProductor(new Production(this.hiveBee, Decimal(5)))

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
        new Cost(this.game.baseWorld.crystal, Decimal(4E3), this.game.buyExp),
      ]
    ))
    this.game.baseWorld.science.addProductor(new Production(this.scientistBee, Decimal(10)))
    this.game.baseWorld.honey.addProductor(new Production(this.scientistBee, Decimal(-2)))
    this.game.baseWorld.crystal.addProductor(new Production(this.scientistBee, Decimal(-1)))

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

    //    University
    this.universityBee.actions.push(new BuyAction(this.game,
      this.universityBee,
      [
        new Cost(this.foragingBee, Decimal(1E3), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.wood, this.game.machines.price1, this.game.buyExp),
        new Cost(this.game.baseWorld.crystal, this.game.machines.price2, this.game.buyExp),
        new Cost(this.game.baseWorld.honey, this.game.machines.price2, this.game.buyExp)
      ]
    ))

    this.game.baseWorld.science.addProductor(new Production(this.universityBee, Decimal(600)))
    this.game.baseWorld.honey.addProductor(new Production(this.foodBee, Decimal(-5)))
    this.scientistBee.addProductor(new Production(this.universityBee, Decimal(0.01)))

    this.game.engineers.beeEnginer.addProductor(this.engineersProd)

    this.universityBee.togableProductions = [new TogableProduction("Generate engineers", [this.engineersProd])]

    //  Research
    this.universityResBee2 = new Research(
      "uniResBee2",
      "Department of Bee Engineering", "Bee university also yield bee engineers.",
      [new Cost(this.game.baseWorld.science, Decimal(7E7))],
      [this.engineersProd],
      this.game
    )

    //  Research
    this.universityResBee = new Research(
      "universityResBee",
      "University of Bee", "Get an university of bee.",
      [new Cost(this.game.baseWorld.science, Decimal(6E6))],
      [this.universityBee, this.universityResBee2],
      this.game
    )

    //  Research
    this.advancedBee = new Research(
      "advBee",
      "Advanced Bee", "More jobs for bees.",
      [new Cost(this.game.baseWorld.science, Decimal(1E3))],
      [this.scientistBee, this.foodBee, this.universityResBee],
      this.game
    )

    //    Bee
    this.beeResearch = new Research(
      "beeRes",
      "Bee", "Unlock Bee !",
      [new Cost(this.game.baseWorld.science, Decimal(0))],
      [this.game.baseWorld.nectar, this.foragingBee, this.workerBee, this.game.baseWorld.honey, this.advancedBee],
      this.game
    )
    this.beeResearch.avabileBaseWorld = false
  }

  addWorld() {

    World.worldPrefix.push(
      new World(this.game, "Apian", "",
        [this.game.machines.honeyMaker, this.game.engineers.beeEnginer],
        [],
        [
          new Cost(this.hiveBee, Decimal(35)),
          new Cost(this.game.baseWorld.honey, this.game.baseWorld.prestigeFood)
        ],
        [],
        [],
        [[this.beeResearch, Decimal(0)]],
        Decimal(3)
      )
    )

    World.worldSuffix.push(
      new World(this.game, "of Bee", "",
        [this.game.machines.honeyMaker, this.game.engineers.beeEnginer],
        [],
        [
          new Cost(this.hiveBee, Decimal(45)),
          new Cost(this.game.baseWorld.honey, this.game.baseWorld.prestigeFood)
        ],
        [[this.foragingBee, Decimal(2)]],
        [],
        [[this.beeResearch, Decimal(0)]],
        Decimal(3)
      )
    )
  }
}
