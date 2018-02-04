import { Component, OnInit, HostBinding } from '@angular/core';
import { GameService } from '../game.service';

declare let setCss: any

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})

export class UiComponent implements OnInit {
  @HostBinding('class.content-area') className = 'content-area'

  constructor(public gameService: GameService) {

  }

  ngOnInit() {
  }

  setCss() {
    setCss(this.gameService.game.options.dark)
  }

}
