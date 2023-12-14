import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcError, KcErrors } from '@k5cjs/form-error';
import { KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { InputComponent } from './components';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormFieldComponent, InputComponent],
      imports: [FormsModule, ReactiveFormsModule, KcFormField, KcInput, KcErrors, KcError],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
