import { ScrollingModule } from '@angular/cdk/scrolling';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalScrollComponent } from './cal-scroll.component';
import { CalComponent } from './components';

describe('CalScrollComponent', () => {
  let component: CalScrollComponent;
  let fixture: ComponentFixture<CalScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalScrollComponent, CalComponent],
      imports: [FormsModule, ReactiveFormsModule, ScrollingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
