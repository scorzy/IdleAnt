import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';

export class Machine implements WorldInterface {

  //    Machinery
  composterStation: Unit
  refineryStation: Unit
  laserStation: Unit
  hydroFarm: Unit
  plantingMachine: Unit

  mine: Unit
  sandDigger: Unit
  loggingMachine: Unit
  honeyMaker: Unit
  burningGlass: Unit
  iceCollector: Unit
  iceCompacter: Unit

  listMachinery = new Array<Unit>()

  constructor(public game: GameModel) { }

  public declareStuff() {
    this.composterStation = new Unit(this.game, "composterStation", "Composter Station", "Turn wood into soil")
    this.refineryStation = new Unit(this.game, "refineryStation", "Refinery Station", "Turn soil into sand")
    this.laserStation = new Unit(this.game, "laserStation", "Laser Station", "Yeld cristal")
    this.hydroFarm = new Unit(this.game, "hydroFarm", "Hydroponic Farm", "Yeld fungus")
    this.plantingMachine = new Unit(this.game, "plantingMac", "Planting Machine", "Yeld wood")
    this.sandDigger = new Unit(this.game, "sandDigger", "Sand Digger",
      "Yeld sand")
    this.loggingMachine = new Unit(this.game, "loggingMachine", "Logging Machine",
      "Yeld wood")
    this.mine = new Unit(this.game, "mine", "Mine",
      "Yeld cristal")
    this.honeyMaker = new Unit(this.game, "honeyMaker", "Honey Maker",
      "Automate the making of honey. Only bee know how it work.")
    this.iceCompacter = new Unit(this.game, "iceC", "Ice Compacter",
      "Ice Compacter is a machine that compact ice into crystall.")
    this.iceCollector = new Unit(this.game, "iceK", "Water Tank",
      "A tank of water.")
    this.burningGlass = new Unit(this.game, "burningGlass", "Burning Lens",
      "A large convex lens used to concentrate sun's rays. This machine melt ice faster than anything else.")
  }

