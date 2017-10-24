import * as decimal from 'decimal.js';
import { GameModel } from './model/gameModel';
import { log } from 'util';
import { Logger } from 'jasmine-spec-reporter/built/display/logger';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare let kongregateAPI;

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
  isKongregate = false

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

    if (typeof kongregateAPI !== 'undefined') {
      kongregateAPI.loadAPI(() => {

        this.kongregate = kongregateAPI.getAPI();
        console.log("KongregateAPI Loaded");

        setTimeout(() => {
          try {
            console.log("Kongregate build")
            this.sendKong()
            this.isKongregate = true
            setInterval(this.sendKong.bind(this), this.kongFreq)
          } catch (e) {
            console.log("Error: " + e.message)
          }
        }, 5 * 1000)

      })
    } else
      console.log("Github build")

    this.router.navigateByUrl('/')

  }

  update() {
    const now = new Date().getTime()
    const delta = now - this.last

    if (delta > this.interval) {
      this.game.longUpdate(1 * (now - this.last))

      this.game.prestige.time.quantity = Decimal.min(
        this.game.prestige.time.quantity.plus(
          this.game.prestige.timeMaker.quantity.times(0.1).times(delta / 1000)),
        this.game.prestige.timeBank.quantity.plus(4).times(3600))

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
      console.log("Saved")
    }
  }

  load(): number {
    if (typeof (Storage) !== 'undefined') {
      const saveRaw = localStorage.getItem('save')
      return this.game.load(saveRaw)
    }
  }

  nonInfinite(num: decimal.Decimal): number {
    const level = num.toNumber()
    return level < Number.POSITIVE_INFINITY && level < 137438953470 ? level : 0
  }

  sendKong() {
    try {
      this.kongregate.stats.submit('Prestige', this.nonInfinite(this.game.maxLevel))
      this.kongregate.stats.submit('Prestige2', this.nonInfinite(this.game.maxLevel))
      this.kongregate.stats.submit('World Done', this.nonInfinite(this.game.prestigeDone))
      console.log("Prestige sent: " + this.game.maxLevel.toNumber())
    } catch (e) {
      console.log("Error: " + e.message)
    }

  }

}
