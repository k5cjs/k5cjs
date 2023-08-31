import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  FlexibleConnectedPositionStrategyOrigin,
  GlobalPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, ValidationErrors } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  first,
  isObservable,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { KcControlType, kcControlProviders } from '@k5cjs/control';

import { KcOptionComponent } from './components';
import { DEFAULT_CONNECTED_POSITIONS } from './config';
import { KcGroupDirective, KcOptionsDirective, KcOriginDirective, KcValueDirective } from './directives';
import { MapEmitSelect, getSelectedOptions, getValues, isOptionChunks } from './helpers';
import { KC_SELECT, KC_SELECTION, KC_VALUE } from './tokens';
import { KcGroup, KcOption, KcOptionGroupValue, KcOptionSelection, KcOptionValue, KcSelect } from './types';

@Component({
  selector: 'kc-select',
  templateUrl: './kc-select.component.html',
  styleUrls: ['./kc-select.component.scss'],
  providers: [
    kcControlProviders(KcSelectComponent),
    {
      provide: KC_SELECT,
      useExisting: forwardRef(() => KcSelectComponent),
    },
    {
      provide: KC_SELECTION,
      useFactory: (component: KcSelectComponent<unknown, unknown, unknown>) => component.selection,
      deps: [forwardRef(() => KcSelectComponent)],
    },
    {
      provide: KC_VALUE,
      useFactory: (component: KcSelectComponent<unknown, unknown, unknown>) => component.value,
      deps: [forwardRef(() => KcSelectComponent)],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'kcSelect',
})
export class KcSelectComponent<V, K, L>
  implements
    OnInit,
    AfterContentInit,
    ControlValueAccessor,
    KcSelect,
    KcControlType<KcOptionValue<V> | KcOptionGroupValue<V>>
{
  @Input()
  get options(): Observable<KcOption<V, K, L>[] | KcOption<V, K, L>[][] | KcGroup<V, K, L>> {
    return this._options;
  }
  set options(
    options:
      | Observable<KcOption<V, K, L>[] | KcOption<V, K, L>[][] | KcGroup<V, K, L>>
      | KcOption<V, K, L>[]
      | KcOption<V, K, L>[][]
      | KcGroup<V, K, L>,
  ) {
    if (isObservable(options)) this._options = options;
    else this._createObservableOptions(options);
  }
  private _options!: Observable<KcOption<V, K, L>[] | KcOption<V, K, L>[][] | KcGroup<V, K, L>>;
  private _optionsCache: ReplaySubject<KcOption<V, K, L>[] | KcOption<V, K, L>[][] | KcGroup<V, K, L>> | undefined;

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
  /**
   * allow user to change origin from where selection will be opened
   */
  @Input() origin: KcOriginDirective | undefined;

  @Input() cdkOverlayConfig: OverlayConfig;
  @Input() positions: ConnectedPosition[];

  @Output() closed: EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>;
  @Output() submitted: EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>;

  @ViewChild('valueRef', { read: ViewContainerRef, static: true }) private _valueRef!: ViewContainerRef;

  @ViewChild('templateRef') templateRef!: TemplateRef<unknown>;

  @ContentChildren(KcOptionComponent, { descendants: true })
  optionComponents!: QueryList<KcOptionComponent<V, K, L>>;

  @ContentChild(KcValueDirective, { static: true })
  private _valueDirective?: KcValueDirective;

  @ContentChildren(KcGroupDirective, { descendants: true })
  private _groupDirectives!: QueryList<KcGroupDirective<V, K, L>>;

  @ContentChildren(KcOptionsDirective, { descendants: true })
  private _optionsDirectives!: QueryList<KcOptionsDirective<V, K, L>>;

  set value(val: KcOptionValue<V> | KcOptionGroupValue<V>) {
    this._value = val;
    this._cdr.detectChanges();
  }
  get value(): KcOptionValue<V> | KcOptionGroupValue<V> {
    return this._value;
  }
  private _value!: KcOptionValue<V> | KcOptionGroupValue<V>;

  /**
   * selectionOpened variable is for check if the overlay or dialog is open
   */
  selectionOpened = false;
  selection!: KcOptionSelection<V, K, L>;

  allSelected: boolean;
  allSelectedChanged: Observable<boolean>;

  stateChanges: Observable<void>;
  private _stateChanges: Subject<void>;

  private _allSelectedChanged: BehaviorSubject<boolean>;

  private _dialogOverlayRef: OverlayRef | undefined;
  private _optionsSubscription: Subscription | undefined;

  private _focused: boolean;

  private _tabIndex: number;

  private _subscriptionChanges?: Subscription;

  private _destroy: Subject<void>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: unknown) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouch: () => unknown = () => {};

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
    public elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string,
  ) {
    this._destroy = new Subject<void>();

    this._stateChanges = new Subject<void>();
    this.stateChanges = this._stateChanges.asObservable();

    this.closed = new EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>();
    this.submitted = new EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>();
    this.allSelected = false;

    this._allSelectedChanged = new BehaviorSubject<boolean>(false);
    this.allSelectedChanged = this._allSelectedChanged.asObservable();
    this.positions = DEFAULT_CONNECTED_POSITIONS;

    this._focused = false;

    this._tabIndex = parseInt(tabIndex) || 0;
    this.cdkOverlayConfig = {
      hasBackdrop: true,
      disposeOnNavigation: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    };
  }

  ngOnInit(): void {
    if (this.origin) {
      this.origin.elementRef.nativeElement.addEventListener('click', (event) => {
        if (this.selectionOpened) return;

        this.elementRef.nativeElement.focus();
        this.click(event);
      });
    }
  }

  get autofilled(): boolean {
    // eslint-disable-next-line no-console
    console.warn('autofilled method not implemented.');

    return false;
  }

  get invalid(): boolean {
    // eslint-disable-next-line no-console
    console.warn('invalid method not implemented.');

    return false;
  }

  get disabled(): boolean {
    // eslint-disable-next-line no-console
    console.warn('disabled method not implemented.');

    return false;
  }

  disable(): void {
    // eslint-disable-next-line no-console
    console.warn('disable method not implemented.');
  }

  get empty(): boolean {
    // eslint-disable-next-line no-console
    console.warn('empty method not implemented.');

    return false;
  }

  reset(): void {
    // eslint-disable-next-line no-console
    console.warn('reset method not implemented.');
  }

  get errors(): ValidationErrors | null {
    // eslint-disable-next-line no-console
    console.warn('reset method not implemented.');

    return null;
  }

  ngAfterContentInit(): void {
    /**
     * init selection after writeValue is called
     * ngOnInit -> writeValue -> ngAfterContentInit
     */
    this._subscriptionChanges = this._initSelectionModel();

    if (this._valueDirective) this._valueDirective.render(this._valueRef);
  }

  /**
   * allow element to be focusable
   */
  @HostBinding('attr.tabindex') get tabindex(): number {
    return this._tabIndex;
  }

  get focused(): boolean {
    return this._focused;
  }

  writeValue(obj: KcOptionValue<V> | KcOptionGroupValue<V>): void {
    this.value = obj;
    this._updateSelectionModel();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => unknown): void {
    this._onTouch = fn;
  }

  @HostListener('keydown', ['$event']) private _keydown(event: KeyboardEvent): void {
    /**
     * when user focus on element and press space, open selection
     */
    if (event.key === ' ') this.open();
    else if (event.key === 'Escape') this.close();
  }

  /**
   * open selection when user click on element
   */
  @HostListener('click', ['$event'])
  click(event: MouseEvent): void {
    if (this.selectionOpened) this.close(event);
    else this.open(event);
  }
  /**
   * focus on element when user press tab to focus on element
   * and don't open selection, to open selection user need to press space
   */
  @HostListener('focus', ['$event'])
  focus(): void {
    this._focused = true;
  }

  /**
   * close selection when user press tab to blur on element
   */
  @HostListener('blur', ['$event'])
  blur(event: FocusEvent): void {
    this._focused = false;
    this.close(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open(event?: MouseEvent): void {
    /**
     * skip to open if selection is already opened
     */
    if (this.selectionOpened) return;

    this._openDialog();

    this.selectionOpened = true;

    this._removeOptionsSubscription();

    this._optionsSubscription = this.options.pipe(takeUntil(this._destroy)).subscribe((options) => {
      if (this._groupDirectives.length)
        this._groupDirectives.forEach((group) => group.render(options as KcGroup<V, K, L>));
      else if (this._optionsDirectives.length)
        this._optionsDirectives.forEach((optionDirective, index) =>
          optionDirective.render(this._getOptions(options as KcOption<V, K, L>[] | KcOption<V, K, L>[][])[index]),
        );
    });
  }

  close(event?: MouseEvent | FocusEvent): void {
    /**
     * skip to close if selection is already closed
     */
    if (!this.selectionOpened) return;
    /**
     * check if html element contains an attribute called 'prevent-close''
     */
    if (
      this.selectionOpened &&
      event &&
      this._checkIsHtmlElement(event.target) &&
      event.target.hasAttribute('prevent-close')
    )
      return;

    this._closeDialog();

    this.selectionOpened = false;

    this._removeOptionsSubscription();

    if (this._groupDirectives.length) this._groupDirectives.forEach((group) => group.clear());
    else if (this._optionsDirectives.length)
      this._optionsDirectives.forEach((optionDirective) => optionDirective.clear());
    /**
     * mark for check when user try to close from KcSelect token
     */
    this._cdr.markForCheck();

    this.closed.emit(this.value);
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

  private _removeOptionsSubscription(): void {
    if (!this._optionsSubscription) return;

    this._optionsSubscription.unsubscribe();
    this._optionsSubscription = undefined;
  }

  private _initSelectionModel(): Subscription {
    this.selection ??= new MapEmitSelect<KcOption<V, K, L> | KcOptionSelection<V, K, L>, K | V, boolean>(this.multiple);

    return this._getSelectedOptions
      .pipe(
        tap((options) => options && this.selection.set(options, { emitEvent: false })),
        switchMap(() => this.selection.changed),
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

  private _updateSelectionModel(): void {
    if (!this.selection) return;

    this._getSelectedOptions
      .pipe(
        tap((options) => {
          if (!options) return;

          this._subscriptionChanges?.unsubscribe();

          this.selection.clear({ emitEvent: false });
          this.selection.set(options);

          this._subscriptionChanges = this._initSelectionModel();
        }),
      )
      .subscribe();
  }

  private _getOptions(options: KcOption<V, K, L>[] | KcOption<V, K, L>[][]): KcOption<V, K, L>[][] {
    if (isOptionChunks(options)) return options;

    return [options];
  }

  /**
   * check selected options
   */
  private get _getSelectedOptions(): Observable<[K | V, KcOption<V, K, L>][] | undefined> {
    return this.options.pipe(
      map((options) => getSelectedOptions(options, this.value)),
      first(),
    );
  }

  private _createObservableOptions(options: KcOption<V, K, L>[] | KcOption<V, K, L>[][] | KcGroup<V, K, L>): void {
    if (!this._optionsCache) {
      this._optionsCache = new ReplaySubject();
      this._options = this._optionsCache;
    }

    this._optionsCache.next(options);
  }

  private _openDialog(): void {
    const elementRef: ElementRef<HTMLElement> = this.origin?.elementRef || this.elementRef;
    const minWidth: number = elementRef.nativeElement.offsetWidth;

    const overlayRef = this._overlay.create({
      positionStrategy: this._getPositionStrategy(elementRef),
      ...this.cdkOverlayConfig,
      minWidth,
    });

    const dialogPortal = new TemplatePortal(this.templateRef, this._viewContainerRef);
    overlayRef.attach(dialogPortal);

    this._dialogOverlayRef = overlayRef;
    overlayRef
      .backdropClick()
      .pipe(takeUntil(this._destroy))
      .subscribe((event) => this.close(event));
  }

  private _getPositionStrategy(
    elementRef: FlexibleConnectedPositionStrategyOrigin,
  ): FlexibleConnectedPositionStrategy | GlobalPositionStrategy {
    if (this.dialog) {
      return this._overlay.position().global().centerHorizontally().centerVertically();
    }

    return this._overlay.position().flexibleConnectedTo(elementRef).withPositions(this.positions);
  }

  private _closeDialog(): void {
    this._dialogOverlayRef!.dispose();
    this._dialogOverlayRef = undefined;
  }

  /** Invoked when an option is clicked. */
  private _onSelect(): void {
    const valueToEmit = getValues<V, K, L>(this.selection);

    this._value = valueToEmit!;
    this._onChange(valueToEmit);

    this.allSelected = [...this.optionComponents].every((option) => option.selected);
    this._allSelectedChanged.next(this.allSelected);

    this._cdr.detectChanges();
  }

  private _checkIsHtmlElement(element: EventTarget | null): element is HTMLElement {
    return element instanceof HTMLElement;
  }
}
