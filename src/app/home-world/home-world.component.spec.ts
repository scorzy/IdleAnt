import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWorldComponent } from './home-world.component';

describe('HomeWorldComponent', () => {
  let component: HomeWorldComponent;
  let fixture: ComponentFixture<HomeWorldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeWorldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
