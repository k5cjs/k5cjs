import { EmbeddedViewRef, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, distinctUntilChanged } from 'rxjs';

import { Direction, GridEventType, KcGridItem, KcGridItemContext } from '../../types';
import {
  getDirection,
  Position,
  getPosition,
  shiftToBottom,
  shiftToLeft,
  shiftToRight,
  shiftToTop,
  shrink,
} from '../../helpers';
import { GridDirective, PreviewDirective } from '../../directives';

@Injectable()
export class KcGridService {
  /**
   * cols are the number of columns in the grid
   */
  public cols!: number;
  /**
   * rows are the number of rows in the grid
   */
  public rows!: number;
  /**
   * cellWidth is the width of each cell in the grid
   */
  public colsGaps!: number[];
  public rowsGaps!: number[];
  public cellWidth!: number;
  /**
   * cellHeight is the height of each cell in the grid
   */
  public cellHeight!: number;

  public scrollTop = 0;
  public scrollLeft = 0;
  /**
   * preview is the preview of the item that is being dragged
   */
  public preview!: PreviewDirective;

  private _editing = new BehaviorSubject<boolean>(false);
  set editing(value: boolean) {
    this._editing.next(value);
  }
  get editing() {
    return this._editing.value;
  }
  editing$ = this._editing.asObservable().pipe(distinctUntilChanged());

  public isItemScrolling = false;

  private _changes = new Subject<KcGridItemContext[]>();
  public changes = this._changes.asObservable();

  private _itemDirective!: GridDirective;

  // TODO: change to private
  _matrix!: (symbol | null)[][];
  // TODO: change to private
  protected _items: Map<symbol, KcGridItemContext> = new Map();
  private _history: Map<symbol, KcGridItemContext>[] = [];
  private _redo: Map<symbol, KcGridItemContext>[] = [];

  private _lastMoveCol = 0;
  private _lastMoveRow = 0;
  private _preventTooMuchRecursion = 0;

  private _lastDirection = new Map<symbol, Direction>();

  private _idIndex = 0;

  private _hasUndo = new BehaviorSubject<boolean>(false);
  private _hasRedo = new BehaviorSubject<boolean>(false);

  hasUndo$ = this._hasUndo.asObservable().pipe(distinctUntilChanged());
  hasRedo$ = this._hasRedo.asObservable().pipe(distinctUntilChanged());

  init(configs: {
    cols: number;
    rows: number;
    colsGaps: number[];
    rowsGaps: number[];
    cellWidth: number;
    cellHeight: number;
    preview: PreviewDirective;
    /**
     * scrollTop is the scroll top of the grid
     */
    scrollTop: number;
    /**
     * scrollLeft is the scroll left of the grid
     */
    scrollLeft: number;
    itemDirective: GridDirective;
  }) {
    this.cols = configs.cols;
    this.rows = configs.rows;
    this.colsGaps = configs.colsGaps;
    this.rowsGaps = configs.rowsGaps;
    this.cellWidth = configs.cellWidth;
    this.cellHeight = configs.cellHeight;
    this.preview = configs.preview;
    this.scrollTop = configs.scrollTop;
    this.scrollLeft = configs.scrollLeft;
    this._itemDirective = configs.itemDirective;

    this._matrix = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
  }

  add<T = void>(
    item: Omit<KcGridItem<T>, 'col' | 'row' | 'rows' | 'cols'> & Partial<Pick<KcGridItem<T>, 'rows' | 'cols'>>,
    options?: { emitEvent: boolean },
  ): symbol | null;
  add<T = void>(item: KcGridItem<T>, options?: { emitEvent: boolean }): symbol | null;
  add<T = void>(
    partialItem:
      | KcGridItem<T>
      | (Omit<KcGridItem<T>, 'col' | 'row' | 'rows' | 'cols'> & Partial<Pick<KcGridItem<T>, 'rows' | 'cols'>>),
    options: { emitEvent: boolean } = { emitEvent: true },
  ): symbol | null {
    const id = Symbol(this._idIndex++);

    let item: KcGridItem;

    if (this._checkIsKcGridItem(partialItem)) {
      item = partialItem;
    } else {
      const cols = partialItem.cols || 2;
      const rows = partialItem.rows || 2;

      // find the fist empty space for the item
      const space = this._searchEmptySpace(cols, rows);

      if (!space) return null;

      item = { ...partialItem, cols, rows, col: space.col, row: space.row } as KcGridItem;
    }

    for (let y = item.row; y < item.row + item.rows; y++) {
      for (let x = item.col; x < item.col + item.cols; x++) {
        if (this._matrix[y]) this._matrix[y][x] = id;
      }
    }

    const template = this._itemDirective.render(id, item);

    const tmpDetectChanges = template.detectChanges.bind(template);

    template.detectChanges = () => {
      tmpDetectChanges();

      console.warn('detectChanges', id.toString());
    };

    this._items.set(id, { context: item, config: { template, handle: false } });

    this._history = [];
    this.pushToHistory();

    if (options?.emitEvent) this._changes.next([...this._items.values()]);

    // TODO: implement logic to check if the item is out of the grid
    return id;
  }

