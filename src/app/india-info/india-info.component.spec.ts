import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiaInfoComponent } from './india-info.component';

describe('IndiaInfoComponent', () => {
  let component: IndiaInfoComponent;
  let fixture: ComponentFixture<IndiaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndiaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndiaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
