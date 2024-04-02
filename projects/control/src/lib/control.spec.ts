import {
  Component,
  Directive,
  ElementRef,
  Injector,
  QueryList,
  ViewChild,
  ViewChildren,
  runInInjectionContext,
} from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';

import { KcControl, Parent, kcControlProviders } from './control';

@Directive({
  selector: '[kcControl]',
  providers: kcControlProviders(DumpyDirective),
})
class DumpyDirective extends KcControl {}

@Component({
  template: `
    <input #dir1 [formControl]="control" kcControl />
    <input #dir2 kcControl />

    <form [formGroup]="form" (ngSubmit)="ngSubmit()">
      <input #dir3 formControlName="control" kcControl />

      <button #submit type="submit">Submit</button>
    </form>
  `,
})
class DumpyComponent {
  @ViewChild('dir1', { read: DumpyDirective }) dir1!: DumpyDirective;
  @ViewChild('dir2', { read: DumpyDirective }) dir2!: DumpyDirective;
  @ViewChild('dir3', { read: DumpyDirective }) dir3!: DumpyDirective;

  @ViewChildren(KcControl) controls!: QueryList<KcControl>;

  @ViewChild('submit') submit!: ElementRef<HTMLButtonElement>;

  control = new FormControl<string | string[] | Record<PropertyKey, unknown>>('', {
    validators: Validators.required.bind(Validators),
    nonNullable: true,
  });

  form = new FormGroup({
    control: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
  });

  ngSubmit(): void {
    return;
  }
}

describe('InputDirective', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent, DumpyDirective],
      imports: [FormsModule, ReactiveFormsModule],
      teardown: {
        destroyAfterEach: true,
      },
    });
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
    injector = fixture.componentRef.injector;
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('check have same value as control', () => {
    component.control.setValue('test');

    fixture.detectChanges();

    expect(component.dir1.value).toEqual('test');
  });

  it('prevent throw error when form control is not defined', () => {
    component.control.setValue('test');

    fixture.detectChanges();

    expect(component.dir2.value).toBeNull();
  });

  it('check if input is invalid when form is submitted', () => {
    fixture.detectChanges();

    expect(component.dir3.invalid).toBeFalse();

    component.submit.nativeElement.click();

    expect(component.dir3.invalid).toBeTrue();
  });

  it('check if input is invalid when control is touched', () => {
    fixture.detectChanges();

    expect(component.dir1.invalid).toBeFalse();

    component.control.markAsTouched();

    expect(component.dir1.invalid).toBeTrue();
  });

  it('check if input is valid', () => {
    fixture.detectChanges();

    expect(component.dir1.invalid).toBeFalse();

    component.control.setValue('test');

    expect(component.dir1.invalid).toBeFalse();
  });

  it('check if control is disabled', () => {
    fixture.detectChanges();

    component.control.disable();

    expect(component.dir1.disabled).toBeTrue();
  });

  it('check focus from control', () => {
    fixture.detectChanges();

    const focus = spyOn(component.dir1.elementRef.nativeElement, 'focus');

    component.dir1.focus();

    expect(focus).toHaveBeenCalled();
  });

  it('check focus from input', () => {
    fixture.detectChanges();

    const input = component.dir1.elementRef.nativeElement;
    const event = new Event('focus', { bubbles: true });

    input.dispatchEvent(event);

    expect(component.dir1.focused).toBeTrue();
  });

  it('check reset method', fakeAsync(() => {
    component.control.setValue('test');

    fixture.detectChanges();

    expect(component.dir1.value).toEqual('test');

    component.dir1.reset();

    expect(component.dir1.value).toEqual('');
  }));

  it('check errors', () => {
    component.control.markAsTouched();

    fixture.detectChanges();

    expect(component.dir1.errors).toEqual({ required: true });
  });

  it('check errors', () => {
    fixture.detectChanges();

    expect(component.dir2.errors).toBeNull();
  });

  it('check autofill', () => {
    fixture.detectChanges();

    const spy = jasmine.createSpy('autofillStream');

    component.dir1.stateChanges.subscribe({ next: spy });

    const input = component.dir1.elementRef.nativeElement;

    const animation: AnimationEvent = new AnimationEvent('animationstart', {
      animationName: 'cdk-text-field-autofill-start',
    });

    input.dispatchEvent(animation);

    expect(spy).toHaveBeenCalled();
  });

  it('check autofill test autofilled', () => {
    fixture.detectChanges();

    const input = component.dir1.elementRef.nativeElement;

    const animation: AnimationEvent = new AnimationEvent('animationstart', {
      animationName: 'cdk-text-field-autofill-start',
    });

    input.dispatchEvent(animation);

    expect(component.dir1.autofilled).toBeTrue();
  });

  it('skip emit one more event if input is focused', () => {
    fixture.detectChanges();

    const input = component.dir1.elementRef.nativeElement;
    const event = new Event('focus', { bubbles: true });

    let test = 0;

    component.dir1.stateChanges.pipe(take(2)).subscribe(() => (test += 1));

    input.dispatchEvent(event);
    input.dispatchEvent(event);

    expect(test).toEqual(1);
  });

  it('check providers', () => {
    fixture.detectChanges();

    expect(component.controls.length).toEqual(3);
  });

  it('check is empty', () => {
    fixture.detectChanges();

    expect(component.dir1.empty).toBeTrue();
  });

  it('check is empty array', () => {
    fixture.detectChanges();

    component.control.setValue([]);

    expect(component.dir1.empty).toBeTrue();
  });

  it('check is empty object', () => {
    fixture.detectChanges();

    component.control.setValue({});

    expect(component.dir1.empty).toBeTrue();
  });

  it('check is empty control', () => {
    fixture.detectChanges();

    expect(component.dir2.empty).toBeTrue();
  });

  it('check default functions for onTouched and onTouchedNew', () => {
    runInInjectionContext(injector, () => {
      const control = new DumpyDirective();

      expect(control.onTouched()).toEqual(undefined);
      expect(control.onTouchedNew()).toEqual(undefined);
    });
  });

  it('should call submit cb functions', fakeAsync(() => {
    fixture.detectChanges();
    const parent1 = component.dir1['_parent'];
    const parent3 = component.dir3['_parent'] as Parent;
    const spyObj = {
      cb: () => {
        //
      },
    };
    const spyCb = spyOn(spyObj, 'cb');
    parent3._kcListeners?.add(spyObj.cb);

    expect(parent1).toEqual(null);
    expect(parent3._kcListeners?.size).toEqual(2);

    component.submit.nativeElement.click();
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(spyCb).toHaveBeenCalled();
  }));

  it('should remove cb on destory', () => {
    fixture.detectChanges();
    const parent3 = component.dir3['_parent'] as Parent;

    expect(parent3._kcListeners?.size).toEqual(1);

    component.dir3.ngOnDestroy();
    expect(parent3._kcListeners?.size).toEqual(0);
  });
});
