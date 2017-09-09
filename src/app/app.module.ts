import { FilterUnlocked, UnitComponent } from './unit/unit.component';
import { OptionsComponent } from './options/options.component';
import { Unit } from './model/units/unit';
import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Pipe } from '@angular/core';
import { ClarityModule } from "clarity-angular";
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { RouterModule, Routes } from '@angular/router';
import { TypeList } from './model/typeList';
import * as numberformat from 'swarm-numberformat';
import { FormsModule } from '@angular/forms';
import { ActionComponent } from './action/action.component';
import { PrestigeComponent } from './prestige/prestige.component';
import { LabComponent } from './lab/lab.component';
import { ResPipePipe } from './res-pipe.pipe';

const appRoutes: Routes = [
  {
    path: '', redirectTo: "main/unit", pathMatch: 'full'
  },
  {
    path: 'main/:type', component: MainNavComponent,
    children: [
      { path: 'unit', component: UnitComponent },
      { path: 'unit/:id', component: UnitComponent }
    ]
  },
  {
    path: 'lab', component: LabComponent
  },
  {
    path: 'options', component: OptionsComponent
  },
  {
    path: 'prestige', component: PrestigeComponent
  }
];

@Pipe({ name: 'format' })
export class Format implements PipeTransform {
  public transform(value: decimal.Decimal, param: any): any {
    return (value.greaterThanOrEqualTo(0) ? "" : "-") + numberformat.formatShort(value.abs())
  }
}

@Pipe({ name: 'filterListNotEmpty', pure: false })
export class FilterListNotEmpty implements PipeTransform {
  public transform(value: Array<TypeList>, param: any): any {
    return value.filter(t => t.list.filter(l => l.unlocked).length > 0)
  }
}

@Pipe({ name: 'filterMax', pure: false })
export class FilterMax implements PipeTransform {
  public transform(values: Array<Unit>, filter: number): Array<Unit> {
    return values.filter(gen => gen.unlocked);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    UnitComponent,
    FilterListNotEmpty,
    Format,
    FilterMax,
    FilterUnlocked,
    FilterListNotEmpty,
    OptionsComponent,
    ActionComponent,
    PrestigeComponent,
    LabComponent,
    ResPipePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ClarityModule.forRoot(),
    [RouterModule],
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [ActionComponent]
})
export class AppModule { }

