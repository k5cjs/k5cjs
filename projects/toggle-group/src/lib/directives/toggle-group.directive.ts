import { ContentChild, Directive, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { provideValueAccessor } from '@k5cjs/forms';

import { KcToggleOptions } from '../types';

import { KcToggleItemDirective } from './toggle-item.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[toggleGroup]',
  exportAs: 'toggleGroup',
  providers: [provideValueAccessor(KcToggleGroupDirective)],
})
export class KcToggleGroupDirective<T> implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: T) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouch: () => void = () => {};

  @Input() options: KcToggleOptions<T>[] = [];

  @ContentChild(KcToggleItemDirective, { static: true })
  toggleItem!: KcToggleItemDirective<T>;

  writeValue = (obj: T) => {
    this.select(obj, false);
  };

  registerOnChange = (fn: (value: T) => void) => {
    this._onChange = fn;
  };

  registerOnTouched = (fn: () => void) => {
    this._onTouch = fn;
  };

  select(value: T, emit = true) {
    this.toggleItem.viewContainerRef.clear();
    this.options.forEach((option) => {
      this.toggleItem.viewContainerRef.createEmbeddedView(this.toggleItem.templateRef, {
        $implicit: option,
        selected: option.value === value,
      });
    });
    if (emit) {
      this._onChange(value);
      this._onTouch();
    }
  }
}
