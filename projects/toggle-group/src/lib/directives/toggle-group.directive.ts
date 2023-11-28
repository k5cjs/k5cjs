import { ContentChild, Directive, Input, OnChanges } from '@angular/core';
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
export class KcToggleGroupDirective<T> implements OnChanges, ControlValueAccessor {
  @Input() options: KcToggleOptions<T>[] = [];

  @ContentChild(KcToggleItemDirective, { static: true }) toggleItem!: KcToggleItemDirective<T>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: T) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouch: () => void = () => {};

  private _value!: T;

  ngOnChanges(): void {
    this.select(this._value, false);
  }

  writeValue = (obj: T) => {
    this._value = obj;
    this.select(obj, false);
  };

  registerOnChange = (fn: (value: T) => void) => {
    this._onChange = fn;
  };

  registerOnTouched = (fn: () => void) => {
    this._onTouch = fn;
  };

  select(obj: T, emit = true) {
    this._value = obj;

    this.toggleItem.viewContainerRef.clear();

    this.options.forEach((option) =>
      this.toggleItem.viewContainerRef.createEmbeddedView(this.toggleItem.templateRef, {
        $implicit: option,
        selected: option.value === this._value,
      }),
    );

    if (!emit) return;

    this._onChange(obj);
    this._onTouch();
  }
}