  public initStuff() {
    this.listMachinery = new Array<Unit>()
    const machineryProd = Decimal(150)
    const machineryCost = Decimal(-10)

    const price1 = Decimal(1E5)
    const price2 = Decimal(6E4)
    const price3 = Decimal(3E4)

    //    Composter
    this.composterStation.types = [Type.Machinery]
    this.composterStation.actions.push(new BuyAction(this.game,
      this.composterStation,
      [
        new Cost(this.game.baseWorld.wood, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.fungus, price2, this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, price3, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.soil.addProductor(new Production(this.composterStation, machineryProd))
    this.game.baseWorld.wood.addProductor(new Production(this.composterStation, machineryCost))
    this.listMachinery.push(this.composterStation)

    //    Refinery
    this.refineryStation.types = [Type.Machinery]
    this.refineryStation.actions.push(new BuyAction(this.game,
      this.refineryStation,
      [
        new Cost(this.game.baseWorld.soil, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.wood, price2, this.game.buyExp),
        new Cost(this.game.baseWorld.fungus, price3, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.sand.addProductor(new Production(this.refineryStation, machineryProd))
    this.game.baseWorld.soil.addProductor(new Production(this.refineryStation, machineryCost))

    this.listMachinery.push(this.refineryStation)

    //    Laser
    this.laserStation.types = [Type.Machinery]
    this.laserStation.actions.push(new BuyAction(this.game,
      this.laserStation,
      [
        new Cost(this.game.baseWorld.sand, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.soil, price2, this.game.buyExp),
        new Cost(this.game.baseWorld.wood, price3, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.cristal.addProductor(new Production(this.laserStation, machineryProd))
    this.game.baseWorld.sand.addProductor(new Production(this.laserStation, machineryCost))

    this.listMachinery.push(this.laserStation)

    //    Hydroponic Farm
    this.hydroFarm.types = [Type.Machinery]
    this.hydroFarm.actions.push(new BuyAction(this.game,
      this.hydroFarm,
      [
        new Cost(this.game.baseWorld.cristal, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.sand, price2, this.game.buyExp),
        new Cost(this.game.baseWorld.soil, price3, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.fungus.addProductor(new Production(this.hydroFarm, machineryProd))
    this.game.baseWorld.cristal.addProductor(new Production(this.hydroFarm, machineryCost))
    this.listMachinery.push(this.hydroFarm)

    //    Planting Machine
    this.plantingMachine.types = [Type.Machinery]
    this.plantingMachine.actions.push(new BuyAction(this.game,
      this.plantingMachine,
      [
        new Cost(this.game.baseWorld.fungus, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, price2, this.game.buyExp),
        new Cost(this.game.baseWorld.sand, price3, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.wood.addProductor(new Production(this.plantingMachine, machineryProd))
    this.game.baseWorld.fungus.addProductor(new Production(this.plantingMachine, machineryCost))
    this.listMachinery.push(this.plantingMachine)


    //    Not always avaiable
    const machineryProd2 = machineryProd.div(2)

    //    Sand digger
    this.sandDigger.avabileBaseWorld = false
    this.sandDigger.types = [Type.Machinery]
    this.sandDigger.actions.push(new BuyAction(this.game,
      this.sandDigger,
      [
        new Cost(this.game.baseWorld.wood, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, price2, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.cristal.addProductor(new Production(this.sandDigger, machineryProd2))
    this.listMachinery.push(this.sandDigger)

    //    Wood
    this.loggingMachine.avabileBaseWorld = false
    this.loggingMachine.types = [Type.Machinery]
    this.loggingMachine.actions.push(new BuyAction(this.game,
      this.loggingMachine,
      [
        new Cost(this.game.baseWorld.wood, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, price2, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.wood.addProductor(new Production(this.loggingMachine, machineryProd2))
    this.listMachinery.push(this.loggingMachine)

    //    Mine
    this.mine.avabileBaseWorld = false
    this.mine.types = [Type.Machinery]
    this.mine.actions.push(new BuyAction(this.game,
      this.mine,
      [
        new Cost(this.game.baseWorld.wood, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.soil, price2, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.cristal.addProductor(new Production(this.mine, machineryProd2))
    this.listMachinery.push(this.mine)

    //    Honey
    this.honeyMaker.avabileBaseWorld = false
    this.honeyMaker.types = [Type.Machinery]
    this.honeyMaker.actions.push(new BuyAction(this.game,
      this.honeyMaker,
      [
        new Cost(this.game.baseWorld.nectar, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.honey, price2, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.honey.addProductor(new Production(this.honeyMaker, machineryProd))
    this.game.baseWorld.nectar.addProductor(new Production(this.honeyMaker, machineryCost))
    this.listMachinery.push(this.honeyMaker)

    //    Ice Compacter
    this.iceCompacter.avabileBaseWorld = false
    this.iceCompacter.types = [Type.Machinery]
    this.iceCompacter.actions.push(new BuyAction(this.game,
      this.iceCompacter,
      [
        new Cost(this.game.baseWorld.cristal, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.wood, price2, this.game.buyExp),
        new Cost(this.game.baseWorld.soil, price3, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.cristal.addProductor(new Production(this.iceCompacter, machineryProd))
    this.game.baseWorld.ice.addProductor(new Production(this.iceCompacter, machineryCost))
    this.listMachinery.push(this.iceCompacter)

    //    Ice Collector
    this.iceCollector.avabileBaseWorld = false
    this.iceCollector.types = [Type.Machinery]
    this.iceCollector.actions.push(new BuyAction(this.game,
      this.iceCollector,
      [
        new Cost(this.game.baseWorld.wood, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.soil, price2, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.cristal.addProductor(new Production(this.iceCollector, machineryProd2))
    this.listMachinery.push(this.iceCollector)

    //    Ice Burning Glass
    this.burningGlass.avabileBaseWorld = false
    this.burningGlass.types = [Type.Machinery]
    this.burningGlass.actions.push(new BuyAction(this.game,
      this.iceCollector,
      [
        new Cost(this.game.baseWorld.cristal, price1, this.game.buyExp),
        new Cost(this.game.baseWorld.wood, price2, this.game.buyExp)
      ]
    ))
    this.game.baseWorld.ice.addProductor(new Production(this.iceCollector, machineryProd2.times(10)))
    this.listMachinery.push(this.burningGlass)

    this.game.lists.push(new TypeList("Machinery", this.listMachinery))
  }

  public addWorld() {
  }
}
