import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KC_CAL_SELECTOR, KcCal, KcCalSelector } from '@k5cjs/cal';

import { MonthComponent } from './month.component';

describe('MonthComponent', () => {
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthComponent],
      providers: [
        {
          provide: KC_CAL_SELECTOR,
          useClass: KcCalSelector,
        },
        KcCal,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.month = new Date();

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
