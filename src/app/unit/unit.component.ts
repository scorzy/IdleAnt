import { ActionComponent } from '../action/action.component';
import { Action } from '../model/units/action';
import { Production } from '../model/production';
import { Cost } from '../model/cost';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Logger } from 'codelyzer/util/logger';
import { Component, OnDestroy, OnInit, Pipe, PipeTransform, OnChanges, AfterViewChecked } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Unit } from '../model/units/unit';
import * as numberformat from 'swarm-numberformat';
import * as moment from 'moment';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit, OnDestroy {

  mioId = "0";
  paramsSub: any;
  gen: Unit;

  constructor(public gameService: GameService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.gen = this.gameService.game.baseWorld.littleAnt
  }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      this.mioId = params['id'];
      if (this.mioId === undefined) {
        this.mioId = "food"
      }
      this.gen = this.gameService.game.unitMap.get(this.mioId)
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  showProducers(): boolean {
    return this.gen.producedBy.filter(t => t.unlocked && t.unit.unlocked).length > 0
  }



  endTime(): string {
    moment.locale('en');
    return moment.duration(this.gen.endIn).humanize()
  }
}

@Pipe({ name: 'filterUnlocked', pure: false })
export class FilterUnlocked implements PipeTransform {
  transform(items: Production[], filter: Object): any {
    return items.filter(item => item.unit.unlocked)
  }
}

@Pipe({ name: 'filterActive', pure: false })
export class FilterActive implements PipeTransform {
  transform(items: Production[], filter: Object): any {
    return items.filter(item => item.unlocked && item.unit.unlocked)
  }
}
