import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCal, KcCalSelector } from '../../services';
import { KC_CAL_SELECTOR } from '../../tokens';
import { KcCalDaysComponent } from '../kc-cal-days/kc-cal-days.component';

import { KcCalMonthComponent } from './kc-cal-month.component';

describe('KcCalMonthComponent', () => {
  let component: KcCalMonthComponent;
  let fixture: ComponentFixture<KcCalMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalMonthComponent, KcCalDaysComponent],
      providers: [
        {
          provide: KC_CAL_SELECTOR,
          useClass: KcCalSelector,
        },
        KcCal,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KcCalMonthComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.month = new Date();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
