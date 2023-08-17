import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCal, KcCalSelector } from '../../services';
import { KC_CAL_SELECTOR } from '../../tokens';

import { KcCalWeekComponent } from './kc-cal-week.component';

describe('KcCalWeekComponent', () => {
  let component: KcCalWeekComponent;
  let fixture: ComponentFixture<KcCalWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalWeekComponent],
      providers: [
        {
          provide: KC_CAL_SELECTOR,
          useClass: KcCalSelector,
        },
        KcCal,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcCalWeekComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.week = { days: [{ date: new Date() }] };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
