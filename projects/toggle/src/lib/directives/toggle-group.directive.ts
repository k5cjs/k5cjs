import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ContentChild, DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor } from '@angular/forms';

import { provideValueAccessor } from '@k5cjs/forms';
import { MapEmit } from '@k5cjs/selection-model';

import { KcToggleOptions } from '../types';

import { KcToggleItemDirective } from './toggle-item.directive';

@Directive({
  selector: '[kcToggleGroup], [toggleGroup]',
  exportAs: 'toggleGroup',
  providers: [provideValueAccessor(KcToggleGroupDirective)],
})
export class KcToggleGroupDirective<T> implements OnInit, ControlValueAccessor {
  @Input() options: KcToggleOptions<T>[] = [];
  @Input({ transform: coerceBooleanProperty }) multiple = false;

  @ContentChild(KcToggleItemDirective, { static: true }) toggleItem!: KcToggleItemDirective<T>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: T | T[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouch: () => void = () => {};

  private _values!: MapEmit<T, T, boolean>;

  private _destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this._values = new MapEmit<T, T, boolean>(this.multiple);

    this._values.changed.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.toggleItem.viewContainerRef.clear();

      this.options.forEach((option) => {
        this.toggleItem.viewContainerRef.createEmbeddedView(this.toggleItem.templateRef, {
          $implicit: option,
          selected: this._values.has(option.value),
        });
      });
    });
  }

  // TODO: implement overload for type by multiple
  writeValue = (value: T | T[]) => {
    if (ngDevMode && Array.isArray(value) && !this.multiple)
      throw new Error('Cannot set multiple values to a single toggle group.');

    this._values.clear({ emitEvent: false });

    const values: [T, T][] = Array.isArray(value) ? value.map((value) => [value, value]) : [[value, value]];

    this._values.set(values);
  };

  registerOnChange = (fn: (value: T | T[]) => void) => {
    this._onChange = fn;
  };

  registerOnTouched = (fn: () => void) => {
    this._onTouch = fn;
  };

  select(obj: T) {
    this._values.toggle(obj, obj);

    this._onChange(this._values.selected!);
    this._onTouch();
  }
}
