import * as decimal from 'decimal.js';
import { GameModel } from './model/gameModel';
import { log } from 'util';
import { Logger } from 'jasmine-spec-reporter/built/display/logger';
import { Injectable, OnInit } from '@angular/core';

declare let kongregate;

@Injectable()
export class GameService {

  game: GameModel;
  last: number;
  selectedGen: string;
  list: any
  interval = 1000 / 20
  saveFreq = 1000 * 3 * 60
  kongFreq = 1000 * 10 * 60

  kongregate: any

  constructor() {
    this.game = new GameModel()
    this.last = Date.now()
    const l = this.load()
    if (l)
      this.last = l

    this.game.isChanged = true
    // this.update()
    setInterval(this.update.bind(this), 1000 / 18)

    setInterval(this.save.bind(this), this.saveFreq)

    setTimeout(() => {
      try {
        this.initKong()
        this.sendKong()
        setInterval(this.sendKong.bind(this), this.kongFreq)
      } catch (e) {
        console.log("Error: " + e.message)
      }
    }, 15 * 1000)


  }

  update() {
    const now = new Date().getTime()
    const delta = now - this.last

    if (delta > this.interval) {
      this.game.longUpdate(1 * (now - this.last))
      this.last = now
    }
    // window.requestAnimationFrame(this.update.bind(this))
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


  initKong() {
    // this.kongregate = window.kongregateAPI.getAPI()
    // this.kongregate.services.connect()
    console.log("Connected to kong")
  }
  sendKong() {
    try {
      kongregate.stats.submit('Prestige', this.game.maxLevel.toNumber())
      console.log("Prestige sent: " + this.game.maxLevel.toNumber())
    } catch (e) {
      console.log("Error: " + e.message)
    }

  }

}
