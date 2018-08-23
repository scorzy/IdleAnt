import { Production } from "../model/production";
import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform
} from "@angular/core";
import { GameService } from "../game.service";
import { ActivatedRoute, Router } from "@angular/router";
import "rxjs/add/operator/switchMap";
import { Unit } from "../model/units/unit";
import * as moment from "moment";
import { Base } from "../model/units/base";

declare let preventScroll;

@Component({
  selector: "app-unit",
  templateUrl: "./unit.component.html",
  styleUrls: ["./unit.component.scss"]
})
export class UnitComponent implements OnInit, OnDestroy {
  @HostBinding("class.content-area")
  className = "content-area";
  mioId = "0";
  paramsSub: any;
  gen: Unit;

  constructor(
    public gameService: GameService,
    private activatedRoute: ActivatedRoute
  ) {
    this.gen = this.gameService.game.baseWorld.littleAnt;
  }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      this.mioId = params["id"];
      if (this.mioId === undefined) {
        this.mioId = "food";
      }
      this.gen = this.gameService.game.unitMap.get(this.mioId);
      this.gameService.game.activeUnit = this.gen;
    });
    setTimeout(preventScroll, 0);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.gameService.game.activeUnit = null;
  }

  showProducers(): boolean {
    return (
      this.gen.producedBy.filter(t => t.unlocked && t.unit.unlocked).length > 0
    );
  }

  endTime(): string {
    moment.locale("en");
    return moment.duration(this.gen.endIn).humanize();
  }
  getUnitId(base: Base) {
    return base.id;
  }

  onChange(): void {
    //  this.gameService.game.isChanged = true
  }
}

@Pipe({ name: "filterUnlocked", pure: false })
export class FilterUnlocked implements PipeTransform {
  transform(items: Production[], filter: Object): any {
    return items.filter(item => item.unit.unlocked);
  }
}

@Pipe({ name: "filterActive", pure: false })
export class FilterActive implements PipeTransform {
  transform(items: Production[], filter: Object): any {
    return items.filter(item => item.unlocked && item.unit.unlocked);
  }
}
