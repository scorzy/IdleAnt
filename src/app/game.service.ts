import * as decimal from 'decimal.js';
import { GameModel } from './model/gameModel';
import { log } from 'util';
import { Logger } from 'jasmine-spec-reporter/built/display/logger';
import { Injectable, OnInit } from '@angular/core';


@Injectable()
export class GameService {

  game: GameModel;
  last: number;
  selectedGen: string;
  list: any
  interval = 1000 / 20

  constructor() {
    this.game = new GameModel()
    this.last = Date.now()
    const l = this.load()
    if (l)
      this.last = l

    // setInterval(this.update.bind(this), 1000 / 18)
    window.requestAnimationFrame(this.update.bind(this))
  }

  update() {
    const now = new Date().getTime()
    const delta = now - this.last
    if (delta > this.interval) {
      this.game.longUpdate(10 * (now - this.last))
      // this.game.longUpdate(now - this.last)
      this.last = now
    }
    window.requestAnimationFrame(this.update.bind(this))
  }

  clear() {
    localStorage.clear()
    this.game = new GameModel()
  }

  save() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('save', this.game.getSave())
    }
  }
  load(): number {
    if (typeof (Storage) !== 'undefined') {
      const saveRaw = localStorage.getItem('save')
      return this.game.load(saveRaw)
    }
  }

}
