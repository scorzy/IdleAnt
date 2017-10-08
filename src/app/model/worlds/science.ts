import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Type } from '../units/base';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Science implements WorldInterface {

  student: Unit
  scientist: Unit
  university: Unit

  listScience = Array<Unit>()

  studentProduction: Production
  scientistProduction: Production
  science1Production: Production
  science2Production: Production


  constructor(public game: GameModel) { }

  public declareStuff() {
    this.student = new Unit(this.game, "scn", "Student",
      "Student yield science.")
    this.student.types = [Type.Ant, Type.Scientist]

    this.scientist = new Unit(this.game, "scie2", "Scientist Ant",
      "Transform cristal into science.")

    this.university = new Unit(this.game, "univ", "University",
      "University yield science.")

    this.listScience = [this.student, this.scientist, this.university]
    this.game.lists.push(new TypeList("Science", this.listScience))

    this.studentProduction = new Production(this.university, Decimal(0.2), false)
    this.scientistProduction = new Production(this.university, Decimal(0.1), false)
    this.science1Production = new Production(this.university, Decimal(450))
    this.science2Production = new Production(this.university, Decimal(1000), false)
  }

  public initStuff() {

    this.game.baseWorld.science.addProductor(new Production(this.student))
    this.game.baseWorld.cristal.addProductor(new Production(this.student, Decimal(-0.5)))

    const specialProduction = Decimal(15)
    const specialCost = Decimal(-4)
    const specialFood = Decimal(1E7)
    const specialRes2 = Decimal(1E4)

    //    Student
    this.student.actions.push(new BuyAndUnlockAction(this.game,
      this.student,
      [
        new Cost(this.game.baseWorld.food, Decimal(1000), Decimal(this.game.buyExp)),
        new Cost(this.game.baseWorld.cristal, Decimal(100), Decimal(this.game.buyExp)),
        new Cost(this.game.baseWorld.littleAnt, Decimal(1), Decimal(this.game.buyExpUnit))
      ],
      [this.game.baseWorld.science]
    ))

    this.student.actions.push(new UpAction(this.game, this.student,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.student.actions.push(new UpHire(this.game, this.student,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceHireExp)]))

    //  Scientist
    this.scientist.types = [Type.Ant]
    this.scientist.actions.push(new BuyAction(this.game,
      this.scientist,
      [
        new Cost(this.game.baseWorld.food, specialFood.div(5), this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, specialRes2.div(5), this.game.buyExp),
        new Cost(this.game.baseWorld.littleAnt, Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.game.baseWorld.science.addProductor(new Production(this.scientist, specialProduction))
    this.game.baseWorld.cristal.addProductor(new Production(this.scientist, specialCost))

    this.scientist.actions.push(new UpAction(this.game, this.scientist,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))
    this.scientist.actions.push(new UpHire(this.game, this.scientist,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceHireExp)]))

    //  University
    this.university.actions.push(new BuyAction(this.game,
      this.university,
      [
        new Cost(this.game.baseWorld.wood, this.game.machines.price1.times(2), this.game.buyExp),
        new Cost(this.game.baseWorld.cristal, this.game.machines.price2.times(2), this.game.buyExp)
      ]
    ))
    this.game.baseWorld.science.addProductor(this.science1Production)
    this.game.baseWorld.science.addProductor(this.science2Production)

    this.game.baseWorld.cristal.addProductor(new Production(this.university, specialCost.times(10)))

    this.student.addProductor(this.studentProduction)
    this.scientist.addProductor(this.scientistProduction)
  }

  public addWorld() {
  }
}
