import * as decimal from 'decimal.js';
import { GameModel } from './model/gameModel';
import { log } from 'util';
import { Logger } from 'jasmine-spec-reporter/built/display/logger';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare let kongregate;

@Injectable()
export class GameService {

  game: GameModel;
  last: number;
  selectedGen: string;
  list: any
  interval = 1000 / 10
  saveFreq = 1000 * 3 * 60
  kongFreq = 1000 * 10 * 60

  isPaused = false

  kongregate: any

  constructor(
    private router: Router
  ) {
    this.game = new GameModel()
    this.last = Date.now()
    const l = this.load()
    if (l)
      this.last = l

    this.game.isChanged = true
    // this.update()
    setInterval(this.update.bind(this), this.interval)

    setInterval(this.checkUpgrades.bind(this), 1000)

    setInterval(this.save.bind(this), this.saveFreq)

    // setTimeout(() => {
    //   try {
    //     this.sendKong()
    //     setInterval(this.sendKong.bind(this), this.kongFreq)
    //   } catch (e) {
    //     console.log("Error: " + e.message)
    //   }
    // }, 15 * 1000)

    this.router.navigateByUrl('/')

  }

  update() {
    const now = new Date().getTime()
    const delta = now - this.last

    if (delta > this.interval) {
      this.game.longUpdate(1 * (now - this.last))
      this.last = now
    }
    this.game.postUpdate()
    // window.requestAnimationFrame(this.update.bind(this))
  }

  checkUpgrades() {
    this.game.reloadUpIcons()
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

  sendKong() {
    try {
      kongregate.stats.submit('Prestige', this.game.maxLevel.toNumber())
      console.log("Prestige sent: " + this.game.maxLevel.toNumber())
    } catch (e) {
      console.log("Error: " + e.message)
    }

  }

}
