import { GameService } from '../game.service';
import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'app-home-world',
  templateUrl: './home-world.component.html',
  styleUrls: ['./home-world.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeWorldComponent implements OnInit {
  @HostBinding('class.content-container') className = 'content-container';
  constructor(
    public gameService: GameService
  ) {
  }

  ngOnInit() {
  }

}
