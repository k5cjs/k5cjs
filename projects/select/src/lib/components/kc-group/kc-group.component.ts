import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  SkipSelf,
  forwardRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { KcGroupDirective, KcOptionsDirective } from '../../directives';
import { MapEmitSelect } from '../../helpers';
import { KC_SELECT, KC_SELECTION, KC_VALUE } from '../../tokens';
import {
  KcGroup,
  KcOption,
  KcOptionGroupValue,
  KcOptionSelection,
  KcOptionValue,
  KcSelect,
  OptionGroup,
} from '../../types';

@Component({
  selector: 'kc-group',
  templateUrl: './kc-group.component.html',
  styleUrls: ['./kc-group.component.scss'],
  providers: [
    {
      provide: KC_SELECTION,
      useFactory: (autocomplete: KcGroupComponent<unknown, unknown, unknown>) => autocomplete.selection,
      deps: [forwardRef(() => KcGroupComponent)],
    },
    {
      provide: KC_VALUE,
      useFactory: (component: KcGroupComponent<unknown, unknown, unknown>) => component.value,
      deps: [forwardRef(() => KcGroupComponent)],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcGroupComponent<V, K, L> implements OnInit, AfterContentInit, OnDestroy {
  @Input() options!: KcGroup<V, K, L>;
  @Input() key!: string;

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;

  @ContentChildren(KcGroupDirective) groups!: QueryList<KcGroupDirective<V, K, L>>;
  @ContentChildren(KcOptionsDirective) option!: QueryList<KcOptionsDirective<V, K, L>>;

  selection!: MapEmitSelect<KcOption<V, K, L> | KcOptionSelection<V, K, L>, string | K | V, boolean>;

  private _destroy: Subject<void>;

  constructor(
    @SkipSelf()
    @Inject(KC_SELECTION)
    private _selection: MapEmitSelect<KcOptionSelection<V, K, L>, string, boolean>,
    @SkipSelf() @Inject(KC_SELECT) private _select: KcSelect<V>,
  ) {
    this._destroy = new Subject();
  }

  get value(): KcOptionValue<V> | KcOptionGroupValue<V> {
    const value = this._select.value;
    if (this._isOptionGroupValue(value)) return value[this.key];

    return value;
  }

  ngAfterContentInit(): void {
    this.groups.forEach((group) => group.render(this._getGroup(this.options)));
    this.option.forEach((group, index) => group.render(this._getOptions(this.options)[index]));
  }

  ngOnInit(): void {
    this._initSelection();
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }

  private _initSelection(): void {
    this.selection = this._getSelection();
    /**
     * If the selection is empty, set the selection to the current option.
     * we need to check if the selection is empty because the selection can be set from previous render.
     */
    if (this._selection.isEmpty()) this._selection.set(this.key, this.selection);

    this.selection.changed.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._selection.has(this.key)) this._selection.update(this.key, this.selection);
      else this._selection.set(this.key, this.selection);
    });
  }

  private _getSelection(): MapEmitSelect<KcOption<V, K, L> | KcOptionSelection<V, K, L>, string | K | V, boolean> {
    if (this._selection.has(this.key)) return this._selection.get(this.key)!;

    const option = this._getOption();
    const options = option && (this.multiple ? option : option[0]);

    return new MapEmitSelect<KcOption<V, K, L> | KcOptionSelection<V, K, L>, string, boolean>(this.multiple, options);
  }

  private _getOption(): [string, KcOption<V, K, L>][] | undefined {
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

  private _getGroup(options: KcGroup<V, K, L>): KcGroup<V, K, L> {
    return options[this.key] as KcGroup<V, K, L>;
  }

  private _getOptionGroup(options: KcGroup<V, K, L>): OptionGroup<V, K, L> {
    return options[this.key] as OptionGroup<V, K, L>;
  }

  private _getOptions(options: KcGroup<V, K, L>): KcOption<V, K, L>[][] {
    const value = this._getOptionGroup(options).value;

    if (this._isOptionChunks(value)) return value;

    return [value];
  }

  private _isOptionGroup(option: KcGroup<V, K, L> | OptionGroup<V, K, L>): option is OptionGroup<V, K, L> {
    return !!option.value;
  }

  private _isOptionGroupValue(value: KcOptionValue<V> | KcOptionGroupValue<V>): value is KcOptionGroupValue<V> {
    return typeof value === 'object' && !Array.isArray(value);
  }

  private _isOptionChunks(option: KcOption<V, K, L>[] | KcOption<V, K, L>[][]): option is KcOption<V, K, L>[][] {
    return Array.isArray(option[0]);
  }
}
