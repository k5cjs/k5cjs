import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Provider,
  Renderer2,
  Type,
  forwardRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  COMPOSITION_BUFFER_MODE,
  DefaultValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  ValidationErrors,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

import { KcControlType } from './control.type';

export const kcControlProviders = <T>(component: Type<T>): Provider[] => [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true,
  },
  {
    provide: KcControl,
    useExisting: forwardRef(() => component),
  },
];

@Directive()
export abstract class KcControl<T = string, E extends HTMLElement = HTMLElement>
  extends DefaultValueAccessor
  implements OnInit, AfterViewInit, OnDestroy, KcControlType<T, E>
{
  @Input() id: string | undefined;
  @Input() placeholder: string | undefined;
  /**
   * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
   * needs to run change detection.
   */
  readonly stateChanges: Observable<void>;

  /** Gets the AbstractControlDirective for this control. */
  ngControl!: NgControl | AbstractControlDirective | null;

  elementRef: ElementRef<E>;

  // prettier-ignore
  get focused(): boolean { return this._focused; }
  // prettier-ignore
  set focused(value: boolean) { this._focused = value; }
  private _focused = false;

  // prettier-ignore
  get autofilled(): boolean { return this._autofilled; }
  // prettier-ignore
  set autofilled(value: boolean) { this._autofilled = value; }
  private _autofilled = false;

  get disabled(): boolean {
    return !!this.ngControl?.disabled;
  }

  protected _stateChanges: Subject<void>;

  protected _autofillMonitor: AutofillMonitor;
  protected _parentForm: NgForm | null;
  protected _parentFormGroup: FormGroupDirective | null;
  protected _injector: Injector;
  protected _ngZone: NgZone;

  private _destroy: Subject<void>;

  constructor() {
    const renderer = inject(Renderer2);
    const elementRef = inject<ElementRef<E>>(ElementRef);
    const compositionMode: boolean = inject(COMPOSITION_BUFFER_MODE, { optional: true }) || false;

    super(renderer, elementRef, compositionMode);

    this.elementRef = elementRef;

    this._autofillMonitor = inject(AutofillMonitor);
    this._parentForm = inject(NgForm, { optional: true });
    this._parentFormGroup = inject(FormGroupDirective, { optional: true });
    this._injector = inject(Injector);
    this._ngZone = inject(NgZone);

    this._destroy = new Subject();
    this._stateChanges = new Subject<void>();

    this.stateChanges = this._stateChanges.asObservable();
  }

  ngOnInit(): void {
    this.ngControl = this._injector.get(NgControl, null, { optional: true });

    if (this.ngControl && this.ngControl.control) {
      this._interceptMarkAsTouched(this.ngControl.control);

      this.ngControl.control.statusChanges.pipe(takeUntil(this._destroy)).subscribe(() => this._stateChanges.next());
    }

    if (this._parent) this._interceptNgSubmit(this._parent);
  }

  ngAfterViewInit(): void {
    this._autofillMonitor.monitor(this.elementRef.nativeElement).subscribe(({ isAutofilled }) => {
      this.autofilled = isAutofilled;
      this._stateChanges.next();
    });
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();

    this._destroy.next();
    this._destroy.complete();

    this._autofillMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  get value(): T | null {
    if (this.ngControl) return this.ngControl.value as T;

    return null;
  }

  disable(): void {
    throw new Error('Method not implemented.');
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  reset(): void {
    if (this.ngControl) this.ngControl.reset();
  }

  get errors(): ValidationErrors | null {
    return this.ngControl?.errors || null;
  }

  @HostListener('focus', ['true'])
  @HostListener('blur', ['false'])
  focusChanged(focused: boolean): void {
    if (focused === this.focused) return;

    this.focused = focused;
    this._stateChanges.next();
  }

  get invalid(): boolean {
    /**
     * If the control is not invalid, return false.
     */
    if (!this.ngControl?.invalid) return false;
    /**
     * if the control has been touched (focused) then we show the invalidity
     */
    if (this.ngControl.touched) return true;
    /**
     * if the parent form has been submitted, then we show the invalidity
     */
    return !!this._parent?.submitted;
  }

  get empty(): boolean {
    if (!this.ngControl) return true;

    const value: unknown = this.ngControl.value;
    /**
     * return true if the value is an array and the length is 0
     */
    if (Array.isArray(value)) return !value.length;

    if (typeof value === 'object' && value !== null) return !Object.keys(value).length;

    return !value;
  }
  /**
   * Gets the parent form to which this control belongs.
   * to be used in the validation process
   */
  protected get _parent(): FormGroupDirective | NgForm | null {
    return this._parentFormGroup || this._parentForm;
  }
  /**
   * intercepts the ngSubmit method of the form
   * to emit a state change when the form is submitted
   */
  private _interceptNgSubmit(form: FormGroupDirective | NgForm): void {
    const onSubmit = form.onSubmit.bind(form);

    form.onSubmit = (...args) => {
      void this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this._stateChanges.next()));

      return onSubmit(...args);
    };
  }
  /**
   * intercepts the markAsTouched method of the control
   * to emit a state change
   */
  private _interceptMarkAsTouched(control: AbstractControl): void {
    const tmpMarkAsTouched = control.markAsTouched.bind(control);

    control.markAsTouched = () => {
      void this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this._stateChanges.next()));

      return tmpMarkAsTouched();
    };
  }
}