  handle(id: symbol): void {
    const item = this._items.get(id);

    if (!item) return;

    item.config.handle = true;

    this.preview.render(id, item.context, GridEventType.Capture);
  }

  release(id: symbol): void {
    const item = this._items.get(id);

    if (!item) return;

    item.config.handle = false;

    this.preview.render(id, item.context, GridEventType.Release);

    this._rerenderItem(item!.config.template, item!.context);

    this.pushToHistory();
    this.updateGrid();
    this._changes.next([...this._items.values()]);

    this.render();
  }

  delete(id: symbol): void {
    const item = this._items.get(id);

    if (!item) return;

    this._removeFromMatrix(id);
    this._items.delete(id);
    this.pushToHistory();

    item.config.template.destroy();
  }

  private _checkIsKcGridItem(
    item: KcGridItem | (Omit<KcGridItem, 'col' | 'row' | 'rows' | 'cols'> & Partial<Pick<KcGridItem, 'rows' | 'cols'>>),
  ): item is KcGridItem {
    return Object.prototype.hasOwnProperty.call(item, 'col') && Object.prototype.hasOwnProperty.call(item, 'row');
  }

  move(id: symbol, item: KcGridItem): boolean {
    /**
     * skip if the item is out of the grid
     */
    if (item.col < 0 || item.row < 0 || item.col + item.cols > this.cols || item.row + item.rows > this.rows) {
      return false;
    }

    /**
     * skip if the item is already at the last position
     */
    if (item.col === this._lastMoveCol && item.row === this._lastMoveRow) {
      return false;
    }

    const tmpItems = this._cloneItems(this._items);

    this.restoreFromHistory();
    this.updateGrid();

    this._lastMoveCol = item.col;
    this._lastMoveRow = item.row;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._removeFromMatrix(id);

    this._preventTooMuchRecursion = 0;
    const change = this._move(id, item);

    if (!change) {
      this._items = tmpItems;
      this.updateGrid();
      this.render();

      return false;
    }

    this.preview.render(id, change, GridEventType.Move);

    // TODO: change this
    const itemM = this._items.get(id);

    // this._items.set(id, item);
    itemM!.context = change;

    this._addFromMatrix(id, change);

    // this._rerenderItem(itemM!.config.template, item);

    this.render();

    return true;
  }

  private _lastResizeItem: ({ id: symbol } & KcGridItemContext) | null = null;

  resize(id: symbol, item: KcGridItem): boolean {
    if (
      this._lastResizeItem &&
      this._lastResizeItem.context.col === item.col &&
      this._lastResizeItem.context.row === item.row &&
      this._lastResizeItem.context.cols === item.cols &&
      this._lastResizeItem.context.rows === item.rows
    )
      return false;

    if (item.rows === 0) return false;
    if (item.cols === 0) return false;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const last = this._lastResizeItem || this._items.get(id)!;

    const direction = getDirection(last.context, item);

    // TODO: change this
    this._lastResizeItem = { id, context: item, config: last.config };

    const tmpItems = this._cloneItems(this._items);

    this.restoreFromHistory();
    this.updateGrid();

    this._preventTooMuchRecursion = 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._removeFromMatrix(id);

    if (!direction) {
      this.preview.render(id, item, GridEventType.Move);
      return false;
    }

    const resize = this._resize(id, item, direction);

    if (!resize) {
      this._items = tmpItems;
      this.updateGrid();
      this.render();

      return false;
    }

    this.preview.render(id, item, GridEventType.Move);

    // TODO: change this
    const itemM = this._items.get(id);

    // this._items.set(id, item);
    itemM!.context = item;

    this.updateGrid();
    this._addFromMatrix(id, item);

    // this._rerenderItem(itemM!.config.template, item);

    this.render();

    return true;
  }

