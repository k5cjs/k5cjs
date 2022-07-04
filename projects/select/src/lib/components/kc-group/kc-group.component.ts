import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  OnInit,
  QueryList,
  SkipSelf,
  forwardRef,
} from '@angular/core';

import { MapEmit } from '@k5cjs/selection-model';

import { KcGroupDirective, KcOptionsDirective } from '../../directives';
import { KC_SELECTION, KC_VALUE } from '../../tokens';
import { KcGroup, KcOption, KcOptionGroupValue, KcOptionSelection, KcOptionValue, OptionGroup } from '../../types';

@Component({
  selector: 'kc-group',
  templateUrl: './kc-group.component.html',
  styleUrls: ['./kc-group.component.scss'],
  providers: [
    {
      provide: KC_SELECTION,
      useFactory: (autocomplete: KcGroupComponent<unknown, unknown>) => autocomplete.selection,
      deps: [forwardRef(() => KcGroupComponent)],
    },
    {
      provide: KC_VALUE,
      useFactory: (component: KcGroupComponent<unknown, unknown>) => component.value,
      deps: [forwardRef(() => KcGroupComponent)],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcGroupComponent<K, V> implements OnInit, AfterContentInit {
  @Input() options!: KcGroup<K, V>;
  @Input() key!: string;

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;

  @ContentChildren(KcGroupDirective) groups!: QueryList<KcGroupDirective<K, V>>;
  @ContentChildren(KcOptionsDirective) option!: QueryList<KcOptionsDirective<K, V>>;

  selection!: MapEmit<string | K | V, KcOption<K, V> | KcOptionSelection<K, V>, boolean>;

  constructor(
    @SkipSelf()
    @Inject(KC_SELECTION)
    private _selection: MapEmit<string, KcOptionSelection<K, V>, boolean>,
    @SkipSelf() @Inject(KC_VALUE) private _value: KcOptionValue<V> | KcOptionGroupValue<V>,
  ) {}

  get value(): KcOptionValue<V> | KcOptionGroupValue<V> {
    if (this._isOptionGroupValue(this._value)) return this._value[this.key];

    return this._value;
  }

  ngAfterContentInit(): void {
    this.groups.forEach((group) => group.render(this._getGroup(this.options)));
    this.option.forEach((group, index) => group.render(this._getOptions(this.options)[index]));
  }

  ngOnInit(): void {
    this._initSelection();
  }

  private _initSelection(): void {
    this.selection = this._getSelection();

    this._selection.set(this.key, this.selection);

    this.selection.changed.subscribe(() => {
      if (this._selection.has(this.key)) this._selection.update(this.key, this.selection);
      else this._selection.set(this.key, this.selection);
    });
  }

  private _getSelection(): MapEmit<string | K | V, KcOption<K, V> | KcOptionSelection<K, V>, boolean> {
    if (this._selection.has(this.key)) return this._selection.get(this.key)!;

    const option = this._getOption();
    const options = option && (this.multiple ? option : option[0]);

    return new MapEmit<string, KcOption<K, V> | KcOptionSelection<K, V>, boolean>(this.multiple, options);
  }

  private _getOption(): [string, KcOption<K, V>][] | undefined {
    if (this._isOptionGroup(this.options[this.key]))
      return this._getOptions(this.options)
        .flat()
        .filter((option) => {
          if (Array.isArray(this.value)) return this.value.some((value) => value === option.value);

          return this.value === option.value;
        })
        .map((option) => [(option.key || option.value) as unknown as string, option]);

    return undefined;
  }

  private _getGroup(options: KcGroup<K, V>): KcGroup<K, V> {
    return options[this.key] as KcGroup<K, V>;
  }

  private _getOptionGroup(options: KcGroup<K, V>): OptionGroup<K, V> {
    return options[this.key] as OptionGroup<K, V>;
  }

  private _getOptions(options: KcGroup<K, V>): KcOption<K, V>[][] {
    const value = this._getOptionGroup(options).value;

    if (this._isOptionChunks(value)) return value;

    return [value];
  }

  private _isOptionGroup(option: KcGroup<K, V> | OptionGroup<K, V>): option is OptionGroup<K, V> {
    return !!option.value;
  }

  private _isOptionGroupValue(value: KcOptionValue<V> | KcOptionGroupValue<V>): value is KcOptionGroupValue<V> {
    return typeof value === 'object' && !Array.isArray(value);
  }

  private _isOptionChunks(option: KcOption<K, V>[] | KcOption<K, V>[][]): option is KcOption<K, V>[][] {
    return Array.isArray(option[0]);
  }
}
