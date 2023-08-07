import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalModule } from '../../cal.module';

import { KcCalDayComponent } from './kc-cal-day.component';

describe('CalDay', () => {
  let component: KcCalDayComponent;
  let fixture: ComponentFixture<KcCalDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalDayComponent],
      imports: [KcCalModule],
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
