import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalDayComponent } from './kc-cal-day.component';

describe('CalDayComponent', () => {
  let component: KcCalDayComponent;
  let fixture: ComponentFixture<KcCalDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalDayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcCalDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
