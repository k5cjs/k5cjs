import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { KcError } from './form-error.directive';
import { KcErrors } from './form-errors.directive';

describe('KcErrors', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent],
      imports: [KcErrors, KcError, KcFormField, KcInput, FormsModule, ReactiveFormsModule],
      teardown: {
        destroyAfterEach: true,
      },
    });
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    void expect(component).toBeTruthy();
  });

  it('check if the errors are displayed if we hide the input and show it again', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.control.markAsTouched();
    component.control.updateValueAndValidity();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(compiled.querySelector('#error')?.textContent).toContain('required');

    component.show = false;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(compiled.querySelector('#error')).toBeNull();

    component.show = true;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(compiled.querySelector('#error')?.textContent).toContain('required');
  }));

  it('check that all errors are displayed', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.multiple = true;
    component.control.setValue('test', { emitEvent: false });

    component.control.markAsTouched();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('Please enter a valid email address');
    expect(all.item(1)?.textContent).toContain('required 7, entered 4');
  }));

  it('check that all errors are removed', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.multiple = true;
    component.control.setValue('test', { emitEvent: false });
    component.control.markAsTouched();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('Please enter a valid email address');
    expect(all.item(1)?.textContent).toContain('required 7, entered 4');

    component.control.setValue('test@test.com');

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(compiled.querySelector('#error')).toBeNull();
  }));

  it('check that all errors are removed with stagger', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.multiple = true;
    component.staggerTime = 150;
    component.control.setValue('test', { emitEvent: false });
    component.control.markAsTouched();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('Please enter a valid email address');
    expect(all.item(1)?.textContent).toContain('required 7, entered 4');

    component.control.setValue('test@test.com');

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(compiled.querySelector('#error')).toBeNull();
  }));

  it(`check that all errors are cleared with stagger async and
      that no other error has been added after clearing`, fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.multiple = true;
    component.staggerTime = 150;
    component.control.setValue('test', { emitEvent: false });
    component.control.markAsTouched();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    let all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('Please enter a valid email address');
    expect(all.item(1)?.textContent).toContain('required 7, entered 4');

    component.control.setValue('');

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('required');
  }));

  it('check if all errors are removed with stagger async and after some time a new one is added', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.multiple = true;
    component.staggerTime = 150;
    component.control.setValue('test', { emitEvent: false });
    component.control.markAsTouched();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('Please enter a valid email address');
    expect(all.item(1)?.textContent).toContain('required 7, entered 4');

    component.control.setValue('');

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(compiled.querySelector('#error')?.textContent).toContain('required');
  }));

  it('check that all errors are updated', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.multiple = true;
    component.staggerTime = 150;
    component.control.setValue('test', { emitEvent: false });
    component.control.markAsTouched();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    let all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('Please enter a valid email address');
    expect(all.item(1)?.textContent).toContain('required 7, entered 4');

    component.control.setValue('test-t');

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    all = compiled.querySelectorAll('#error');

    expect(all.item(0)?.textContent).toContain('Please enter a valid email address');
    expect(all.item(1)?.textContent).toContain('required 7, entered 6');
  }));

  it('check that only an error is displayed when you have more errors', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    component.control.setValue('test', { emitEvent: false });
    component.control.markAsTouched();

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(compiled.querySelector('#error')?.textContent).toContain('Please enter a valid email address');
  }));
});

@Component({
  template: `
    <kc-form-field *ngIf="show" class="field">
      <input [formControl]="control" kc-input />

      <div error kcErrors [multiple]="multiple" [staggerTime]="staggerTime">
        <span *kcError="'required'; label: 'required'; let value" id="error">{{ value }}</span>
        <span *kcError="'email'" id="error">Please enter a valid email address</span>
        <span *kcError="'minlength'; label: minLength; let value" id="error">{{ value }}</span>
      </div>
    </kc-form-field>
  `,
})
class DumpyComponent {
  show = true;
  multiple = false;
  staggerTime = 0;
  control = new FormControl<string | null>(null, [
    Validators.required.bind(Validators),
    Validators.email.bind(Validators),
    Validators.minLength(7),
  ]);

  minLength({ requiredLength, actualLength }: { requiredLength: number; actualLength: number }): string {
    return `required ${requiredLength}, entered ${actualLength}`;
  }
}
