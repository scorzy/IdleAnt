import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Forest implements WorldInterface {

  larva: Unit
  beetle: Unit
  ambrosiaBeetle: Unit
  powderpostBeetle: Unit
  ladybird: Unit
  beetleNest: Unit
  beetleColony: Unit
  beetleResearch: Research
  listForest = new Array<Unit>()

  beetleCristalProduction: Production
  beetleSoilProduction: Production
  beetleWoodProduction: Production

  constructor(public game: GameModel) { }

  declareStuff() {
    this.listForest = new Array<Unit>()

    this.larva = new Unit(this.game, "larva", "Larva",
      "Larva is the juvenile form of many insect.")
    this.beetle = new Unit(this.game, "beetle", "Beetle",
      "Yield various resources.")
    this.ambrosiaBeetle = new Unit(this.game, "ambrosiaBeetle", "Ambrosia beetle",
      "Ambrosia beetle yield wood.")
    this.beetleNest = new Unit(this.game, "beetleNest", "Beetle Nest",
      "Beetle Nest yield larvae.")
    this.ladybird = new Unit(this.game, "ladybird", "Ladybird",
      "Ladybird yield science.")
    this.beetleColony = new Unit(this.game, "beetleColony", "Beetle Colony",
      "Beetle Colony yield nest.")
    this.powderpostBeetle = new Unit(this.game, "powder", "Powderpost Beetle",
      "Powderpost beetles are a group of woodboring beetles.")

    this.listForest.push(this.beetleColony)
    this.listForest.push(this.beetleNest)
    this.listForest.push(this.beetle)
    this.listForest.push(this.larva)
    this.listForest.push(this.powderpostBeetle)
    this.listForest.push(this.ambrosiaBeetle)
    this.listForest.push(this.ladybird)

    this.game.lists.push(new TypeList("Beetle", this.listForest))

    this.beetleWoodProduction = new Production(this.beetle, Decimal(0.8), false)
    this.beetleSoilProduction = new Production(this.beetle, Decimal(0.4), false)
    this.beetleCristalProduction = new Production(this.beetle, Decimal(0.2), false)

    const beetleWood = new Research("beetleWood", "Woodcutting training",
      "Beetle also produces wood",
      [new Cost(this.game.baseWorld.science, Decimal(100))],
      [this.beetleWoodProduction],
      this.game
    )
    const beetleSoil = new Research("beetleSoil", "Soil training",
      "Beetle also produces soil",
      [new Cost(this.game.baseWorld.science, Decimal(1E3))],
      [this.beetleSoilProduction],
      this.game
    )
    const beetleCristal = new Research("beetleCristal", "Mining training",
      "Beetle also produces cristal",
      [new Cost(this.game.baseWorld.science, Decimal(1E4))],
      [this.beetleCristalProduction],
      this.game
    )

    const advancedBeetle = new Research("advBeetle",
      "Advanced Beetle Jobs", "More beetle jobs",
      [new Cost(this.game.baseWorld.science, Decimal(3E3))],
      [this.ambrosiaBeetle, this.ladybird],
      this.game
    )
    this.beetleResearch = new Research("beetleRes",
      "Beetle", "Unlock Beetle",
      [new Cost(this.game.baseWorld.science, Decimal(600))],
      [this.larva, advancedBeetle, beetleWood, beetleSoil, beetleCristal],
      this.game
    )
    this.beetleResearch.avabileBaseWorld = false

  }
  initStuff() {

    this.game.baseWorld.food.addProductor(new Production(this.larva, Decimal(0.1)))

    this.game.baseWorld.food.addProductor(new Production(this.beetle))
    this.game.baseWorld.cristal.addProductor(this.beetleCristalProduction)
    this.game.baseWorld.soil.addProductor(this.beetleSoilProduction)
    this.game.baseWorld.wood.addProductor(this.beetleWoodProduction)

    this.game.baseWorld.science.addProductor(new Production(this.ladybird, Decimal(5)))

    this.game.baseWorld.fungus.addProductor(new Production(this.ambrosiaBeetle, Decimal(-6)))
    this.game.baseWorld.wood.addProductor(new Production(this.ambrosiaBeetle, Decimal(15)))

    this.beetle.addProductor(new Production(this.beetleNest, Decimal(0.01)))
    this.larva.addProductor(new Production(this.beetleNest))
    this.beetleNest.addProductor(new Production(this.beetleColony))

    this.game.baseWorld.food.addProductor(new Production(this.powderpostBeetle))
    this.game.baseWorld.wood.addProductor(new Production(this.powderpostBeetle))

    //    Larva
    this.larva.actions.push(new BuyAndUnlockAction(this.game,
      this.larva,
      [new Cost(this.game.baseWorld.food, Decimal(10), this.game.buyExp)],
      [this.beetle, this.powderpostBeetle]
    ))
    this.larva.actions.push(new UpAction(this.game, this.larva,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost1, this.game.upgradeScienceExp)]))
    this.larva.actions.push(new UpHire(this.game, this.larva,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost1, this.game.upgradeScienceExp)]))

    //    Beetle
    this.beetle.actions.push(new BuyAndUnlockAction(this.game,
      this.beetle,
      [
        new Cost(this.larva, Decimal(1), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.food, Decimal(2000), this.game.buyExp)
      ],
      [this.beetleNest]
    ))
    this.beetle.actions.push(new UpAction(this.game, this.beetle,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.beetle.actions.push(new UpHire(this.game, this.beetle,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))

    //    Beetle Nest
    this.beetleNest.actions.push(new BuyAndUnlockAction(this.game,
      this.beetleNest,
      [
        new Cost(this.beetle, Decimal(100), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.wood, Decimal(1E4), this.game.buyExp),
        new Cost(this.game.baseWorld.soil, Decimal(1E3), this.game.buyExp),
        new Cost(this.game.baseWorld.food, Decimal(1E3), this.game.buyExp)
      ],
      [this.beetleColony]
    ))
    this.beetleNest.actions.push(new UpAction(this.game, this.beetleNest,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))
    this.beetleNest.actions.push(new UpHire(this.game, this.beetleNest,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))

    //    Beetle Colony
    this.beetleColony.actions.push(new BuyAction(this.game,
      this.beetleColony,
      [
        new Cost(this.beetleNest, Decimal(200), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.food, Decimal(1E10), this.game.buyExp),
        new Cost(this.game.baseWorld.wood, Decimal(1E6), this.game.buyExp),
        new Cost(this.game.baseWorld.soil, Decimal(1E5), this.game.buyExp),
        new Cost(this.game.baseWorld.fungus, Decimal(5E4), this.game.buyExp),
      ]
    ))
    this.beetleColony.actions.push(new UpAction(this.game, this.beetleColony,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))
    this.beetleColony.actions.push(new UpHire(this.game, this.beetleColony,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost4, this.game.upgradeScienceExp)]))

    //    Lady Beetle
    this.ladybird.actions.push(new BuyAction(this.game,
      this.ladybird,
      [
        new Cost(this.larva, Decimal(1), this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, Decimal(1E4), this.game.buyExp),
        new Cost(this.game.baseWorld.food, Decimal(1E6), this.game.buyExp)
      ]
    ))
    this.ladybird.actions.push(new UpAction(this.game, this.ladybird,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))
    this.ladybird.actions.push(new UpHire(this.game, this.ladybird,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))


    //    Ambrosia Beetle
    this.ambrosiaBeetle.actions.push(new BuyAction(this.game,
      this.ambrosiaBeetle,
      [
        new Cost(this.larva, Decimal(1), this.game.buyExp),
        new Cost(this.game.baseWorld.fungus, Decimal(1E4), this.game.buyExp),
        new Cost(this.game.baseWorld.wood, Decimal(1E4), this.game.buyExp),
        new Cost(this.game.baseWorld.food, Decimal(1E7), this.game.buyExp)
      ]
    ))
    this.ambrosiaBeetle.actions.push(new UpAction(this.game, this.ambrosiaBeetle,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.ambrosiaBeetle.actions.push(new UpHire(this.game, this.ambrosiaBeetle,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))

    //    Powderpost
    this.powderpostBeetle.actions.push(new BuyAction(this.game,
      this.powderpostBeetle,
      [
        new Cost(this.larva, Decimal(1), this.game.buyExp),
        new Cost(this.game.baseWorld.wood, Decimal(1000), this.game.buyExp),
        new Cost(this.game.baseWorld.food, Decimal(5000), this.game.buyExp)
      ]
    ))
    this.powderpostBeetle.actions.push(new UpAction(this.game, this.powderpostBeetle,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.powderpostBeetle.actions.push(new UpHire(this.game, this.powderpostBeetle,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
  }

  addWorld() {

    World.worldTypes.push(
      new World(this.game, "Forest", "A forest",
        [
          this.game.engineers.woodEnginer, this.game.machines.loggingMachine,
          this.game.infestation.disinfestationBeetle, this.game.infestation.flametrowerBeetle
        ],
        [[this.game.baseWorld.wood, Decimal(2)]],
        [new Cost(this.beetleColony, Decimal(50))],
        [],
        [],
        [[this.beetleResearch, Decimal(0)]],
        Decimal(3.5)
      )
    )

    World.worldSuffix.push(
      new World(this.game, "Of Beetle", "",
        [
          this.game.infestation.disinfestationBeetle, this.game.infestation.flametrowerBeetle
        ],
        [
          [this.larva, Decimal(2)]
        ]
        ,
        [new Cost(this.beetleColony, Decimal(50))],
        [],
        [],
        [[this.beetleResearch, Decimal(0)]],
        Decimal(4)
      )
    )

  }
}
