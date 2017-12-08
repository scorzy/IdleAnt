import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Beach implements WorldInterface {

  crab: Unit
  crabQueen: Unit
  crabNest: Unit

  crabFarmer: Unit
  crabScientist: Unit

  shrimp: Unit
  lobster: Unit

  shark: Unit
  shark2: Unit

  seaRes: Research
  crabJobRes: Research
  shrimpRes: Research
  lobsterRes: Research
  sharkRes: Research
  sharkRes2: Research
  beachList = new Array<Unit>()

  constructor(public game: GameModel) { }

  declareStuff() {
    this.beachList = new Array<Unit>()
    this.crab = new Unit(this.game, "crab", "Crab", "Crab yield sand.")
    this.crabFarmer = new Unit(this.game, "crabF", "Farmer Crab", "Farmer Crab yield fungus.")
    this.crabQueen = new Unit(this.game, "CrabQ", "Crab Queen", "Crab Queen yield crab.")
    this.crabNest = new Unit(this.game, "CrabN", "Crab Nest", "Crab Nest yield crab queens.")
    this.shrimp = new Unit(this.game, "shrimp", "Shrimp",
      "Shrimp yield sand and crystal.")
    this.lobster = new Unit(this.game, "lobster", "Lobster",
      "Lobster yield sand, and crystal for food.")
    this.crabScientist = new Unit(this.game, "crabScientist", "Scientist Crab",
      "Scientist Crab will get science for sand.")
    this.shark = new Unit(this.game, "shark", "Shark",
      "Shark yield food and crystall.")
    this.shark2 = new Unit(this.game, "shark2", "Great Shark",
      "Great Shark yield sharks.")

    this.beachList.push(this.crabNest)
    this.beachList.push(this.crabQueen)
    this.beachList.push(this.crab)
    this.beachList.push(this.crabFarmer)
    this.beachList.push(this.crabScientist)
    this.beachList.push(this.shrimp)
    this.beachList.push(this.lobster)
    this.beachList.push(this.shark2)
    this.beachList.push(this.shark)


    //    Shark 2
    this.sharkRes2 = new Research(
      "sharkRes2",
      "Great Shark", "Unlock Great Sharks.",
      [new Cost(this.game.baseWorld.science, new Decimal(1E11))],
      [this.shark2],
      this.game
    )

    //    Shark
    this.sharkRes = new Research(
      "sharkRes",
      "Shark", "Unlock Sharks.",
      [new Cost(this.game.baseWorld.science, new Decimal(1E9))],
      [this.shark, this.sharkRes2],
      this.game
    )

    //    lobster
    this.lobsterRes = new Research(
      "lobsterRes",
      "Lobsters", "Unlock lobsters.",
      [new Cost(this.game.baseWorld.science, new Decimal(1E5))],
      [this.lobster, this.sharkRes],
      this.game
    )

    //    shrimp
    this.shrimpRes = new Research(
      "shrimpRes",
      "Shrimps", "Unlock shrimps.",
      [new Cost(this.game.baseWorld.science, new Decimal(2E3))],
      [this.shrimp],
      this.game
    )

    //    Crab Jobs
    this.crabJobRes = new Research(
      "crabJobRes",
      "Crab Jobs", "Unlock more jobs for your crab.",
      [new Cost(this.game.baseWorld.science, new Decimal(1.5E3))],
      [this.crabFarmer, this.crabScientist],
      this.game
    )

    //    Research
    this.seaRes = new Research(
      "seaRes",
      "Sea Helpers", "Unlock Sea Helpers.",
      [new Cost(this.game.baseWorld.science, new Decimal(30))],
      [this.crab, this.crabQueen, this.crabJobRes, this.shrimpRes, this.lobsterRes],
      this.game
    )
    this.seaRes.avabileBaseWorld = false
    this.game.lists.push(new TypeList("Beach", this.beachList))

  }
  initStuff() {
    //    Crab
    this.crab.actions.push(new BuyAction(this.game,
      this.crab,
      [new Cost(this.game.baseWorld.food, new Decimal(1E3), this.game.buyExp)]
    ))
    this.crab.actions.push(new UpAction(this.game, this.crab,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.crab.actions.push(new UpHire(this.game, this.crab,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceHireExp)]))

    this.game.baseWorld.sand.addProductor(new Production(this.crab))

    //    Crab Farmer
    this.crabFarmer.actions.push(new BuyAction(this.game,
      this.crabFarmer,
      [
        new Cost(this.game.baseWorld.food, new Decimal(1E3), this.game.buyExp),
        new Cost(this.game.baseWorld.sand, new Decimal(100), this.game.buyExp),
        new Cost(this.crab, new Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.crabFarmer.actions.push(new UpAction(this.game, this.crabFarmer,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.crabFarmer.actions.push(new UpHire(this.game, this.crabFarmer,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceHireExp)]))

    this.game.baseWorld.fungus.addProductor(new Production(this.crabFarmer))
    this.game.baseWorld.sand.addProductor(new Production(this.crabFarmer, new Decimal(-1)))

    const specialProduction = new Decimal(15)
    const specialCost = new Decimal(-4)
    const specialFood = new Decimal(1E7)
    const specialRes2 = new Decimal(1E4)

    //    Crab Scientist
    this.crabScientist.actions.push(new BuyAction(this.game,
      this.crabScientist,
      [
        new Cost(this.game.baseWorld.food, specialFood.div(5), this.game.buyExp),
        new Cost(this.game.baseWorld.sand, specialRes2.div(5), this.game.buyExp),
        new Cost(this.crab, new Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.crabScientist.actions.push(new UpAction(this.game, this.crabScientist,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3.times(1.5), this.game.upgradeScienceExp)]))
    this.crabScientist.actions.push(new UpHire(this.game, this.crabScientist,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3.times(1.5), this.game.upgradeScienceHireExp)]))

    this.game.baseWorld.science.addProductor(new Production(this.crabScientist, specialProduction.times(0.75)))
    this.game.baseWorld.sand.addProductor(new Production(this.crabScientist, specialCost))

    //    Crab Queen ?!
    //    Not sure if really exists
    this.crabQueen.actions.push(new BuyAndUnlockAction(this.game,
      this.crabQueen,
      [
        new Cost(this.game.baseWorld.food, new Decimal(1E5), this.game.buyExp),
        new Cost(this.crab, new Decimal(50), this.game.buyExpUnit)
      ], [this.crabNest]
    ))
    this.crabQueen.actions.push(new UpAction(this.game, this.crabQueen,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))
    this.crabQueen.actions.push(new UpHire(this.game, this.crabQueen,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceHireExp)]))
    this.crab.addProductor(new Production(this.crabQueen))

    //    Crab Nest
    this.crabNest.actions.push(new BuyAction(this.game,
      this.crabNest,
      [
        new Cost(this.game.baseWorld.food, this.game.baseWorld.prestigeFood.div(1.5), this.game.buyExp),
        new Cost(this.game.baseWorld.sand, this.game.baseWorld.prestigeOther1.times(2), this.game.buyExp),
        new Cost(this.crabQueen, new Decimal(250), this.game.buyExpUnit)
      ]
    ))
    this.crabNest.actions.push(new UpAction(this.game, this.crabNest,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))
    this.crabNest.actions.push(new UpHire(this.game, this.crabNest,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceHireExp)]))

    this.crabQueen.addProductor(new Production(this.crabNest))

    //    Shrimp
    this.shrimp.actions.push(new BuyAction(this.game,
      this.shrimp,
      [new Cost(this.game.baseWorld.food, new Decimal(3E3), this.game.buyExp)]
    ))
    this.shrimp.actions.push(new UpAction(this.game, this.shrimp,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.shrimp.actions.push(new UpHire(this.game, this.shrimp,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceHireExp)]))

    this.game.baseWorld.sand.addProductor(new Production(this.shrimp))
    this.game.baseWorld.crystal.addProductor(new Production(this.shrimp, new Decimal(0.5)))

    //    lobster
    const lobsterScience = this.game.scienceCost3.times(1.5)

    this.lobster.actions.push(new BuyAction(this.game,
      this.lobster,
      [
        new Cost(this.game.baseWorld.food, this.game.machines.price1.times(5000), this.game.buyExp),
        new Cost(this.game.baseWorld.sand, this.game.machines.price1.times(1.5), this.game.buyExp)
      ]
    ))
    this.lobster.actions.push(new UpAction(this.game, this.lobster,
      [new Cost(this.game.baseWorld.science, lobsterScience, this.game.upgradeScienceExp)]))
    this.lobster.actions.push(new UpHire(this.game, this.lobster,
      [new Cost(this.game.baseWorld.science, lobsterScience, this.game.upgradeScienceHireExp)]))

    this.game.baseWorld.sand.addProductor(new Production(this.lobster, this.game.machines.machineryProd.div(5)))
    this.game.baseWorld.crystal.addProductor(new Production(this.lobster, this.game.machines.machineryProd.div(10)))

    // Shark
    this.shark.actions.push(new BuyAction(this.game,
      this.shark,
      [
        new Cost(this.game.baseWorld.food, this.game.machines.price1.times(50000), this.game.buyExp),
        new Cost(this.game.baseWorld.crystal, this.game.machines.price1.times(10), this.game.buyExp)
      ]
    ))
    this.shark.actions.push(new UpAction(this.game, this.shark,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))
    this.shark.actions.push(new UpHire(this.game, this.shark,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceHireExp)]))

    this.game.baseWorld.food.addProductor(new Production(this.shark, this.game.machines.machineryProd.times(100)))
    this.game.baseWorld.crystal.addProductor(new Production(this.shark, this.game.machines.machineryProd.times(50)))

    // Shark 2
    this.shark2.actions.push(new BuyAction(this.game,
      this.shark2,
      [
        new Cost(this.game.baseWorld.food, this.game.machines.price1.times(500000), this.game.buyExp),
        new Cost(this.shark, new Decimal(100), this.game.buyExpUnit)
      ]
    ))
    this.shark2.actions.push(new UpAction(this.game, this.shark2,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))
    this.shark2.actions.push(new UpHire(this.game, this.shark2,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceHireExp)]))

    this.shark.addProductor(new Production(this.shark2))

  }
  addWorld() {

    World.worldTypes.push(
      new World(this.game, "Beach", "A beach",
        [this.game.machines.sandDigger, this.game.engineers.sandEnginer],
        [],
        [new Cost(this.game.beach.crabNest, new Decimal(50))],
        [],
        [],
        [[this.game.beach.seaRes, new Decimal(0)]],
        new Decimal(3)
      ))

    World.worldPrefix.push(
      new World(this.game, "Coastal", "",
        [this.game.machines.sandDigger, this.game.engineers.sandEnginer],
        [[this.game.baseWorld.sand, new Decimal(1.5)], [this.game.baseWorld.fungus, new Decimal(0.7)]],
        [new Cost(this.game.beach.crabNest, new Decimal(50))],
        [[this.game.baseWorld.fungus, new Decimal(0.7)]],
        [],
        [[this.game.beach.seaRes, new Decimal(0)]],
        new Decimal(3.5)
      ))

  }

}

