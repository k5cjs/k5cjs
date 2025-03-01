import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { KcError, KcErrors } from '@k5cjs/form-error';
import { KcFormField } from '@k5cjs/form-field';
import { KcScrollError } from '@k5cjs/forms';
import { KcInput } from '@k5cjs/input';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [CommonModule, ReactiveFormsModule, KcFormField, KcInput, KcError, KcErrors, KcScrollError],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
