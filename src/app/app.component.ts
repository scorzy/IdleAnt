import { Action } from './model/units/action';
import { GameService } from './game.service';
import { Component, OnInit } from '@angular/core';
import { Prestige } from './model/worlds/prestige';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GameService]
})
export class AppComponent {

  constructor(
    public gameService: GameService
  ) { }

  opeTimeWarp() {
    this.gameService.game.timeModalOpened = true
    this.gameService.game.prestige.time.reloadAtcMaxBuy()
  }

  totTime(): string {
    moment.locale('en');
    return moment.duration(this.gameService.game.prestige.time.quantity.toNumber()).humanize()
  }

}