  private _resize(id: symbol, item: KcGridItem, direction: Direction): boolean {
    if (this._preventTooMuchRecursion > 500) {
      return false;
    }

    const tmpLastDirection = new Map(this._lastDirection);
    this._lastDirection = new Map();

    this._preventTooMuchRecursion += 1;

    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        const over = this._matrix[y]?.[x];

        if (!over) continue;

        if (id === over) continue;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overItem = this._items.get(over)!;

        const ddd = tmpLastDirection.get(over) || direction;

        const canShrink = shrink(overItem.context, item, ddd);

        if (!canShrink) {
          this._lastDirection = tmpLastDirection;
          return false;
        }

        this._lastDirection.set(over, ddd);
      }
    }

    return true;
  }

  private _move(id: symbol, item: KcGridItem): KcGridItem | null {
    if (this._preventTooMuchRecursion > 500) {
      return null;
    }

    this._preventTooMuchRecursion += 1;

    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        const overId = this._matrix[y]?.[x];

        if (!overId) continue;

        if (id === overId) continue;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overItem = this._items.get(overId)!;

        // TODO need to compare center of the item not first cell of left top corner
        const direction = getPosition(
          {
            x: overItem.context.col,
            y: overItem.context.row,
            width: overItem.context.cols,
            height: overItem.context.rows,
          },
          { x: item.col, y: item.row, width: item.cols, height: item.rows },
        );

        if (direction === Position.Right) {
          const shift = overItem.context.col + overItem.context.cols - item.col;

          if (!this._shiftToLeft(overId, overItem.context, shift)) return null;
        } else if (direction === Position.Left) {
          const shift = item.col + item.cols - overItem.context.col;

          if (!this._shiftToRight(overId, overItem.context, shift)) return null;
        } else if (direction === Position.Bottom) {
          const shift = overItem.context.row + overItem.context.rows - item.row;

          if (!this._shiftToTop(overId, overItem.context, shift)) return null;
        } else if (direction === Position.Top) {
          const shift = item.row + item.rows - overItem.context.row;

          if (!this._shiftToBottom(overId, overItem.context, shift)) return null;
        } else if (direction === Position.Center) {
          const swap = this.swap(id, overId);

          if (swap) return swap;
        } else {
          return null;
        }
      }
    }

    return item;
  }

  private _shiftToLeft(id: symbol, item: KcGridItem, shift: number): boolean {
    // check if there is enough space to shift to left
    if (item.col - shift < 0) return false;

    if (
      !this._move(id, {
        ...item,
        col: item.col - shift,
      })
    )
      return false;

    shiftToLeft(this._matrix, id, item, shift);

    item.col -= shift;

    const template = this._items.get(id)!.config.template;

    this._rerenderItem(template, item);

    return true;
  }

  private _shiftToRight(id: symbol, item: KcGridItem, shift: number): boolean {
    // check if there is enough space to shift to right
    if (item.col + item.cols + shift > this.cols) return false;

    if (
      !this._move(id, {
        ...item,
        col: item.col + shift,
      })
    )
      return false;

    shiftToRight(this._matrix, id, item, shift);

    item.col += shift;

    const template = this._items.get(id)!.config.template;

    this._rerenderItem(template, item);

    return true;
  }

  private _shiftToTop(id: symbol, item: KcGridItem, shift: number): boolean {
    // check if there is enough space to shift to top
    if (item.row - shift < 0) return false;

    if (
      !this._move(id, {
        ...item,
        row: item.row - shift,
      })
    )
      return false;

    shiftToTop(this._matrix, id, item, shift);

    item.row -= shift;

    const template = this._items.get(id)!.config.template;

    this._rerenderItem(template, item);

    return true;
  }

  private _shiftToBottom(id: symbol, item: KcGridItem, shift: number): boolean {
    // check if there is enough space to shift to bottom
    if (item.row + item.rows + shift > this.rows) return false;

    if (
      !this._move(id, {
        ...item,
        row: item.row + shift,
      })
    )
      return false;

    shiftToBottom(this._matrix, id, item, shift);

    item.row += shift;

    const template = this._items.get(id)!.config.template;

    this._rerenderItem(template, item);

    return true;
  }

  swap(id1: symbol, id2: symbol): KcGridItem {
    this._removeFromMatrix(id1);
    this._removeFromMatrix(id2);

    let item1 = this._items.get(id1)!;
    let item2 = this._items.get(id2)!;

    const context1 = { ...item1.context };
    const context2 = { ...item2.context };
    const config1 = item1.config;
    const config2 = item2.config;

    this._items.set(id1, { context: context2, config: config1 });
    this._items.set(id2, { context: context1, config: config2 });

    item1 = this._items.get(id1)!;
    item2 = this._items.get(id2)!;

    this._addFromMatrix(id1, item1.context);
    this._addFromMatrix(id2, item2.context);

    // this._rerenderItem(item1.template, item1.context);
    // this._rerenderItem(item2.config.template, item2.context);

    return item1.context;
  }

  private _addFromMatrix(id: symbol, context: KcGridItem): void {
    for (let y = context.row; y < context.row + context.rows; y++) {
      for (let x = context.col; x < context.col + context.cols; x++) {
        if (this._matrix[y]) this._matrix[y][x] = id;
      }
    }
  }

  private _removeFromMatrix(id: symbol) {
    const item = this._items.get(id)!;

    for (let x = item.context.col; x < item.context.col + item.context.cols; x++) {
      for (let y = item.context.row; y < item.context.row + item.context.rows; y++) {
        if (this._matrix[y]) this._matrix[y][x] = null;
      }
    }
  }

  get hasUndo(): boolean {
    return this._hasUndo.value;
  }

  get hasRedo(): boolean {
    return this._hasRedo.value;
  }

  undo() {
    if (this._history.length === 1) return;

    const item = this._history.pop();
    this._redo.push(item!);

    this._hasUndo.next(this._history.length > 1);
    this._hasRedo.next(this._redo.length > 0);

    this.restoreFromHistory();
    this.updateGrid();
    this.render();
  }

  redo() {
    if (this._redo.length === 0) return;

    const item: Map<symbol, KcGridItemContext> = this._redo.pop()!;

    this._history[this._history.length - 1].forEach((tst, id) => {
      if (item.has(id)) return;
      console.log('destory', id);

      tst.config.template.destroy();
    });

    this._history.push(item!);

    this._hasUndo.next(this._history.length > 1);
    this._hasRedo.next(this._redo.length > 0);

    this.restoreFromHistory();
    this.updateGrid();
    this.render();
  }

  pushToHistory(): void {
    const items = this._cloneItems(this._items);
    this._history.push(items);
    this._redo = [];

    this._hasUndo.next(this._history.length > 1);
    this._hasRedo.next(this._redo.length > 0);
  }

  restoreFromHistory(): void {
    if (this._history.length === 0) return;

    this._items = this._cloneItems(this._history[this._history.length - 1]);
  }

  updateGrid(): void {
    this._matrix = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));

    this._items.forEach((item, id) => {
      for (let y = item.context.row; y < item.context.row + item.context.rows; y++) {
        for (let x = item.context.col; x < item.context.col + item.context.cols; x++) {
          if (this._matrix[y]) this._matrix[y][x] = id;
        }
      }
    });
  }

  render() {
    this._items.forEach((item, id) => {
      // render the item in redo logic if the item is deleted
      if (item.config.template.destroyed) {
        console.log('render', id);
        const template = this._itemDirective.render(id, item.context);

        item.config.template = template;
      }

      // skip rerendering the item if it's already rendered
      if (item.config.handle || this._checkIsEqual(item.context, item.config.template.context.$implicit)) return;

      this._rerenderItem(item.config.template, item.context);
    });

    // this._cdr.detectChanges();
  }

  // search empty space for a new item with the given size rows and cols
  private _searchEmptySpace(cols: number, rows: number): { col: number; row: number } | null {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this._matrix[y]?.[x]) continue;

        let empty = true;

        for (let yy = y; yy < y + rows; yy++) {
          for (let xx = x; xx < x + cols; xx++) {
            if (this._matrix[yy]?.[xx]) {
              empty = false;
              break;
            }
          }
        }

        if (empty) return { col: x, row: y };
      }
    }
    return null;
  }

  private _cloneItems(items: Map<symbol, KcGridItemContext>): Map<symbol, KcGridItemContext> {
    return new Map(
      [...items.entries()].map(([key, item]) => [key, { context: { ...item.context }, config: item.config }]),
    );
  }

  private _rerenderItem(
    template: EmbeddedViewRef<{ $implicit: KcGridItem; id: symbol }>,
    { col, row, cols, rows }: KcGridItem,
  ) {
    template.context.$implicit = {
      ...template.context.$implicit,
      col,
      row,
      cols,
      rows,
    };

    template.detectChanges();
  }

  private _checkIsEqual(item1: KcGridItem, item2: KcGridItem): boolean {
    return item1.col === item2.col && item1.row === item2.row && item1.cols === item2.cols && item1.rows === item2.rows;
  }
}