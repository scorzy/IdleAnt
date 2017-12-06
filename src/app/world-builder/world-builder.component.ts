import { Component, OnInit, HostBinding } from '@angular/core';
import { World } from '../model/world';
import { GameService } from '../game.service';

@Component({
  selector: 'app-world-builder',
  templateUrl: './world-builder.component.html',
  styleUrls: ['./world-builder.component.scss']
})
export class WorldBuilderComponent implements OnInit {
  @HostBinding('class.content-area') className = 'content-area'

  level = 0
  world: World
  pre: World
  type: World
  suff: World

  preName: string
  typeName: string
  suffName: string

  World = World

  constructor(
    public gameService: GameService,
  ) {
    gameService.game.setMaxLevel()
    this.world = World.getRandomWorld(this.gameService.game)
  }

  ngOnInit() {
  }
  generate() {
    this.world = World.getRandomWorld(this.gameService.game, this.pre, this.type, this.suff, this.level)
  }

  setPre() {
    this.pre = World.worldPrefix.find(w => w.name === this.preName)
    this.generate()
  }
  setType() {
    this.type = World.worldTypes.find(w => w.name === this.typeName)
    this.generate()
  }
  setSuff() {
    this.suff = World.worldSuffix.find(w => w.name === this.suffName)
    this.generate()
  }
}
