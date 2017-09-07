import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpDashComponent } from './exp-dash.component';

describe('ExpDashComponent', () => {
  let component: ExpDashComponent;
  let fixture: ComponentFixture<ExpDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
