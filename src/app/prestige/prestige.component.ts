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

  skip = false

  constructor(
    public gameService: GameService,
    private router: Router) { }

  ngOnInit() {
  }
  skipWorld() { this.skip = true }
  getTitle() {
    if (this.skip)
      return "You are skipping this world!"
    else {
      if (!this.travelAv())
        return "You cannot go to a new world yet"
      else
        return "Here you can travel to a brave new world"
    }
  }
  travelAv(): boolean {

    return this.skip || (this.gameService.game.research.prestigeResearch.owned() &&
      this.gameService.game.world.prestige.getBuyMax().greaterThan(0) &&
      (this.gameService.game.world.toUnlockMax.length === 0 ||
        !!this.gameService.game.world.toUnlockMax.find(tum => tum.basePrice.greaterThan(tum.unit.quantity))))



  }
  goTo(world: World) {
    world.goTo(this.skip)
    this.router.navigateByUrl('/')
  }
  change() {
    this.gameService.game.generateRandomWorld()
  }
}
