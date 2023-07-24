import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalDaysNameComponent } from './kc-cal-days-name.component';

describe('KcCalDaysNameComponent', () => {
  let component: KcCalDaysNameComponent;
  let fixture: ComponentFixture<KcCalDaysNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalDaysNameComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcCalDaysNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
