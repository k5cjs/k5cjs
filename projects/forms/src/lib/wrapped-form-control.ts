import { ChangeDetectorRef, Directive, DoCheck, Injector, OnInit, ViewChild, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Directive()
export abstract class WrappedFormControl implements OnInit, DoCheck, ControlValueAccessor {
  @ViewChild(NG_VALUE_ACCESSOR, { static: true }) valueAccessor!: ControlValueAccessor;

  protected _ngControl!: NgControl | null;
  protected _injector: Injector;
  protected _cdr: ChangeDetectorRef;

  constructor() {
    this._injector = inject(Injector);
    this._cdr = inject(ChangeDetectorRef);
  }

  ngOnInit(): void {
    /**
     * WrappedFormControl it's used with provideValueAccessor
     */
    this._ngControl = this._injector.get(NgControl, null, { optional: true });
  }
  /**
   * ngDoCheck it's only triggered for the top-most component in the disabled branch,
   * not for every component in the disabled branch.
   * And because we wrap the control that works with ngDoCheck it will no longer be top-most
   * and then we have to call it manually
   */
  ngDoCheck(): void {
    this._cdr.markForCheck();
  }

  writeValue(obj: unknown): void {
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && !this.valueAccessor)
      throw Error(`
        you don't have any provider for NG_VALUE_ACCESSOR in ${this.constructor.name}

          default control:
            import { ReactiveFormsModule } from '@angular/forms';
            <input ngDefaultControl/>

          custom control:
            @Component({
              selector: 'app-custom-control',
              template: \`<input [(ngModel)]="value"/>\`,
              providers: [
                {
                  provide: NG_VALUE_ACCESSOR,
                  useExisting: forwardRef(() => CustomControlComponent),
                  multi: true
                },
              ],
              changeDetection: ChangeDetectionStrategy.OnPush,
            })
            export class CustomControlComponent implements ControlValueAccessor {
              onChange: any = () => {};
              onTouch: any = () => {}

              private _value: any;
              set value(val: any) {
                this._value = val;
              }
              get value(): any {
                return this._value;
              }

              writeValue(obj: any): void {
                this._value = obj;
              }

              registerOnChange(fn: any): void {
                this.onChange = fn;
              }

              registerOnTouched(fn: any): void {
                this.onTouch = fn;
              }
            }
      `);

    this.valueAccessor.writeValue(obj);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  registerOnChange(fn: (value: unknown) => {}): void {
    this.valueAccessor.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.valueAccessor.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.valueAccessor.setDisabledState?.(isDisabled);
  }
}
