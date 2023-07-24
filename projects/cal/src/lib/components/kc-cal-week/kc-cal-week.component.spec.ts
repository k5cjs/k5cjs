import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalWeekComponent } from './kc-cal-week.component';

describe('KcCalWeekComponent', () => {
  let component: KcCalWeekComponent;
  let fixture: ComponentFixture<KcCalWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalWeekComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcCalWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
