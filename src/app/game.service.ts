import * as decimal from 'decimal.js';
import { GameModel } from './model/gameModel';
import { log } from 'util';
import { Logger } from 'jasmine-spec-reporter/built/display/logger';
import { Injectable, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as moment from 'moment';

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
  isMainNav = true

  constructor(
    private router: Router,
    public toastr: ToastsManager
  ) {
    this.game = new GameModel()
    this.last = Date.now()
    const l = this.load(false)
    if (l)
      this.last = l

    this.game.isChanged = true

    setInterval(this.update.bind(this), this.interval)

    setInterval(this.checkUpgrades.bind(this), 1000)

    setInterval(this.save.bind(this), this.saveFreq)

    if (typeof kongregateAPI !== 'undefined') {
      kongregateAPI.loadAPI(() => {

        this.kongregate = kongregateAPI.getAPI();
        console.log("KongregateAPI Loaded");

        //  this.kongregate.services.resizeGame(1920, 1080)

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

    this.router.navigateByUrl('/main/unit/unit/G1')
  }

  update() {
    const now = new Date().getTime()
    const delta = now - this.last

    if (delta > this.interval) {
      if (delta > 1000)
        this.game.isChanged = true

      this.game.longUpdate(delta )

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
    if (this.isMainNav)
      this.game.reloadUpIcons()
  }

  clear() {
    this.game = null
    localStorage.clear()
    this.game = new GameModel()
    window.location.reload()
  }

  save(timer = true) {
    try {
      if (typeof (Storage) !== 'undefined') {
        const save = this.game.getSave()
        localStorage.setItem('save', save)
        console.log("Saved")
        if (!timer || !this.game.hideSaveNotification)
          this.toastr.success("", 'Game Saved')
      } else {
        this.toastr.warning("Canot access local storage", "Not saved")
      }
    } catch (ex) {
      this.toastr.error(ex && ex.message ? ex.message : "unknow error", "Saving Error")
    }
  }

  load(notify = true): number {
    try {
      if (typeof (Storage) !== 'undefined') {
        const saveRaw = localStorage.getItem('save')
        if (saveRaw) {
          const last = this.game.load(saveRaw)

          if (last) {
            if (notify)
              this.toastr.success("Idle time: " + moment.duration(Date.now() - last).humanize(), "Game Loaded")
            this.last = last
            return last
          } else {
            this.toastr.error("Cannot read your savegame", "Error")
          }

        } else {
          this.toastr.error("No savegame found", "Error")
        }

      } else {
        this.toastr.warning("Cannot access localstorage", "Not Loaded")
      }
    } catch (ex) {
      this.toastr.error(ex && ex.message ? ex.message : "unknow error", "Load Error")
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
