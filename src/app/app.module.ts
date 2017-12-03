import { FilterUnlocked, UnitComponent, FilterActive } from './unit/unit.component';
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
import { HomeWorldComponent } from './home-world/home-world.component';
import { PricePipePipe } from './price-pipe.pipe';
import { ProdToglePipePipe } from './prod-togle-pipe.pipe';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastOptions } from 'ng2-toastr/src/toast-options';
import { OptNavComponent } from './opt-nav/opt-nav.component';
import { UiComponent } from './ui/ui.component';
import { CreditComponent } from './credit/credit.component';

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
    path: 'options', component: OptNavComponent,
    children: [
      { path: 'save', component: OptionsComponent },
      { path: 'ui', component: UiComponent },
      { path: 'credit', component: CreditComponent },
    ]
  },
  {
    path: 'prestige', component: PrestigeComponent
  },
  {
    path: 'world', component: HomeWorldComponent
  }
];

@Pipe({ name: 'format' })
export class Format implements PipeTransform {
  public transform(value: decimal.Decimal, short: boolean): any {

    return value.abs().lessThan(10) ? value.toNumber().toFixed(2).replace(/\.0+$/, '').replace(".", ",") :
      value.abs().lessThan(100) ? value.toNumber().toFixed(1).replace(/\.0+$/, '').replace(".", ",") :
        (value.greaterThanOrEqualTo(0) ? "" : "-") + numberformat.formatShort(value.abs())

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

export class CustomOptions extends ToastOptions {
  animate = 'fade'
  dismiss = 'auto'
  showCloseButton = true
  newestOnTop = true
  enableHTML = true
  positionClass = 'toast-bottom-right'
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
    ResPipePipe,
    HomeWorldComponent,
    FilterActive,
    PricePipePipe,
    ProdToglePipePipe,
    OptNavComponent,
    UiComponent,
    CreditComponent
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
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [{ provide: ToastOptions, useClass: CustomOptions }],
  bootstrap: [AppComponent],
  exports: [ActionComponent]
})
export class AppModule { }

