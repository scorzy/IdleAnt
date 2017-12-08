import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestigeNavComponent } from './prestige-nav.component';

describe('PrestigeNavComponent', () => {
  let component: PrestigeNavComponent;
  let fixture: ComponentFixture<PrestigeNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestigeNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestigeNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
