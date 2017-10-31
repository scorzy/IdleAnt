import { TypeList } from '../model/typeList';
import { Action } from '../model/units/action';
import { Production } from '../model/production';
import { Cost } from '../model/cost';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Logger } from 'codelyzer/util/logger';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnChanges,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Unit } from '../model/units/unit';
import * as numberformat from 'swarm-numberformat';
import { Base } from '../model/units/base';

declare let preventScroll

@Component({
  selector: 'app-unit',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy {
  @HostBinding('class.content-container') className = 'content-container';

  mioId = ""
  paramsSub: any
  gen: Unit
  list: Unit[] = this.gameService.game.baseWorld.list
  typeLists: TypeList[]
  showPrestige = false

  constructor(
    public gameService: GameService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.gen = this.gameService.game.baseWorld.list[0]
  }

  ngOnInit() {
    this.gameService.isMainNav = true
    this.gameService.game.reloadUpIcons()

    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      this.mioId = params['type']
      // console.log(this.mioId)
      if (this.mioId === "unit") {
        this.typeLists = this.gameService.game.lists
        // this.typeLists = this.gameService.game.unitLists
      } else {
        this.typeLists = this.gameService.game.prestige.expLists
      }
      this.showPrestige = this.mioId !== "unit"
      if (this.mioId === undefined) {
        this.mioId = "gen"
        return;
      }
    });

    preventScroll()
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.gameService.isMainNav = false
  }

  getListId(index, list: TypeList) {
    return list.getId()
  }
  getUnitId(index, base: Base) {
    return base.id
  }
}
