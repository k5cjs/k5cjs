import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcCalModule } from '@k5cjs/cal';

import { CalComponent } from './cal.component';

@Component({
  template: `
    <app-cal>
      <div *kc-cal-month="let month">{{ month }}</div>
    </app-cal>
  `,
})
class DummyComponent {}

describe('CalComponent', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalComponent, DummyComponent],
      imports: [KcCalModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
