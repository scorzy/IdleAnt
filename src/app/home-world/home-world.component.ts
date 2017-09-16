import { GameService } from '../game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-world',
  templateUrl: './home-world.component.html',
  styleUrls: ['./home-world.component.scss']
})
export class HomeWorldComponent implements OnInit {

  constructor(
    public gameService: GameService
  ) {
  }

  ngOnInit() {
  }

}
