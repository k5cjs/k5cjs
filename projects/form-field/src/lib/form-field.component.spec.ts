import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { KcInput } from '@k5cjs/input';

import { KcFormField } from './form-field.component';
import { KC_FORM_FIELD } from './form-field.token';

@Component({
  selector: 'kc-injector',
  template: `
    <div>Test</div>
  `,
})
class Dumpy2Component {
  constructor(@Inject(KC_FORM_FIELD) public formField: KcFormField) {}
}

@Component({
  template: `
    <kc-form-field class="field">
      <span *ngIf="label" label class="label">{{ label }}</span>

      <span *ngIf="placeholder" placeholder>{{ placeholder }}</span>

      <input [formControl]="control" kc-input [name]="name" tabindex="0" placeholder="" />

      <kc-injector after></kc-injector>
    </kc-form-field>
  `,
})
class DumpyComponent {
  @ViewChild(KcFormField, { static: true }) formField!: KcFormField;
  @ViewChild(Dumpy2Component, { static: true }) dumpy2!: Dumpy2Component;

  label = 'Username';
  placeholder = 'Username';

  control = new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true });
}

describe('KcFormField', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, FormsModule, KcFormField, KcInput],
      declarations: [DumpyComponent, Dumpy2Component],
      teardown: {
        destroyAfterEach: true,
      },
    }).compileComponents();

    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('disable state', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.formField.disabled).toBeFalse();
    expect(compiled.querySelector('kc-form-field')).not.toHaveClass('disabled');
    expect(window.getComputedStyle(compiled.querySelector('.control')!).opacity).toEqual('1');
    expect(window.getComputedStyle(compiled.querySelector('.control')!).cursor).toEqual('text');
    expect(component.formField.disabled).toBeFalse();

    component.control.disable();
    fixture.detectChanges();

    expect(component.formField.disabled).toBeTrue();
    expect(compiled.querySelector('kc-form-field')).toHaveClass('disabled');
    expect(window.getComputedStyle(compiled.querySelector('.control')!).opacity).toEqual('0.4');
    expect(window.getComputedStyle(compiled.querySelector('.control')!).cursor).toEqual('default');
    expect(component.formField.disabled).toBeTrue();
  });

  it('focus state', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const field = compiled.querySelector('kc-form-field')!;

    expect(component.formField.focused).toBeFalse();
    expect(field).not.toHaveClass('focus');

    compiled.querySelector('input')!.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(component.formField.focused).toBeTrue();
    expect(field).toHaveClass('focus');
  });

  it('focus from click', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const field = compiled.querySelector('kc-form-field')!;

    expect(component.formField.focused).toBeFalse();
    expect(field).not.toHaveClass('focus');

    const input = compiled.querySelector('input')!;

    spyOn(input, 'focus').and.callFake(() => {
      input.dispatchEvent(new Event('focus'));
    });

    field.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.formField.focused).toBeTrue();
    expect(field).toHaveClass('focus');
  });

  it('focus from method', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const field = compiled.querySelector('kc-form-field')!;

    expect(component.formField.focused).toBeFalse();
    expect(field).not.toHaveClass('focus');

    const input = compiled.querySelector('input')!;

    spyOn(input, 'focus').and.callFake(() => {
      input.dispatchEvent(new Event('focus'));
    });

    component.formField.focus();
    fixture.detectChanges();

    expect(component.formField.focused).toBeTrue();
    expect(field).toHaveClass('focus');
  });

  it('rest', () => {
    component.control.setValue('test');

    fixture.detectChanges();

    expect(component.control.value).toEqual('test');

    component.formField.reset();
    fixture.detectChanges();

    expect(component.control.value).toEqual('');
  });

  it('error', () => {
    component.control.setValue('test');

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const field = compiled.querySelector('kc-form-field')!;

    expect(component.formField.errors).toBeNull();
    expect(component.formField.invalid).toBeFalse();
    expect(field).not.toHaveClass('error');

    component.control.setValue('');
    component.control.markAsTouched();
    fixture.detectChanges();

    expect(component.formField.errors).toEqual({ required: true });
    expect(component.formField.invalid).toBeTrue();
    expect(field).toHaveClass('error');
  });

  it('autofilled', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const field = compiled.querySelector('kc-form-field')!;
    const input = compiled.querySelector('input')!;

    expect(component.formField.autofilled).toBeFalse();
    expect(field).not.toHaveClass('autofilled');

    const animation: AnimationEvent = new AnimationEvent('animationstart', {
      animationName: 'cdk-text-field-autofill-start',
    });

    input.dispatchEvent(animation);

    fixture.detectChanges();

    expect(component.formField.autofilled).toBeTrue();
    expect(field).toHaveClass('autofilled');
  });

  it('value', () => {
    fixture.detectChanges();

    expect(component.formField.value).toEqual('');

    component.control.setValue('test');
    fixture.detectChanges();

    expect(component.formField.value).toEqual('test');
  });

  it('tests unimplemented functions', () => {
    fixture.detectChanges();

    let expectError: unknown = null;

    try {
      component.formField.disable();
    } catch (error) {
      expectError = error;
    }

    expect(expectError).toEqual(new Error('Method not implemented.'));
  });

  it('provider', () => {
    fixture.detectChanges();

    expect(component.dumpy2.formField).toBeTruthy();
  });
});
