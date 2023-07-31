import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcError, KcErrors } from '@k5cjs/form-error';
import { KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { ExtendsFormFieldComponent } from './extends-form-field.component';

@Component({
  template: `
    <app-extends-form-field>
      <input kc-input name="name" tabindex="0" placeholder="" />

      <div error kcErrors>
        <span *kcError="'required'; label: 'required'; let value">{{ value }}</span>
        <span *kcError="'email'">Please enter a valid email address</span>
      </div>
    </app-extends-form-field>
  `,
})
class DumpyComponent {}

describe('ExtendsFormFieldComponent', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DumpyComponent, ExtendsFormFieldComponent],
      imports: [FormsModule, ReactiveFormsModule, KcFormField, KcInput, KcErrors, KcError],
    }).compileComponents();

    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
