import { TypeList } from './model/typeList';
import { Action } from './model/units/action';
import { GameService } from './game.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Prestige } from './model/worlds/prestige';
import * as moment from 'moment';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GameService]
})
export class AppComponent {

  percentPreset = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
  minuteWarps = [1, 5, 10, 20, 30, 60, 90, 120, 240]

  constructor(
    public gameService: GameService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr)
  }

  opeTimeWarp() {
    this.gameService.game.timeModalOpened = true
    this.gameService.game.prestige.time.reloadAtcMaxBuy()
  }

  totTime(): string {
    moment.locale('en');
    return moment.duration(this.gameService.game.prestige.time.quantity.toNumber()).humanize()
  }

  all100() {
    this.gameService.game.all.forEach(u => u.percentage = 100)
    this.gameService.game.isChanged = true
  }

  warp(minute: number) {
    this.gameService.game.actMin.buy(new Decimal(minute))
  }
  warpAv(minute: number): boolean {
    return this.gameService.game.actMin.maxBuy.greaterThanOrEqualTo(new Decimal(minute))
  }

  getListId(index, list: TypeList) {
    return list.getId()
  }
  getClass() {
    return "header-" + this.gameService.game.options.header
  }
}

