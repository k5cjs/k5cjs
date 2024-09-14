import { ChangeDetectorRef, EmbeddedViewRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Cell, Direction, GridEvent } from '../../types';
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

type Item = { template: EmbeddedViewRef<{ $implicit: Cell }> } & Cell;

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
  public preview!: EmbeddedViewRef<{ $implicit: Cell }>;

  public isItemsMoving = false;

  private _changes = new Subject<Item[]>();
  public changes = this._changes.asObservable();

  // TODO: change to private
  _matrix!: (symbol | null)[][];
  // TODO: change to private
  _items: Map<symbol, Item> = new Map();
  private _history: Map<symbol, Item>[] = [];

  event = new Subject<GridEvent>();

  private _lastMoveCol = 0;
  private _lastMoveRow = 0;
  private _preventTooMuchRecursion = 0;

  private _lastDirection = new Map<symbol, Direction>();

  private _cdr!: ChangeDetectorRef;

  init(configs: {
    cols: number;
    rows: number;
    colsGaps: number[];
    rowsGaps: number[];
    cellWidth: number;
    cellHeight: number;
    preview: EmbeddedViewRef<{ $implicit: Cell }>;
    /**
     * scrollTop is the scroll top of the grid
     */
    scrollTop: number;
    /**
     * scrollLeft is the scroll left of the grid
     */
    scrollLeft: number;
    changeDetectorRef: ChangeDetectorRef;
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
    this._cdr = configs.changeDetectorRef;

    this._matrix = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
  }

  add(item: Item) {
    for (let y = item.row; y < item.row + item.rows; y++) {
      for (let x = item.col; x < item.col + item.cols; x++) {
        if (this._matrix[y]) this._matrix[y][x] = item.id;
      }
    }

    this._items.set(item.id, item);

    this._history = [];
    this.pushToHistory();

    return item;
  }

  capture(item: Item): void {
    this.renderPreview(item, GridEvent.Capture);
  }

  release(item: Item): void {
    this.renderPreview(item, GridEvent.Release);
  }

  move(item: Item): boolean {
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

    const tmpItems = this._cloneItems();

    this.restoreFromHistory();
    this.updateGrid();

    this._lastMoveCol = item.col;
    this._lastMoveRow = item.row;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.remove(this._items.get(item.id)!);

    this._preventTooMuchRecursion = 0;
    const change = this._change(item);

    if (!change) {
      this._items = tmpItems;
      this.updateGrid();
      this.render();

      return false;
    }

    this.renderPreview(item, GridEvent.Move);

    this._items.set(item.id, item);

    this._rerenderItem(item.template, item);

    this.render();

    return true;
  }

  drop(): void {
    this.pushToHistory();
    this.updateGrid();
    this.render();

    this._changes.next([...this._items.values()]);
  }

  private _lastResizeItem: Item | null = null;

  resize(item: Item): boolean {
    if (
      this._lastResizeItem &&
      this._lastResizeItem.col === item.col &&
      this._lastResizeItem.row === item.row &&
      this._lastResizeItem.cols === item.cols &&
      this._lastResizeItem.rows === item.rows
    )
      return false;

    if (item.rows === 0) return false;
    if (item.cols === 0) return false;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const last = this._lastResizeItem || this._items.get(item.id)!;

    const direction = getDirection(last, item);

    this._lastResizeItem = item;

    const tmpItems = this._cloneItems();

    this.restoreFromHistory();
    this.updateGrid();

    this._preventTooMuchRecursion = 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.remove(this._items.get(item.id)!);

    if (!direction) {
      this.renderPreview(item, GridEvent.Move);
      return false;
    }

    const resize = this._resize(item, direction);

    if (!resize) {
      this._items = tmpItems;
      this.updateGrid();
      this.render();

      return false;
    }

    this.renderPreview(item, GridEvent.Move);

    this._items.set(item.id, item);

    this._rerenderItem(item.template, item);

    this.render();

    return true;
  }

  private _resize(item: Item, direction: Direction): boolean {
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

        if (item.id === over) continue;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overItem = this._items.get(over)!;

        const ddd = tmpLastDirection.get(overItem.id) || direction;

        const canShrink = shrink(overItem, item, ddd);

        if (!canShrink) {
          this._lastDirection = tmpLastDirection;
          return false;
        }

        this._lastDirection.set(overItem.id, ddd);
      }
    }

    return true;
  }

  private _change(item: Item): boolean {
    if (this._preventTooMuchRecursion > 500) {
      return false;
    }

    this._preventTooMuchRecursion += 1;

    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        const over = this._matrix[y]?.[x];

        if (!over) continue;

        if (item.id === over) continue;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overItem = this._items.get(over)!;

        // TODO need to compare center of the item not first cell of left top corner
        const direction = getPosition(
          { x: overItem.col, y: overItem.row, width: overItem.cols, height: overItem.rows },
          { x: item.col, y: item.row, width: item.cols, height: item.rows },
        );

        if (direction === Position.Right) {
          const shift = overItem.col + overItem.cols - item.col;

          if (!this._shiftToLeft(overItem, shift)) return false;
        } else if (direction === Position.Left) {
          const shift = item.col + item.cols - overItem.col;

          if (!this._shiftToRight(overItem, shift)) return false;
        } else if (direction === Position.Bottom) {
          const shift = overItem.row + overItem.rows - item.row;

          if (!this._shiftToTop(overItem, shift)) return false;
        } else if (direction === Position.Top) {
          const shift = item.row + item.rows - overItem.row;

          if (!this._shiftToBottom(overItem, shift)) return false;
        } else if (direction === Position.Center) {
          // this.swap(this._items.get(item.id)!, overItem);

          return false;
        } else {
          return false;
        }

        this._change(item);
      }
    }

    return true;
  }

  private _shiftToLeft(item: Item, shift: number): boolean {
    // check if there is enough space to shift to left
    if (item.col - shift < 0) return false;

    if (
      !this._change({
        ...item,
        col: item.col - shift,
      })
    )
      return false;

    shiftToLeft(this._matrix, item, shift);

    item.col -= shift;

    this._rerenderItem(item.template, item);

    return true;
  }

  private _shiftToRight(item: Item, shift: number): boolean {
    // check if there is enough space to shift to right
    if (item.col + item.cols + shift > this.cols) return false;

    if (
      !this._change({
        ...item,
        col: item.col + shift,
      })
    )
      return false;

    shiftToRight(this._matrix, item, shift);

    item.col += shift;

    this._rerenderItem(item.template, item);

    return true;
  }

  private _shiftToTop(item: Item, shift: number): boolean {
    // check if there is enough space to shift to top
    if (item.row - shift < 0) return false;

    if (
      !this._change({
        ...item,
        row: item.row - shift,
      })
    )
      return false;

    shiftToTop(this._matrix, item, shift);

    item.row -= shift;

    this._rerenderItem(item.template, item);

    return true;
  }

  private _shiftToBottom(item: Item, shift: number): boolean {
    // check if there is enough space to shift to bottom
    if (item.row + item.rows + shift > this.rows) return false;

    if (
      !this._change({
        ...item,
        row: item.row + shift,
      })
    )
      return false;

    shiftToBottom(this._matrix, item, shift);

    item.row += shift;

    this._rerenderItem(item.template, item);

    return true;
  }

  swap(item1: Item, item2: Item) {
    this.remove(item1);
    this.remove(item2);

    const col = item1.col;
    const row = item1.row;
    const cols = item1.cols;
    const rows = item1.rows;

    item1.col = item2.col;
    item1.row = item2.row;
    item1.cols = item2.cols;
    item1.rows = item2.rows;

    item2.col = col;
    item2.row = row;
    item2.cols = cols;
    item2.rows = rows;

    this.add(item1);
    this.add(item2);

    this._rerenderItem(item1.template, item1);

    this._rerenderItem(item2.template, item2);
  }

  remove(item: Item) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        if (this._matrix[y]) this._matrix[y][x] = null;
      }
    }
  }

  pushToHistory(): void {
    const items = this._cloneItems();
    this._history.push(items);
  }

  restoreFromHistory(): void {
    if (this._history.length === 0) return;

    this._items = new Map(
      [...this._history[this._history.length - 1].entries()].map(([key, item]) => [key, { ...item }]),
    );
  }

  updateGrid(): void {
    this._matrix = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));

    this._items.forEach((item) => {
      for (let y = item.row; y < item.row + item.rows; y++) {
        for (let x = item.col; x < item.col + item.cols; x++) {
          if (this._matrix[y]) this._matrix[y][x] = item.id;
        }
      }
    });
  }

  render() {
    this._items.forEach((item) => this._rerenderItem(item.template, item));
    this._cdr.detectChanges();
  }

  renderPreview(item: Item, event: GridEvent) {
    this.preview.context.$implicit.id = item.id;
    this.preview.context.$implicit.event = event;

    this._rerenderItem(this.preview as any, item);
  }

  back() {
    if (this._history.length === 1) return;

    this._history.pop();
    this.restoreFromHistory();
    this.updateGrid();
    this.render();
  }

  private _cloneItems(): Map<symbol, Item> {
    return new Map([...this._items.entries()].map(([key, item]) => [key, { ...item }]));
  }

  private _rerenderItem(template: Item['template'], { col, row, cols, rows }: Partial<Omit<Item, 'template'>>) {
    template.context.$implicit = {
      ...template.context.$implicit,
      ...(col !== undefined && { col }),
      ...(row !== undefined && { row }),
      ...(cols !== undefined && { cols }),
      ...(rows !== undefined && { rows }),
    };

    template.detectChanges();
  }
}
