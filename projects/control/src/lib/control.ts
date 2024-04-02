import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  DestroyRef,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { Observable, Subject, asapScheduler, observeOn } from 'rxjs';

import { KcControlType } from './control.type';

export type Parent = (FormGroupDirective | NgForm) & { _kcListeners?: Set<() => void> };

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

  protected _autofillMonitor = inject(AutofillMonitor);
  protected _parentForm = inject(NgForm, { optional: true });
  protected _parentFormGroup = inject(FormGroupDirective, { optional: true });
  protected _injector = inject(Injector);
  protected _ngZone = inject(NgZone);
  protected _destroy = inject(DestroyRef);

  protected _stateChanges = new Subject<void>();

  /**
   * @deprecated until host is removed from DefaultValueAccessor decorator
   * issue: https://github.com/angular/angular/issues/36563
   *
   * on touch is called from host decorator
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  override onTouched = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouchedNew = () => {};

  private _submitCallbackFn!: () => void;

  constructor() {
    const renderer = inject(Renderer2);
    const elementRef = inject<ElementRef<E>>(ElementRef);
    const compositionMode: boolean = inject(COMPOSITION_BUFFER_MODE, { optional: true }) || false;

    super(renderer, elementRef, compositionMode);

    this.elementRef = elementRef;

    this.stateChanges = this._stateChanges.asObservable();
  }

  ngOnInit(): void {
    this.ngControl = this._injector.get(NgControl, null, { optional: true });

    if (this.ngControl && this.ngControl.control) {
      this._interceptMarkAsTouched(this.ngControl.control);

      this.ngControl.control.statusChanges
        .pipe(
          /**
           * wait for the next tick to emit the state change
           * because for example formGroupDirective.submitted is updated
           * after the statusChanges is emitted
           */
          observeOn(asapScheduler),
          takeUntilDestroyed(this._destroy),
        )
        .subscribe(() => this._stateChanges.next());
    }

    this._submitCallbackFn = this._submitCallback.bind(this);

    this._addSubmitCallback();
  }

  ngAfterViewInit(): void {
    this._autofillMonitor
      .monitor(this.elementRef.nativeElement)
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(({ isAutofilled }) => {
        this.autofilled = isAutofilled;
        this._stateChanges.next();
      });
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();

    this._autofillMonitor.stopMonitoring(this.elementRef.nativeElement);

    this._removeSubmitCallback();
  }

  override registerOnTouched(fn: () => void): void {
    this.onTouchedNew = fn;
  }

  get value(): T | null {
    if (this.ngControl) return this.ngControl.value as T;

    return null;
  }

  enable(): void {
    this.setDisabledState(false);
  }

  disable(): void {
    this.setDisabledState(true);
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

  @HostListener('focus')
  protected _focus(): void {
    if (this.focused) return;

    this.focused = true;
    this._stateChanges.next();
  }

  @HostListener('blur')
  protected _blur(): void {
    this.focused = false;
    /**
     * when control is blurred, we mark it as touched
     */
    this.onTouchedNew();

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

  private _addSubmitCallback(): void {
    if (!this._parent) return;

    const parent = this._parent as Parent;

    parent._kcListeners ||= new Set();

    parent._kcListeners.add(this._submitCallbackFn);

    if (parent.onSubmit.name === 'onSubmit') {
      const submit = parent.onSubmit.bind(parent);

      parent.onSubmit = (...args) => {
        void this._ngZone.runOutsideAngular(() =>
          Promise.resolve().then(() => parent._kcListeners?.forEach((listener) => listener())),
        );
        return submit(...args);
      };
    }
  }

  private _removeSubmitCallback(): void {
    const parent = this._parent as Parent;

    parent?._kcListeners?.delete(this._submitCallbackFn);
  }

  private _submitCallback(): void {
    // emit a state change when the form is submitted
    this._stateChanges.next();
  }
}
