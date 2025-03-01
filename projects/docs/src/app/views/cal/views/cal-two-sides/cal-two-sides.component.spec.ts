import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcCalModule } from '@k5cjs/cal';

import { CalTwoSidesComponent } from './cal-two-sides.component';
import { CalComponent } from './components';

describe('CalTwoSidesComponent', () => {
  let component: CalTwoSidesComponent;
  let fixture: ComponentFixture<CalTwoSidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalTwoSidesComponent, CalComponent],
      imports: [KcCalModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalTwoSidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
