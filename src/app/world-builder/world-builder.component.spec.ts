import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldBuilderComponent } from './world-builder.component';

describe('WorldBuilderComponent', () => {
  let component: WorldBuilderComponent;
  let fixture: ComponentFixture<WorldBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorldBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
