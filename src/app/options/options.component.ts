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

  constructor(private gameService: GameService) { }

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

  exportKong() {
    try {
      this.gameService.kongregate.sharedContent.save("save",
        this.gameService.game.getSave(),
        this.onKongSave.bind(this))
    } catch (e) {
      console.log("Error: " + e.message)
    }
  }
  importKong() {
    try {

    } catch (e) {
      console.log("Error: " + e.message)
    }
  }

  onKongSave(params: any) {
    if (params.success) {
      // The shared content was saved successfully.
      console.log("Content saved, id:" + params.id + ", name:" + params.name);
    } else {
      // The shared content was not saved.
      // The most likely cause of this is that the User dismissed the save dialog
      console.log("Content NOT saved");
    }
  }

}
