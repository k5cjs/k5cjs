import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Provider,
  Renderer2,
  Type,
  forwardRef,
  inject,
} from '@angular/core';
import {
  AbstractControlDirective,
  COMPOSITION_BUFFER_MODE,
  DefaultValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export const kcControlValueAccessor = <T>(component: Type<T>): Provider => ({
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => component),
  multi: true,
});

@Directive()
export abstract class KcControl<T = string, E extends HTMLElement = HTMLElement>
  extends DefaultValueAccessor
  implements OnInit, AfterViewInit, OnDestroy
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

  /** Whether the control is focused. */
  focused = false;

  /** Whether the control is empty. */
  // readonly empty: boolean;

  /** Whether the control is required. */
  // readonly required: boolean;

  /** Whether the control is disabled. */
  readonly disabled: boolean = false;

  /** Whether the control is in an error state. */
  // readonly errorState: boolean;

  elementRef: ElementRef<E>;

  private _stateChanges: Subject<void>;

  protected _platform: Platform;
  protected _autofillMonitor: AutofillMonitor;
  protected _parentForm: NgForm | null;
  protected _parentFormGroup: FormGroupDirective | null;
  protected _injector: Injector;

  constructor() {
    const renderer = inject(Renderer2);
    const elementRef = inject<ElementRef<E>>(ElementRef);
    const compositionMode: boolean = inject(COMPOSITION_BUFFER_MODE, { optional: true }) || false;

    super(renderer, elementRef, compositionMode);

    this.elementRef = elementRef;

    this._platform = inject(Platform);
    this._autofillMonitor = inject(AutofillMonitor);
    this._parentForm = inject(NgForm, { optional: true });
    this._parentFormGroup = inject(FormGroupDirective, { optional: true });
    this._injector = inject(Injector);

    this._stateChanges = new Subject<void>();

    this.stateChanges = this._stateChanges.asObservable();
  }

  ngOnInit(): void {
    this.ngControl = this._injector.get(NgControl, null, { optional: true });
  }

  ngAfterViewInit(): void {
    if (this._platform.isBrowser)
      this._autofillMonitor.monitor(this.elementRef.nativeElement).subscribe(() => this._stateChanges.next());
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();

    if (this._platform.isBrowser) this._autofillMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  get value(): T | null {
    if (this.ngControl) return this.ngControl.value as T;

    return null;
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  reset(): void {
    throw new Error('Method not implemented.');
  }

  disable(): void {
    throw new Error('Method not implemented.');
  }

  get errors(): Record<string, unknown> | null {
    throw new Error('Method not implemented.');
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
  /**
   * Gets the parent form to which this control belongs.
   * to be used in the validation process
   */
  protected get _parent(): FormGroupDirective | NgForm | null {
    return this._parentFormGroup || this._parentForm;
  }
}
