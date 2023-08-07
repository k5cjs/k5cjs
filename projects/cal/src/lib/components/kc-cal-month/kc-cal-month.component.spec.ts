import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalMonthComponent } from './kc-cal-month.component';

describe('CalMonthComponent', () => {
  let component: KcCalMonthComponent;
  let fixture: ComponentFixture<KcCalMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalMonthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KcCalMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
