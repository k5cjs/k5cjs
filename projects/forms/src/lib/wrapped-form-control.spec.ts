/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  ControlValueAccessor,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideValueAccessor } from './provide-value-accessor';
import { WrappedFormControl } from './wrapped-form-control';

@Component({
  selector: 'lib-input',
  template: `
    <input [(ngModel)]="value" />
    <span>{{ value }}</span>
  `,
  providers: [provideValueAccessor(InputComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class InputComponent implements ControlValueAccessor {
  set value(val: unknown) {
    this._value = val;
  }
  get value(): unknown {
    return this._value;
  }
  private _value!: unknown;

  onChange = () => {};
  onTouch = () => {};

  writeValue(obj: unknown): void {
    this._value = obj;
  }
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => {}): void {
    this.onTouch = fn;
  }
}

@Component({
  selector: 'lib-child',
  template: `
    <lib-input></lib-input>
  `,
  providers: [provideValueAccessor(ChildComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ChildComponent extends WrappedFormControl {}

@Component({
  selector: 'lib-parent',
  template: `
    <form [formGroup]="form">
      <lib-child formControlName="input"></lib-child>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ParentComponent {
  form: UntypedFormGroup;

  constructor(private _fb: UntypedFormBuilder) {
    this.form = this._fb.group({
      input: 'default',
    });
  }
}

@Component({
  selector: 'lib-error-child',
  template: `
    <span></span>
  `,
  providers: [provideValueAccessor(ErrorChildComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ErrorChildComponent extends WrappedFormControl {}

@Component({
  selector: 'lib-error-parent',
  template: `
    <form [formGroup]="form">
      <lib-error-child formControlName="input"></lib-error-child>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ErrorParentComponent {
  form: UntypedFormGroup;

  constructor(private _fb: UntypedFormBuilder) {
    this.form = this._fb.group({
      input: 'default',
    });
  }
}

describe('WrappedFormControl', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;
  let input: DebugElement;
  let inputNative: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParentComponent, ChildComponent, InputComponent, ErrorChildComponent, ErrorParentComponent],
      imports: [FormsModule, ReactiveFormsModule],
    })
      .overrideComponent(ParentComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .overrideComponent(ChildComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .overrideComponent(InputComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .overrideComponent(ErrorParentComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .overrideComponent(ErrorChildComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('default value', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    input = fixture.debugElement.query(By.directive(InputComponent))!;
    inputNative = input.nativeElement as HTMLElement;
    const span = inputNative.querySelector('span');

    expect(span?.textContent).toContain('default');
  }));

  it('patch value', fakeAsync(() => {
    component.form.patchValue({ input: 'test' });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    input = fixture.debugElement.query(By.directive(InputComponent))!;
    inputNative = input.nativeElement as HTMLElement;
    const span = inputNative.querySelector('span');
    expect(span?.textContent).toContain('test');
  }));

  it('error without component control', () => {
    fixture.detectChanges();
    const test = TestBed.createComponent(ErrorParentComponent);
    test.destroy = () => {};

    expect(() => test.detectChanges()).toThrowError(/ngDefaultControl/);
  });

  it('error without component control and show the class name for the component', () => {
    fixture.detectChanges();
    const test = TestBed.createComponent(ErrorParentComponent);
    test.destroy = () => {};

    expect(() => test.detectChanges()).toThrowError(/ErrorChildComponent/);
  });
});
