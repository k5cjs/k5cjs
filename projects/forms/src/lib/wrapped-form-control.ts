import { Component, ViewChild } from '@angular/core';
import { ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({ template: `` })
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class WrappedFormControl implements ControlValueAccessor {
  @ViewChild(NG_VALUE_ACCESSOR, { static: true }) valueAccessor!: DefaultValueAccessor;

  writeValue(obj: unknown): void {
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && !this.valueAccessor)
      throw Error(`
        you don't have any provider for NG_VALUE_ACCESSOR in ${this.constructor.name}

          default control:
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
}
