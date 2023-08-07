import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalTwoSidesComponent } from './cal-two-sides.component';

describe('CalTwoSidesComponent', () => {
  let component: CalTwoSidesComponent;
  let fixture: ComponentFixture<CalTwoSidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalTwoSidesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalTwoSidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
