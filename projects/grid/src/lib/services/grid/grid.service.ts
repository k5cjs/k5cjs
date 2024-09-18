import { ChangeDetectorRef, EmbeddedViewRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
import { GridDirective } from '../../directives';

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
  public preview!: EmbeddedViewRef<{ $implicit: KcGridItem; id: symbol; event: GridEventType }>;

  public isItemsMoving = false;

  private _changes = new Subject<KcGridItemContext[]>();
  public changes = this._changes.asObservable();

  private _itemDirective!: GridDirective;

  // TODO: change to private
  _matrix!: (symbol | null)[][];
  // TODO: change to private
  protected _items: Map<symbol, KcGridItemContext> = new Map();
  private _history: Map<symbol, KcGridItemContext>[] = [];

  private _lastMoveCol = 0;
  private _lastMoveRow = 0;
  private _preventTooMuchRecursion = 0;

  private _lastDirection = new Map<symbol, Direction>();

  private _idIndex = 0;

  private _cdr!: ChangeDetectorRef;

  emit(id: symbol, item: KcGridItem, type: GridEventType): void {
    this.renderPreview(id, item, type);
  }

  init(configs: {
    cols: number;
    rows: number;
    colsGaps: number[];
    rowsGaps: number[];
    cellWidth: number;
    cellHeight: number;
    preview: EmbeddedViewRef<{ $implicit: KcGridItem; id: symbol; event: GridEventType }>;
    /**
     * scrollTop is the scroll top of the grid
     */
    scrollTop: number;
    /**
     * scrollLeft is the scroll left of the grid
     */
    scrollLeft: number;
    changeDetectorRef: ChangeDetectorRef;
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
    this._cdr = configs.changeDetectorRef;
    this._itemDirective = configs.itemDirective;

    this._matrix = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
  }

  add(context: KcGridItem): symbol | null {
    const id = Symbol(this._idIndex++);

    for (let y = context.row; y < context.row + context.rows; y++) {
      for (let x = context.col; x < context.col + context.cols; x++) {
        if (this._matrix[y]) this._matrix[y][x] = id;
      }
    }

    const template = this._itemDirective.render(id, context);

    this._items.set(id, { context, template: template });

    this._history = [];
    this.pushToHistory();

    // TODO: implement logic to check if the item is out of the grid
    return id;
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

    this.renderPreview(id, change, GridEventType.Move);

    // TODO: change this
    const itemM = this._items.get(id);

    // this._items.set(id, item);
    itemM!.context = change;

    this._rerenderItem(itemM!.template, item);

    this.render();

    return true;
  }

  drop(): void {
    this.pushToHistory();
    this.updateGrid();
    this.render();

    this._changes.next([...this._items.values()]);
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
    this._lastResizeItem = { id, context: item, template: last.template };

    const tmpItems = this._cloneItems(this._items);

    this.restoreFromHistory();
    this.updateGrid();

    this._preventTooMuchRecursion = 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._removeFromMatrix(id);

    if (!direction) {
      this.renderPreview(id, item, GridEventType.Move);
      return false;
    }

    const resize = this._resize(id, item, direction);

    if (!resize) {
      this._items = tmpItems;
      this.updateGrid();
      this.render();

      return false;
    }

    this.renderPreview(id, item, GridEventType.Move);

    // TODO: change this
    const itemM = this._items.get(id);

    // this._items.set(id, item);
    itemM!.context = item;

    this._rerenderItem(itemM!.template, item);

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

    const template = this._items.get(id)!.template;

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

    const template = this._items.get(id)!.template;

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

    const template = this._items.get(id)!.template;

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

    const template = this._items.get(id)!.template;

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
    const template1 = item1.template;
    const template2 = item2.template;

    this._items.set(id1, { context: context2, template: template1 });
    this._items.set(id2, { context: context1, template: template2 });

    item1 = this._items.get(id1)!;
    item2 = this._items.get(id2)!;

    // this._addFromMatrix(id1, item1.context);
    this._addFromMatrix(id2, item2.context);

    // this._rerenderItem(item1.template, item1.context);
    this._rerenderItem(item2.template, item2.context);

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

  pushToHistory(): void {
    const items = this._cloneItems(this._items);
    this._history.push(items);
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
    this._items.forEach((item) => this._rerenderItem(item.template, item.context));
    this._cdr.detectChanges();
  }

  renderPreview(id: symbol, item: KcGridItem, event: GridEventType) {
    this.preview.context.id = id;
    this.preview.context.$implicit = item;
    this.preview.context.event = event;

    this._rerenderItem(this.preview, item);
  }

  back() {
    if (this._history.length === 1) return;

    this._history.pop();
    this.restoreFromHistory();
    this.updateGrid();
    this.render();
  }

  private _cloneItems(items: Map<symbol, KcGridItemContext>): Map<symbol, KcGridItemContext> {
    return new Map(
      [...items.entries()].map(([key, item]) => [key, { context: { ...item.context }, template: item.template }]),
    );
  }

  private _rerenderItem(
    template: EmbeddedViewRef<{ $implicit: KcGridItem; id: symbol }>,
    { col, row, cols, rows }: KcGridItem,
  ) {
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
