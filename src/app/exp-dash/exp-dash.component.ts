import {GameService} from '../game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exp-dash',
  templateUrl: './exp-dash.component.html',
  styleUrls: ['./exp-dash.component.scss']
})
export class ExpDashComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit() {
  }

}
