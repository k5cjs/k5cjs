import { ScrollingModule } from '@angular/cdk/scrolling';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCal } from '@k5cjs/cal';

import { CalComponent } from './cal.component';

describe('CalComponent', () => {
  let component: CalComponent;
  let fixture: ComponentFixture<CalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalComponent],
      providers: [KcCal],
      imports: [ScrollingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
