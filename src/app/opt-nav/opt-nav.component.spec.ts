import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptNavComponent } from './opt-nav.component';

describe('OptNavComponent', () => {
  let component: OptNavComponent;
  let fixture: ComponentFixture<OptNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
