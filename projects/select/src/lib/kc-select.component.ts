import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Observable, ReplaySubject, Subject, isObservable, takeUntil } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { MapEmit } from '@k5cjs/selection-model';

import { KcOptionComponent } from './components';
import { KcGroupDirective, KcOptionsDirective, KcPlaceHolderDirective, KcValueDirective } from './directives';
import { getValues } from './helpers';
import { KC_SELECT, KC_SELECTION, KC_VALUE } from './tokens';
import { KcGroup, KcOption, KcOptionGroupValue, KcOptionSelection, KcOptionValue, KcSelect } from './types';

@Component({
  selector: 'kc-select',
  templateUrl: './kc-select.component.html',
  styleUrls: ['./kc-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KcSelectComponent),
      multi: true,
    },
    {
      provide: KC_SELECT,
      useExisting: forwardRef(() => KcSelectComponent),
    },
    {
      provide: KC_SELECTION,
      useFactory: (component: KcSelectComponent<unknown, unknown>) => component.selection,
      deps: [forwardRef(() => KcSelectComponent)],
    },
    {
      provide: KC_VALUE,
      useFactory: (component: KcSelectComponent<unknown, unknown>) => component.value,
      deps: [forwardRef(() => KcSelectComponent)],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcSelectComponent<K, V> implements AfterContentInit, ControlValueAccessor, KcSelect {
  @Input()
  get options(): Observable<KcOption<K, V>[] | KcOption<K, V>[][] | KcGroup<K, V>> {
    return this._options;
  }
  set options(
    options:
      | Observable<KcOption<K, V>[] | KcOption<K, V>[][] | KcGroup<K, V>>
      | KcOption<K, V>[]
      | KcOption<K, V>[][]
      | KcGroup<K, V>,
  ) {
    if (isObservable(options)) this._options = options;
    else this._createObservableOptions(options);
  }
  private _options!: Observable<KcOption<K, V>[] | KcOption<K, V>[][] | KcGroup<K, V>>;
  private _optionsCache: ReplaySubject<KcOption<K, V>[] | KcOption<K, V>[][] | KcGroup<K, V>> | undefined;

  /**
   * allow user to open selection in modal
   */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean | string) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;
  /**
   * allow user to open selection in modal
   */
  @Input()
  get dialog(): boolean {
    return this._dialog;
  }
  set dialog(value: boolean | string) {
    this._dialog = coerceBooleanProperty(value);
  }
  private _dialog = false;

  @Output() closed: EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>;
  @Output() submitted: EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>;
  /**
   * get the template for the overlay that contains ng-content
   */
  @ViewChild('valueRef', { read: ViewContainerRef, static: true }) private _valueRef!: ViewContainerRef;
 
  @ViewChild('placeholderRef', { read: ViewContainerRef , static: false }) private _placeholderRef!: ViewContainerRef;

  @ViewChild('templateRef') templateRef!: TemplateRef<unknown>;

  @ContentChildren(KcOptionComponent, { descendants: true })
  optionComponents!: QueryList<KcOptionComponent<K, V>>;

  @ContentChild(KcValueDirective, { static: true })
  private _valueDirective?: KcValueDirective;

  @ContentChild(KcPlaceHolderDirective, { static: true })
  private _placeHolderDirective?: KcPlaceHolderDirective;

  @ContentChildren(KcGroupDirective, { descendants: true })
  private _groupDirectives!: QueryList<KcGroupDirective<K, V>>;

  @ContentChildren(KcOptionsDirective, { descendants: true })
  private _optionsDirectives!: QueryList<KcOptionsDirective<K, V>>;

  set value(val: KcOptionValue<V> | KcOptionGroupValue<V>) {
    this._value = val;
    this._cdr.detectChanges();
  }
  get value(): KcOptionValue<V> | KcOptionGroupValue<V> {
    return this._value;
  }
  private _value!: KcOptionValue<V> | KcOptionGroupValue<V>;
  /**
   * panelOpen is for open/close the overlay panel
   */
  panelOpen = false;
  /**
   * selectionOpened variable is for check if the overlay or dialog is open
   */
  selectionOpened = false;
  selection!: KcOptionSelection<K, V>;

  allSelected: boolean;
  allSelectedChanged: Observable<boolean>;
  private _allSelectedChanged: BehaviorSubject<boolean>;

  private _dialogOverlayRef: OverlayRef | undefined;
  private _destroy: Subject<void>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: unknown) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: () => unknown = () => {};

  constructor(private _overlay: Overlay, private _viewContainerRef: ViewContainerRef, private _cdr: ChangeDetectorRef) {
    this._destroy = new Subject<void>();

    this.closed = new EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>();
    this.submitted = new EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>();
    this.allSelected = false;

    this._allSelectedChanged = new BehaviorSubject<boolean>(false);
    this.allSelectedChanged = this._allSelectedChanged.asObservable();
  }

  ngAfterContentInit(): void {
    /**
     * init selection after writeValue is called
     * ngOnInit -> writeValue -> ngAfterContentInit
     */
    this._initSelectionModel();

    if (this._valueDirective) this._valueRef.createEmbeddedView(this._valueDirective.template);
    if (this._placeHolderDirective) this._placeholderRef.createEmbeddedView(this._placeHolderDirective.template);

    this.options.pipe(takeUntil(this._destroy)).subscribe((options) => {
      if (this._groupDirectives.length) this._groupDirectives.forEach((group) => group.render(options));
      else if (this._optionsDirectives.length)
        this._optionsDirectives.forEach((optionDirective, index) =>
          optionDirective.render(
            this._getOptions(options as KcOption<K, V>[] | KcOption<K, V>[][])[index] as unknown as KcOption<K, V>[],
          ),
        );
    });
  }

  writeValue(obj: KcOptionValue<V> | KcOptionGroupValue<V>): void {
    this.value = obj;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => unknown): void {
    this.onTouch = fn;
  }

  open(): void {
    if (this.dialog) this._openDialog();
    else this.panelOpen = true;

    this.selectionOpened = true;
  }

  close(event?: MouseEvent): void {
    /**
     * check if html element contains an attribute called 'prevent-close''
     */
    if (this.selectionOpened && (event?.target as HTMLElement).hasAttribute('prevent-close')) return;

    if (this.dialog) this._closeDialog();
    else this.panelOpen = false;

    this.selectionOpened = false;

    this.closed.emit(this.value);
    /**
     * mark for check when user try to close from KcSelect token
     */
    this._cdr.markForCheck();
  }

  submit(): void {
    this.close();
    this.submitted.emit(this.value);
    this.clear();
  }

  keydown(event: KeyboardEvent): void {
    /**
     * close modal when user press ESC
     */
    if (event.key === 'Escape') this.close();
  }

  selectAll(): void {
    this.optionComponents.forEach((option) => option.select());
  }

  deselectAll(): void {
    this.optionComponents.forEach((option) => option.deselect());
  }

  toggle(): void {
    if (this.allSelected) this.deselectAll();
    else this.selectAll();
  }

  clear(): void {
    this.allSelected = false;
    this.selection.clear();
  }

  private _initSelectionModel(): void {
    this._getSelectedOptions
      .pipe(
        /**
         * get first event from selected options to initialize selection model
         */
        first(),
        map((options) => options && (this.multiple ? options : options[0])),
        map((options) => new MapEmit<K | V, KcOption<K, V> | KcOptionSelection<K, V>, boolean>(this.multiple, options)),
        tap((selection) => (this.selection = selection)),
        switchMap((selectionModel) => selectionModel.changed),
        takeUntil(this._destroy),
      )
      .subscribe(() => {
        /**
         * When the groups are initialized, the selectionModel changes from the AfterContentInit hook
         * Angular does not expect events to be raised during change detection, so any state change
         * (such as a form control's 'ng-touched') will cause a changed-after-checked error.
         */
        void Promise.resolve().then(() => this._onSelect());
      });
  }

  private _getOptions(options: KcOption<K, V>[] | KcOption<K, V>[][]): KcOption<K, V>[][] {
    if (this._isOptionChunks(options)) return options;

    return [options];
  }

  private get _getSelectedOptions(): Observable<[K | V, KcOption<K, V>][] | undefined> {
    return this.options.pipe(
      map((options) => {
        if (Array.isArray(options)) {
          if (this._isOptionChunks(options)) {
            return options.flat().filter((option) => {
              if (Array.isArray(this.value)) return this.value.some((value) => value === option.value);

              return this.value === option.value;
            });
          } else
            return options.filter((option) => {
              if (Array.isArray(this.value)) return this.value.some((value) => value === option.value);

              return this.value === option.value;
            });
        }

        return undefined;
      }),
      map((options) => options?.map((option) => [option.key || option.value, option])),
    );
  }

  private _isOptionChunks(option: KcOption<K, V>[] | KcOption<K, V>[][]): option is KcOption<K, V>[][] {
    return Array.isArray(option[0]);
  }

  private _createObservableOptions(options: KcOption<K, V>[] | KcOption<K, V>[][] | KcGroup<K, V>): void {
    if (!this._optionsCache) {
      this._optionsCache = new ReplaySubject();
      this._options = this._optionsCache;
    }

    this._optionsCache.next(options);
  }

  private _openDialog(): void {
    const overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      disposeOnNavigation: true,
    });

    const dialogPortal = new TemplatePortal(this.templateRef, this._viewContainerRef);
    overlayRef.attach(dialogPortal);

    this._dialogOverlayRef = overlayRef;
    overlayRef.backdropClick().subscribe((event) => this.close(event));
  }

  private _closeDialog(): void {
    this._dialogOverlayRef!.dispose();
    this._dialogOverlayRef = undefined;
  }

  /** Invoked when an option is clicked. */
  private _onSelect(): void {
    const valueToEmit = getValues<K, V>(this.selection);

    this._value = valueToEmit!;
    this._onChange(valueToEmit);

    this.allSelected = [...this.optionComponents].every((option) => option.selected);
    this._allSelectedChanged.next(this.allSelected);

    // if (!this.multiple) this.close();

    this._cdr.detectChanges();
  }
}
