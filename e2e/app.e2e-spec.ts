import { IdleAntPage } from './app.po';

import { FilterUnlocked, UnitComponent } from '../src/app/unit/unit.component';
import { OptionsComponent } from '../src/app/options/options.component';
import { Unit } from '../src/app/model/units/unit';
import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Pipe } from '@angular/core';
import { ClarityModule } from "clarity-angular";
import { AppComponent } from '../src/app/app.component';
import { MainNavComponent } from '../src/app/main-nav/main-nav.component';
import { RouterModule, Routes } from '@angular/router';
import { TypeList } from '../src/app/model/typeList';
import * as numberformat from 'swarm-numberformat';
import { FormsModule } from '@angular/forms';
import { ActionComponent } from '../src/app/action/action.component';
import { PrestigeComponent } from '../src/app/prestige/prestige.component';
import {Format,FilterListNotEmpty,FilterMax } from  '../src/app/app.module';

describe('idle-ant App', () => {
  let page: IdleAntPage;

  beforeEach(() => {
    page = new IdleAntPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
