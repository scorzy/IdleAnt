import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitComponent } from './unit.component';

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
import {Format,FilterListNotEmpty,FilterMax } from  '../app.module';

describe('UnitComponent', () => {
  let component: UnitComponent;
  let fixture: ComponentFixture<UnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnitComponent,Format]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
