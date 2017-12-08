import { Component, OnInit, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { World } from '../model/world';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldComponent implements OnInit {
  @HostBinding('class.card') card = 'card'

  @Input() world: World
  @Input() showKeep = false

  constructor(
    public gameService: GameService,
    private router: Router) { }

  ngOnInit() {
  }

  goTo(world: World) {
    world.goTo(this.gameService.game.skip)
    this.router.navigateByUrl('/')
  }

}
