import { Subject } from 'rxjs';

/**
 * Class to be used to power selecting one or more options from a list.
 */
export class SelectionModel<T extends { value: unknown; key?: unknown }> {
  /** Event emitted when the value has changed. */
  changed: Subject<SelectionModelChange<T>>;

  /** Currently-selected values. */
  private _selection: Map<T['key' | 'value'], T>;

  /** Keeps track of the deselected options that haven't been emitted by the change event. */
  private _deselectedToEmit: T[] = [];

  /** Keeps track of the selected options that haven't been emitted by the change event. */
  private _selectedToEmit: T[] = [];

  /** Cache for the array value of the selected items. */
  private _selected!: T[] | null;

  constructor(
    initiallySelectedValues?: T[],
    private _multiple = false,
    private _emitChanges = true,
    private _objectReference?: <T, K extends keyof T>(object: T, key: K) => T[K],
  ) {
    this._selection = new Map<T['key' | 'value'], T>();

    this.changed = new Subject();
    /**
     * if we don't have initially selected values, exit from constructor
     */
    if (!initiallySelectedValues?.length) return;

    if (this._multiple) initiallySelectedValues.forEach((value) => this._markSelected(value));
    else this._markSelected(initiallySelectedValues[0]);

    // Clear the array in order to avoid firing the change event for preselected values.
    this._selectedToEmit.length = 0;
  }

  /** Selected values. */
  get selected(): T[] {
    if (!this._selected) this._selected = Array.from(this._selection.values());

    return this._selected;
  }

  /**
   * Update a value or an array of values.
   */
  update(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._selection.set(value.key || value.value, value));
    this._emitChangeEvent();

    this.changed.next({
      source: this,
      added: this._selectedToEmit,
      removed: this._deselectedToEmit,
    });
  }

  /**
   * Selects a value or an array of values.
   */
  select(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._markSelected(value));
    this._emitChangeEvent();
  }

  /**
   * Deselects a value or an array of values.
   */
  deselect(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._unMarkSelected(value));
    this._emitChangeEvent();
  }

  /**
   * Toggles a value between selected and deselected.
   */
  toggle(value: T): void {
    this.isSelected(value) ? this.deselect(value) : this.select(value);
  }

  /**
   * Clears all of the selected values.
   */
  clear(): void {
    this._unMarkAll();
    this._emitChangeEvent();
  }
  /**
   * Determines whether a value is selected.
   */
  get(value: T): T | undefined {
    return this._selection.get(value.key || value.value);
  }
  /**
   * Determines whether a value is selected.
   */
  isSelected(value: T): boolean {
    return this._selection.has(value.key || value.value);
  }

  /**
   * Determines whether the model does not have a value.
   */
  isEmpty(): boolean {
    return this._selection.size === 0;
  }

  /**
   * Determines whether the model has a value.
   */
  hasValue(): boolean {
    return !this.isEmpty();
  }

  /**
   * Sorts the selected values based on a predicate function.
   */
  sort(predicate?: (a: T, b: T) => number): void {
    if (this._multiple && this.selected) {
      this._selected?.sort(predicate);
    }
  }

  /**
   * Gets whether multiple values can be selected.
   */
  isMultipleSelection(): boolean {
    return this._multiple;
  }

  /** Emits a change event and clears the records of selected and deselected values. */
  private _emitChangeEvent() {
    // Clear the selected values so they can be re-cached.
    this._selected = null;

    if (this._selectedToEmit.length || this._deselectedToEmit.length) {
      this.changed.next({
        source: this,
        added: this._selectedToEmit,
        removed: this._deselectedToEmit,
      });

      this._deselectedToEmit = [];
      this._selectedToEmit = [];
    }
  }

  /** Selects a value. */
  private _markSelected(value: T) {
    /**
     * if value is already selected, exit from method
     */
    if (this.isSelected(value)) return;
    /**
     * if is not multiple, clear all selected values
     * because we can only select one value
     */
    if (!this._multiple) this._unMarkAll();
    /**
     * set new selected value
     */
    this._selection.set(value.key || value.value, value);
    /**
     * emit an event if user have emitChanges
     */
    if (this._emitChanges) this._selectedToEmit.push(value);
  }

  /** Deselects a value. */
  private _unMarkSelected(value: T) {
    if (!this.isSelected(value)) return;

    // check if value is instance of SelectionModel

    this._selection.delete(value.key || value.value);

    if (this._emitChanges) this._deselectedToEmit.push(value);
  }

  /** Clears out the selected values. */
  private _unMarkAll() {
    if (this.isEmpty()) return;

    this._selection.forEach((value) => this._unMarkSelected(value));
  }
  /**
   * Verifies the value assignment and throws an error if the specified value array is
   * including multiple values while the selection model is not supporting multiple values.
   */
  private _verifyValueAssignment(values: T[]) {
    if (values.length > 1 && !this._multiple && ngDevMode)
      throw Error('Cannot pass multiple values into SelectionModel with single-value mode.');
  }
}

/**
 * Event emitted when the value of a SelectionModel has changed.
 * @docs-private
 */
export interface SelectionModelChange<T extends { value: unknown }> {
  /** Model that dispatched the event. */
  source: SelectionModel<T>;
  /** Options that were added to the model. */
  added: T[];
  /** Options that were removed from the model. */
  removed: T[];
}
