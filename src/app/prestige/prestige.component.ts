import { Cost } from '../model/cost';
import { ActivatedRoute, Router } from '@angular/router';
import { World } from '../model/world';
import { GameService } from '../game.service';
import { Component, OnInit, HostBinding } from '@angular/core';

declare let preventScroll

@Component({
  selector: 'app-prestige',
  templateUrl: './prestige.component.html',
  styleUrls: ['./prestige.component.scss']
})
export class PrestigeComponent implements OnInit {
  @HostBinding('class.content-container') className = 'content-container';

  constructor(
    public gameService: GameService,
    private router: Router) {
    this.gameService.game.skip = false
    gameService.game.setMaxLevel()
  }

  ngOnInit() {
    preventScroll()
  }
  skipWorld() { this.gameService.game.skip = true }
  getTitle() {
    if (this.gameService.game.skip)
      return "You are skipping this world!"
    else {
      if (!this.travelAv())
        return "You cannot go to a new world yet"
      else
        return "Here you can travel to a brave new world"
    }
  }
  travelAv(): boolean {

    if (this.gameService.game.skip)
      return true

    if (!this.gameService.game.research.prestigeResearch.owned())
      return false

    let currentPrice: Cost

    const size1 = this.gameService.game.world.toUnlock.length
    for (let i = 0; i < size1; i++) {
      currentPrice = this.gameService.game.world.toUnlock[i]
      if (currentPrice.basePrice.floor().greaterThan(currentPrice.unit.quantity.ceil())) {
        return false
      }

    }
    const size2 = this.gameService.game.world.toUnlockMax.length
    for (let i = 0; i < size2; i++) {
      currentPrice = this.gameService.game.world.toUnlockMax[i]
      if (currentPrice.basePrice.lessThan(currentPrice.unit.quantity))
        return false

    }
    return true
  }
  goTo(world: World) {
    world.goTo(this.gameService.game.skip)
    this.gameService.game.skip = false
    this.router.navigateByUrl('/')
  }
  change() {
    this.gameService.game.generateRandomWorld()
  }
}
