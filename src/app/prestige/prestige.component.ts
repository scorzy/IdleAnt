import { ActivatedRoute, Router } from '@angular/router';
import { World } from '../model/world';
import { GameService } from '../game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prestige',
  templateUrl: './prestige.component.html',
  styleUrls: ['./prestige.component.scss']
})
export class PrestigeComponent implements OnInit {

  constructor(
    public gameService: GameService,
    private router: Router) { }

  ngOnInit() {
  }

  travelAv(): boolean {
    try {
      if (this.gameService.game.world.toUnlock.find(c => c.unit.quantity.lessThan(c.basePrice)))
        return false
      else
        return true
    } catch (ex) { }
    return false
  }

  goTo(world: World) {
    world.goTo()
    this.router.navigateByUrl('/')
  }

  change(){
    this.gameService.game.generateRandomWorld()
  }
}
