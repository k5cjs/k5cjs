import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalModule } from '@k5cjs/cal';

import { CalComponent } from './cal.component';

describe('CalComponent', () => {
  let component: CalComponent;
  let fixture: ComponentFixture<CalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalComponent],
      imports: [KcCalModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
