import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class BaseWorld implements WorldInterface {

  //    Materials
  food: Unit
  cristal: Unit
  soil: Unit
  science: Unit
  fungus: Unit
  wood: Unit
  sand: Unit
  nectar: Unit
  honey: Unit
  ice: Unit
  listMaterial = Array<Unit>()

  //  Hunting
  hunter: Unit
  advancedHunter: Unit

  //    Tier 1
  geologist: Unit
  carpenter: Unit
  farmer: Unit
  lumberjack: Unit
  level1 = Array<Unit>()

  //    Tier 2
  composterAnt: Unit
  refineryAnt: Unit
  laserAnt: Unit
  hydroAnt: Unit
  planterAnt: Unit
  level2 = Array<Unit>()

  jobMaterial: Unit[][]

  listJobs = Array<Unit>()

  baseFood = Decimal(800)
  price2 = Decimal(100)

  specialProduction = Decimal(100)
  specialCost = Decimal(-40)
  specialFood = Decimal(1E7)
  specialRes2 = Decimal(1E4)

  //    Generators
  littleAnt: Unit
  queenAnt: Unit
  nestAnt: Unit
  list = Array<Unit>()

  constructor(public game: GameModel) { }

  declareStuff() {
    this.declareMaterials()
    this.declareGenerators()
    this.declareJobs()

    this.game.lists.push(new TypeList("Material", this.listMaterial))
    this.game.lists.push(new TypeList("Jobs", this.level1))
    this.game.lists.push(new TypeList("Advanced Jobs", this.level2))
    this.game.lists.push(new TypeList("Ants", this.list))
  }

  initStuff() {
    this.initGenerators()
    this.initJobs()
  }

  declareMaterials() {
    this.food = new Unit(this.game, "food", "Food", "Food is used to support almost all your units.")
    this.food.unlocked = true
    this.listMaterial.push(this.food)

    this.cristal = new Unit(this.game, "cri", "Cristal", "Cristals are needed to get science.")
    this.listMaterial.push(this.cristal)

    this.soil = new Unit(this.game, "soil", "Soil", "Soil is used to make nests.")
    this.listMaterial.push(this.soil)

    this.science = new Unit(this.game, "sci", "Science", "Science is used to improve and unlock stuff.")
    this.listMaterial.push(this.science)

    this.fungus = new Unit(this.game, "fun", "Fungus", "Fungus is a source of food.")
    this.listMaterial.push(this.fungus)

    this.wood = new Unit(this.game, "wood", "Wood", "Wood is used to make better nest and machinery.")
    this.listMaterial.push(this.wood)

    this.sand = new Unit(this.game, "sand", "Sand", "Sand can be used to make cristals.")
    this.listMaterial.push(this.sand)

    this.nectar = new Unit(this.game, "nectar", "Nectar", "Nectar is used to make honey.")
    this.listMaterial.push(this.nectar)

    this.honey = new Unit(this.game, "honey", "Honey", "Honey is the main resource for bees.")
    this.listMaterial.push(this.honey)

    this.ice = new Unit(this.game, "ice", "Ice",
      "Ice")
    this.listMaterial.push(this.ice)

    //    Fungus
    this.fungus.actions.push(new UpSpecial(this.game, this.fungus))

  }
  declareGenerators() {
    this.littleAnt = new Unit(this.game, "G1", "Ant",
      "Ant are the lowest class of worker. They continuously gather food.")
    this.queenAnt = new Unit(this.game, "G2", "Queen",
      "Queen proces ants")
    this.nestAnt = new Unit(this.game, "G3", "Nest",
      "Nest proces queen")
  }
  declareJobs() {
    this.geologist = new Unit(this.game, "geo", "Geologist", "Geologist yield cristal.")
    this.geologist.types = [Type.Ant, Type.Mining]
    this.listJobs.push(this.geologist)

    this.carpenter = new Unit(this.game, "car", "Carpenter", "carpenters yield soil.")
    this.carpenter.types = [Type.Ant, Type.SoilG]
    this.listJobs.push(this.carpenter)

    this.farmer = new Unit(this.game, "far", "Farmer", "Farmer yield fungus.")
    this.farmer.types = [Type.Ant, Type.Farmer]
    this.listJobs.push(this.farmer)

    this.lumberjack = new Unit(this.game, "lum", "Lumberjack", "Lumberjack yield wood.")
    this.lumberjack.types = [Type.Ant, Type.WoodG]
    this.listJobs.push(this.lumberjack)


    this.composterAnt = new Unit(this.game, "com", "Composter Ant",
      "Transform wood into soil.")
    this.refineryAnt = new Unit(this.game, "ref", "Refinery Ant",
      "Transform soil into sand.")
    this.laserAnt = new Unit(this.game, "las", "Laser Ant",
      "Transform sand into cristal.")
    this.hydroAnt = new Unit(this.game, "hydroFarmer", "Hydroponic Ant",
      "Transform cristal into fungus.")
    this.planterAnt = new Unit(this.game, "planterAnt", "Planter Ant",
      "Transform fungus into wood.")


    this.hunter = new Unit(this.game, "hunter", "Hunter",
      "Hunter yield food.")
    this.advancedHunter = new Unit(this.game, "advhunter", "Advanced Hunter",
      "Advanced Hunter yield food.")

    this.level1 = [this.geologist, this.farmer, this.carpenter, this.lumberjack, this.hunter, this.advancedHunter]

  }
  initGenerators() {
    this.list.push(this.littleAnt, this.queenAnt, this.nestAnt)
    this.list.forEach(ant => ant.types = [Type.Ant, Type.Generator])

    this.littleAnt.unlocked = true

    this.littleAnt.actions.push(new BuyAndUnlockAction(this.game,
      this.littleAnt,
      [new Cost(this.food, Decimal(15), Decimal(this.game.buyExp))],
      [this.queenAnt]
    ))

    this.queenAnt.actions.push(new BuyAndUnlockAction(this.game,
      this.queenAnt,
      [
        new Cost(this.food, Decimal(6E2), Decimal(this.game.buyExp)),
        new Cost(this.littleAnt, Decimal(15), Decimal(this.game.buyExpUnit))
      ],
      [this.nestAnt, this.geologist]
    ))

    this.nestAnt.actions.push(new BuyAction(this.game,
      this.nestAnt,
      [
        new Cost(this.food, Decimal(1E10), Decimal(this.game.buyExp)),
        new Cost(this.wood, Decimal(1E8), Decimal(this.game.buyExp)),
        new Cost(this.soil, Decimal(1E8), Decimal(this.game.buyExp)),
        new Cost(this.queenAnt, Decimal(1E3), Decimal(this.game.buyExpUnit))
      ],
    ))

    for (let i = 0; i < this.list.length - 1; i++)
      this.list[i].addProductor(new Production(this.list[i + 1]))

    for (let i = 0; i < this.list.length; i++) {
      this.list[i].actions.push(new UpAction(this.game, this.list[i],
        [new Cost(this.science, Decimal(Decimal(100).times(Decimal.pow(10, Decimal(i)))), this.game.upgradeScienceExp)]))
      this.list[i].actions.push(new UpHire(this.game, this.list[i],
        [new Cost(this.science, Decimal(Decimal(100).times(Decimal.pow(10, Decimal(i)))), this.game.upgradeScienceHireExp)]))
    }

    this.list = this.list.reverse()
  }
  initJobs() {
    //    Prices && Production
    this.food.addProductor(new Production(this.littleAnt, Decimal(1)))
    this.food.addProductor(new Production(this.fungus, Decimal(2)))
    this.fungus.addProductor(new Production(this.farmer))
    this.soil.addProductor(new Production(this.farmer, Decimal(-1)))
    this.cristal.addProductor(new Production(this.geologist, Decimal(0.2)))
    this.soil.addProductor(new Production(this.carpenter))
    this.wood.addProductor(new Production(this.lumberjack))

    this.food.addProductor(new Production(this.hunter, Decimal(10)))
    this.wood.addProductor(new Production(this.hunter, Decimal(-2)))

    this.food.addProductor(new Production(this.advancedHunter, Decimal(50)))
    this.wood.addProductor(new Production(this.advancedHunter, Decimal(-10)))
    this.cristal.addProductor(new Production(this.advancedHunter, Decimal(-5)))

    //    Geologist
    this.geologist.actions.push(new BuyAndUnlockAction(this.game,
      this.geologist,
      [
        new Cost(this.food, this.baseFood, this.game.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.game.buyExpUnit)
      ],
      [this.cristal, this.game.science.student]
    ))

    //    Carpenter
    this.carpenter.actions.push(new BuyAndUnlockAction(this.game,
      this.carpenter,
      [
        new Cost(this.food, this.baseFood, Decimal(this.game.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.game.buyExpUnit))
      ],
      [this.science]
    ))

    //    Lumberjack
    this.lumberjack.actions.push(new BuyAndUnlockAction(this.game,
      this.lumberjack,
      [
        new Cost(this.food, this.baseFood, Decimal(this.game.buyExp)),
        new Cost(this.soil, this.price2, Decimal(this.game.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.game.buyExpUnit)),
      ],
      [this.wood]
    ))

    //    Farmer
    this.farmer.actions.push(new BuyAndUnlockAction(this.game,
      this.farmer,
      [
        new Cost(this.food, this.baseFood, Decimal(this.game.buyExp)),
        new Cost(this.soil, this.price2, Decimal(this.game.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.game.buyExpUnit)),
      ],
      [this.fungus]
    ))

    //    Hunter
    this.hunter.actions.push(new BuyAction(this.game,
      this.hunter,
      [
        new Cost(this.food, this.baseFood.div(1.5), Decimal(this.game.buyExp)),
        new Cost(this.wood, this.price2.div(1.5), Decimal(this.game.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.game.buyExpUnit)),
      ]
    ))

    //    Hunter 2
    this.advancedHunter.actions.push(new BuyAction(this.game,
      this.advancedHunter,
      [
        new Cost(this.food, this.baseFood, Decimal(this.game.buyExp)),
        new Cost(this.wood, this.price2, Decimal(this.game.buyExp)),
        new Cost(this.cristal, this.price2.div(1.5), Decimal(this.game.buyExp)),
        new Cost(this.littleAnt, Decimal(1), Decimal(this.game.buyExpUnit)),
      ]
    ))

    this.level1.forEach(l => {
      l.actions.push(new UpAction(this.game, l,
        [new Cost(this.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
      l.actions.push(new UpHire(this.game, l,
        [new Cost(this.science, this.game.scienceCost2, this.game.upgradeScienceHireExp)]))
    })


    //
    //    Special
    //

    //  Composter
    this.composterAnt.types = [Type.Ant]
    this.level2.push(this.composterAnt)
    this.composterAnt.actions.push(new BuyAction(this.game,
      this.composterAnt,
      [
        new Cost(this.food, this.specialFood, this.game.buyExp),
        new Cost(this.wood, this.specialRes2, this.game.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.soil.addProductor(new Production(this.composterAnt, this.specialProduction))
    this.wood.addProductor(new Production(this.composterAnt, this.specialCost))

    //  Refinery
    this.refineryAnt.types = [Type.Ant]
    this.level2.push(this.refineryAnt)
    this.refineryAnt.actions.push(new BuyAction(this.game,
      this.refineryAnt,
      [
        new Cost(this.food, this.specialFood, this.game.buyExp),
        new Cost(this.soil, this.specialRes2, this.game.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.sand.addProductor(new Production(this.refineryAnt, this.specialProduction))
    this.soil.addProductor(new Production(this.refineryAnt, this.specialCost))

    //  Laser
    this.laserAnt.types = [Type.Ant]
    this.level2.push(this.laserAnt)
    this.laserAnt.actions.push(new BuyAction(this.game,
      this.laserAnt,
      [
        new Cost(this.food, this.specialFood, this.game.buyExp),
        new Cost(this.sand, this.specialRes2, this.game.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.cristal.addProductor(new Production(this.laserAnt, this.specialProduction))
    this.sand.addProductor(new Production(this.laserAnt, this.specialCost))

    //  Hydro
    this.hydroAnt.types = [Type.Ant]
    this.level2.push(this.hydroAnt)
    this.hydroAnt.actions.push(new BuyAction(this.game,
      this.hydroAnt,
      [
        new Cost(this.food, this.specialFood, this.game.buyExp),
        new Cost(this.cristal, this.specialRes2, this.game.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.fungus.addProductor(new Production(this.hydroAnt, this.specialProduction))
    this.cristal.addProductor(new Production(this.hydroAnt, this.specialCost))

    //  Planter
    this.planterAnt.types = [Type.Ant]
    this.level2.push(this.planterAnt)
    this.planterAnt.actions.push(new BuyAction(this.game,
      this.planterAnt,
      [
        new Cost(this.food, this.specialFood, this.game.buyExp),
        new Cost(this.fungus, this.specialRes2, this.game.buyExp),
        new Cost(this.littleAnt, Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.wood.addProductor(new Production(this.planterAnt, this.specialProduction))
    this.fungus.addProductor(new Production(this.planterAnt, this.specialCost))

    this.level2.forEach(l => {
      l.actions.push(new UpAction(this.game, l,
        [new Cost(this.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))
      l.actions.push(new UpHire(this.game, l,
        [new Cost(this.science, this.game.scienceCost3, this.game.upgradeScienceHireExp)]))
    })
  }
  addWorld() {

    World.worldTypes.push(
      new World(this.game, "Park", "",
        [],
        [],
        []
      ),
      new World(this.game, "Mine", "A mine",
        [this.game.machines.mine, this.game.engineers.mineEnginer],
        [
          [this.game.baseWorld.cristal, Decimal(1.2)],
          [this.game.baseWorld.wood, Decimal(0.8)],
          [this.game.baseWorld.fungus, Decimal(0.8)]
        ],
        []
      )
    )

    World.worldPrefix.push(
      new World(this.game, "", "", [], [], []),
      new World(this.game, "Hot", "",
        [],
        [[this.game.baseWorld.food, Decimal(2)]],
        []
      ),
      new World(this.game, "Arid", "",
        [],
        [[this.game.baseWorld.fungus, Decimal(0.5)]],
        []
      ),
      new World(this.game, "Wooded", "",
        [this.game.engineers.woodEnginer, this.game.machines.loggingMachine],
        [[this.game.baseWorld.wood, Decimal(2)]],
        []
      ),
      new World(this.game, "Crystallized", "",
        [this.game.machines.mine, this.game.engineers.mineEnginer],
        [
          [this.game.baseWorld.cristal, Decimal(1.5)],
          [this.game.baseWorld.food, Decimal(0.4)],
          [this.game.baseWorld.fungus, Decimal(0.4)]
        ],
        []
      ),
      new World(this.game, "Dying", "",
        [],
        [
          [this.food, Decimal(0.5)],
          [this.fungus, Decimal(0.5)],
          [this.wood, Decimal(0.5)],
          [this.honey, Decimal(0.5)],
          [this.nectar, Decimal(0.5)]
        ],
        [],
        [],
        [],
        [],
        Decimal(3.5)
      ),
      new World(this.game, "Rainy", "",
        [],
        [
          [this.wood, Decimal(1.5)],
          [this.fungus, Decimal(1.5)]
        ], []
      ),
      new World(this.game, "Foggy", "",
        [],
        [
          [this.wood, Decimal(0.7)],
          [this.fungus, Decimal(0.7)]
        ], []
      ),
      new World(this.game, "Technological", "",
        [],
        [
          [this.science, Decimal(1.5)]
        ], []
      ),
    )

    World.worldSuffix.push(

      new World(this.game, "", "", [], [], []),
      new World(this.game, "of Fungus", "",
        [],
        [[this.game.baseWorld.fungus, Decimal(2)]],
        [new Cost(this.game.baseWorld.fungus, Decimal(1000))]
      ),

      new World(this.game, "of Ant", "",
        [], [], [],
        [[this.littleAnt, Decimal(2)]]
      ),
      new World(this.game, "of Scientist", "",
        [], [], [],
        [[this.game.science.scientist, Decimal(2)]]
      ),
      new World(this.game, "of Farming", "",
        [], [], [],
        [[this.farmer, Decimal(2)]]
      ),
      new World(this.game, "of Cristall", "",
        [this.game.machines.mine, this.game.engineers.mineEnginer],
        [[this.cristal, Decimal(2)]],
        []
      ),

    )

  }
}
