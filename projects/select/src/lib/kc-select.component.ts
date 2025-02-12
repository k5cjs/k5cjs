import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subscription,
  first,
  isObservable,
  map,
  switchMap,
  tap,
} from 'rxjs';

import { KcControl, KcControlType, kcControlProviders } from '@k5cjs/control';

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
  extends KcControl<KcOptionValue<V> | KcOptionGroupValue<V>>
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
    // TODO: check to implement shareReplay
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

  @ViewChild('templateRef', { static: true }) templateRef!: TemplateRef<unknown>;

  @ContentChildren(KcOptionComponent, { descendants: true })
  optionComponents!: QueryList<KcOptionComponent<V, K, L>>;

  @ContentChild(KcValueDirective, { static: true })
  private _valueDirective?: KcValueDirective;

  @ContentChildren(KcGroupDirective, { descendants: true })
  private _groupDirectives!: QueryList<KcGroupDirective<V, K, L>>;

  @ContentChildren(KcOptionsDirective, { descendants: true })
  private _optionsDirectives!: QueryList<KcOptionsDirective<V, K, L>>;

  override set value(val: KcOptionValue<V> | KcOptionGroupValue<V>) {
    this._value = val;
    this._cdr.detectChanges();
  }
  override get value(): KcOptionValue<V> | KcOptionGroupValue<V> {
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

  private _allSelectedChanged: BehaviorSubject<boolean>;

  private _dialogOverlayRef: OverlayRef | undefined;

  private _tabIndex: number;

  private _subscriptionOptions?: Subscription;
  private _subscriptionChanges?: Subscription;

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
    private _trap: ConfigurableFocusTrapFactory,
    @Attribute('tabindex') tabIndex: string,
  ) {
    super();

    this.closed = new EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>();
    this.submitted = new EventEmitter<KcOptionValue<V> | KcOptionGroupValue<V>>();
    this.allSelected = false;

    this._allSelectedChanged = new BehaviorSubject<boolean>(false);
    this.allSelectedChanged = this._allSelectedChanged.asObservable();
    this.positions = DEFAULT_CONNECTED_POSITIONS;

    this._tabIndex = parseInt(tabIndex) || 0;
    this.cdkOverlayConfig = {
      hasBackdrop: true,
      disposeOnNavigation: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    };
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.selection = new MapEmitSelect<KcOption<V, K, L> | KcOptionSelection<V, K, L>, K | V, boolean>(this.multiple);

    this._subscriptionChanges = this._initSelectionModel();

    if (this.origin) {
      // TODO: remove event listener on destroy
      this.origin.elementRef.nativeElement.addEventListener('click', () => {
        if (this.selectionOpened) return;

        this.elementRef.nativeElement.focus();
        this.click();
      });
    }
  }

  ngAfterContentInit(): void {
    if (this._valueDirective) this._valueDirective.render(this._valueRef);
  }

  override writeValue(obj: KcOptionValue<V> | KcOptionGroupValue<V>): void {
    this.value = obj;
    this._updateSelectionModel();
  }
  /**
   * allow element to be focusable
   */
  @HostBinding('attr.tabindex') get tabindex(): number {
    return this._tabIndex;
  }

  @HostListener('keydown', ['$event'])
  protected _keydown(event: KeyboardEvent): void {
    /**
     * when user focus on element and press space, open selection
     */
    if (event.key === ' ') {
      /**
       * prevent scroll when user press space
       */
      event.preventDefault();
      this.open();
    } else if (event.key === 'Escape') this.close();
    else if (event.key === 'Tab') {
      if (this.selectionOpened) {
        /**
         * prevent to focus on next element when selection is opened
         */
        event.preventDefault();
        this.close();
      } else if (this.focused) {
        this.focused = false;
      }
    }
  }
  /**
   * open selection when user click on element
   */
  @HostListener('click')
  click(): void {
    if (this.selectionOpened) this.close();
    else this.open();
  }
  /**
   * focus on element when user press tab to focus on element
   * and don't open selection, to open selection user need to press space
   */
  @HostListener('focus')
  override _focus(): void {
    this.focused = true;
    this._stateChanges.next();
  }

  /**
   * close selection when user press tab to blur on element
   */
  @HostListener('blur')
  override _blur(): void {
    if (this.selectionOpened) return;
    /**
     * blur element when user focused element but not open selection
     * and focus on another element but not with tab key but with mouse click
     */
    this.focused = false;
    this._stateChanges.next();
  }

  open(): void {
    /**
     * skip to open if selection is already opened
     */
    if (this.selectionOpened) return;

    this._openOverlay();

    this.selectionOpened = true;

    this._removeOptionsSubscription();

    this._subscriptionOptions = this.options.pipe(takeUntilDestroyed(this._destroy)).subscribe((options) => {
      if (this._groupDirectives.length)
        this._groupDirectives.forEach((group) => group.render(options as KcGroup<V, K, L>));
      else if (this._optionsDirectives.length)
        this._optionsDirectives.forEach((optionDirective, index) =>
          optionDirective.render(this._getOptions(options as KcOption<V, K, L>[] | KcOption<V, K, L>[][])[index]),
        );
    });
  }

  close(): void {
    /**
     * skip to close if selection is already closed
     */
    if (!this.selectionOpened) return;

    this._closeOverlay();

    this.selectionOpened = false;

    this._removeOptionsSubscription();

    if (this._groupDirectives.length) this._groupDirectives.forEach((group) => group.clear());
    else if (this._optionsDirectives.length)
      this._optionsDirectives.forEach((optionDirective) => optionDirective.clear());

    this.onTouchedNew();
    /**
     * mark for check when user try to close from KcSelect token
     */
    this._cdr.markForCheck();

    this.closed.emit(this.value);
    /**
     * stay focused until user click outside of select
     */
    this.elementRef.nativeElement.focus();
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
    if (!this._subscriptionOptions) return;

    this._subscriptionOptions.unsubscribe();
    this._subscriptionOptions = undefined;
  }

  private _initSelectionModel(): Subscription {
    return this._getSelectedOptions
      .pipe(
        tap((options) => options && this.selection.set(options)),
        switchMap(() => this.selection.changed),
        takeUntilDestroyed(this._destroy),
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
          this._subscriptionChanges?.unsubscribe();

          this.selection.clear({ emitEvent: !options?.length });
          if (options?.length) this.selection.set(options);

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

  private _openOverlay(): void {
    const elementRef: ElementRef<HTMLElement> = this.origin?.elementRef || this.elementRef;
    const minWidth: number = elementRef.nativeElement.offsetWidth;

    const overlayRef = this._overlay.create({
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy: this._getPositionStrategy(elementRef),
      minWidth,
      ...this.cdkOverlayConfig,
    });

    const dialogPortal = new TemplatePortal(this.templateRef, this._viewContainerRef);
    overlayRef.attach(dialogPortal);

    overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(() => {
        this.close();
        this._stateChanges.next();
      });

    /**
     * trap tab to be inside of modal
     * for example search
     */
    const trap = this._trap.create(overlayRef.overlayElement);

    void trap.focusInitialElementWhenReady().then((successfully) => {
      if (successfully && trap.attachAnchors()) {
        const elements = document.querySelectorAll('.cdk-focus-trap-anchor');
        const first = elements[0];
        const end = elements[elements.length - 1];

        first.addEventListener('focus', () => {
          trap.destroy();
          this.elementRef.nativeElement.focus();
          this.close();
        });

        end.addEventListener('focus', () => {
          trap.destroy();
          this.elementRef.nativeElement.focus();
          this.close();
        });
      }
    });

    this._dialogOverlayRef = overlayRef;
  }

  private _getPositionStrategy(
    elementRef: FlexibleConnectedPositionStrategyOrigin,
  ): FlexibleConnectedPositionStrategy | GlobalPositionStrategy {
    if (this.dialog) {
      return this._overlay.position().global().centerHorizontally().centerVertically();
    }

    const offsetMargin = Math.max(
      ...this.positions
        .flatMap(({ offsetX, offsetY }) => [offsetX || 0, offsetY || 0])
        .map((offset) => Math.abs(offset)),
    );

    return this._overlay
      .position()
      .flexibleConnectedTo(elementRef)
      .withPush(false)
      .withViewportMargin(20 + offsetMargin)
      .withPositions(this.positions);
  }

  private _closeOverlay(): void {
    this._dialogOverlayRef!.dispose();
    this._dialogOverlayRef = undefined;
  }

  /** Invoked when an option is clicked. */
  private _onSelect(): void {
    const valueToEmit = getValues<V, K, L>(this.selection);

    this._value = valueToEmit!;
    this.onChange(valueToEmit);

    this.allSelected = [...this.optionComponents].every((option) => option.selected);
    this._allSelectedChanged.next(this.allSelected);

    this._stateChanges.next();

    this._cdr.detectChanges();
  }
}
