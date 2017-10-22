import { Event } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  stringSave = ""

  constructor(public gameService: GameService) { }

  ngOnInit() {
  }

  save(event: Event) { this.gameService.save() }
  load(event: Event) { this.gameService.load() }
  clear(event: Event) { this.gameService.clear() }

  export(event: Event) {
    this.stringSave = this.gameService.game.getSave()
  }

  import(event: Event) {
    this.gameService.game.load(this.stringSave)
  }

}
