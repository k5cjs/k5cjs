import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalDaysComponent } from './kc-cal-days.component';

describe('KcCalDaysComponent', () => {
  let component: KcCalDaysComponent;
  let fixture: ComponentFixture<KcCalDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalDaysComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcCalDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
