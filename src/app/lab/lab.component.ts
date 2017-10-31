import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { GameService } from '../game.service';
import { Research } from '../model/units/action';

declare let preventScroll

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit, OnDestroy {
  @HostBinding('class.content-container') className = 'content-container';

  resDone = false

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.game.isLab = true

    preventScroll()
  }

  ngOnDestroy() {
    this.gameService.game.isLab = false
  }

  getRestId(index, res: Research) {
    return res.getId()
  }

}
