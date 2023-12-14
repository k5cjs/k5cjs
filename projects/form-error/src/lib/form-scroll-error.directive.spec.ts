import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { KcError } from './form-error.directive';
import { KcErrors } from './form-errors.directive';
import { KcScrollError } from './form-scroll-error.directive';
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" scrollToError>
      <kc-form-field class="field">
        <input formControlName="control1" kc-input placeholder="Test" />
        <div error kcErrors>
          <span *kcError="'required'; label: 'required'; let value">{{ value }}</span>
          <span *kcError="'email'">Please enter a valid email address</span>
        </div>
      </kc-form-field>
      <kc-form-field class="field">
        <input formControlName="control2" kc-input placeholder="Test" />
        <div error kcErrors>
          <span *kcError="'required'; label: 'required'; let value">{{ value }}</span>
          <span *kcError="'email'">Please enter a valid email address</span>
        </div>
      </kc-form-field>
      <button type="submit"></button>
    </form>
  `,
})
class TestComponent {
  form = new FormGroup({
    control1: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required.bind(Validators)],
    }),
    control2: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required.bind(Validators)],
    }),
  });

  submit() {
    return this.form.getRawValue();
  }
}

describe('KcScrollError', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveFormsModule, KcScrollError, KcFormField, KcInput, KcError, KcErrors],
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(testComponent).toBeTruthy();
  });

  it('should scroll to the first error element', fakeAsync(() => {
    const form = fixture.debugElement.query(By.directive(KcScrollError));
    const formElement = form.nativeElement as HTMLElement;
    const submitButton = formElement.querySelector('button');

    testComponent.form.get('control1')?.setErrors({ required: true });
    fixture.detectChanges();

    if (submitButton) {
      submitButton.click();
      tick();
      fixture.detectChanges();
    }

    const invalidElement = form.query(By.css('.ng-invalid'));
    expect(invalidElement).toBeTruthy();

    const scrollIntoViewSpy = spyOn(invalidElement.nativeElement, 'scrollIntoView');

    if (submitButton) {
      submitButton.click();
      tick();
      fixture.detectChanges();
    }

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
  }));

  it('should not focus when [focus] is false', fakeAsync(() => {
    const onSubmitSpy = spyOn(testComponent, 'submit').and.callThrough();

    const form = fixture.debugElement.query(By.directive(KcScrollError));
    const formElement = form.nativeElement as HTMLElement;
    const submitButton = formElement.querySelector('button');
    testComponent.form.get('control1')?.setErrors({ required: true });

    const directiveInstance = form.injector.get(KcScrollError);
    directiveInstance.focus = false;

    if (submitButton) {
      submitButton.click();
      tick();
    }

    expect(onSubmitSpy).toHaveBeenCalled();

    const invalidElement = formElement.querySelector('.ng-invalid');
    const focusSpy = spyOn(invalidElement, 'focus' as never);

    if (submitButton) {
      submitButton.click();
      tick();
    }

    expect(focusSpy).not.toHaveBeenCalled();
  }));
});
