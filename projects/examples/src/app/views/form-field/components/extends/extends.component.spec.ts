import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KcError, KcErrors } from '@k5cjs/form-error';
import { KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { ExtendsFormFieldComponent } from '../extends-form-field/extends-form-field.component';

import { ExtendsComponent } from './extends.component';

describe('ExtendsComponent', () => {
  let component: ExtendsComponent;
  let fixture: ComponentFixture<ExtendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtendsComponent, ExtendsFormFieldComponent],
      imports: [FormsModule, ReactiveFormsModule, KcFormField, KcInput, KcErrors, KcError, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
