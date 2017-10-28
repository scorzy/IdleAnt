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

}

