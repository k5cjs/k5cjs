import { EmbeddedViewRef } from '@angular/core';

import { Cell } from './cell.type';
import { Position, getPosition } from './get-position';

type Item = { template: EmbeddedViewRef<{ $implicit: Cell }> } & Cell;

export class Grid {
  /**
   * cols are the number of columns in the grid
   */
  public cols: number;
  /**
   * rows are the number of rows in the grid
   */
  public rows: number;
  /**
   * cellWidth is the width of each cell in the grid
   */
  public cellWidth: number;
  /**
   * cellHeight is the height of each cell in the grid
   */
  public cellHeight: number;

  public scrollTop = 0;
  public scrollLeft = 0;
  /**
   * preview is the preview of the item that is being dragged
   */
  public preview: EmbeddedViewRef<{ $implicit: Cell }>;

  private _matrix: (symbol | null)[][];
  private _items: Map<symbol, Item> = new Map();
  private _history: Map<symbol, Item>[];

  constructor(configs: {
    cols: number;
    rows: number;
    cellWidth: number;
    cellHeight: number;
    preview: EmbeddedViewRef<{ $implicit: Cell }>;
    scrollTop: number;
    scrollLeft: number;
  }) {
    this.cols = configs.cols;
    this.rows = configs.rows;
    this.cellWidth = configs.cellWidth;
    this.cellHeight = configs.cellHeight;
    this.preview = configs.preview;
    this.scrollTop = configs.scrollTop;
    this.scrollLeft = configs.scrollLeft;

    this._matrix = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
    this._history = [];
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

  test = 0;

  lastCol = 0;
  lastRow = 0;

  move(item: Item): boolean {
    /**
     * skip if the item is out of the grid
     */
    if (item.col < 0 || item.row < 0 || item.col + item.cols > this.cols || item.row + item.rows > this.rows)
      return false;

    /**
     * skip if the item is already at the last position
     */
    if (item.col === this.lastCol && item.row === this.lastRow) return false;

    const tmpItems = this._cloneItems();

    this.restoreFromHistory();
    this.updateGrid();

    this.lastCol = item.col;
    this.lastRow = item.row;

    this.remove(this._items.get(item.id)!);

    this.test = 0;

    const change = this.change(item);

    if (!change) {
      this._items = tmpItems;
      this.updateGrid();
      this.render();

      console.error('unabe to change', item);

      return false;
    }

    this.renderPreview(item);

    this._items.set(item.id, item);
    item.template.context.$implicit.col = item.col;
    item.template.context.$implicit.row = item.row;
    item.template.context.$implicit.cols = item.cols;
    item.template.context.$implicit.rows = item.rows;

    item.template.detectChanges();

    this.render();

    return true;
  }

  drop(): boolean {
    this.pushToHistory();
    this.updateGrid();
    this.render();

    return true;
  }

  change(item: Item): boolean {
    this.test++;

    if (this.test > 100) {
      throw new Error('to many requests');
    }

    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        const over = this._matrix[y]?.[x];

        if (!over) continue;

        if (item.id === over) continue;

        const overItem = this._items.get(over)!;

        const direction = getPosition(
          { x: overItem.col, y: overItem.row, width: overItem.cols, height: overItem.rows },
          { x: item.col, y: item.row, width: item.cols, height: item.rows },
        );

        if (direction === Position.Right) {
          const shift = overItem.col + overItem.cols - item.col;

          if (!this.shiftToLeft(overItem, shift)) return false;
        } else if (direction === Position.Left) {
          const shift = item.col + item.cols - overItem.col;

          if (!this.shiftToRight(overItem, shift)) return false;
        } else if (direction === Position.Bottom) {
          const shift = overItem.row + overItem.rows - item.row;

          if (!this.shiftToTop(overItem, shift)) return false;
        } else if (direction === Position.Top) {
          const shift = item.row + item.rows - overItem.row;

          if (!this.shiftToBottom(overItem, shift)) return false;
        } else if (direction === Position.Center) {
          // this.swap(this._items.get(item.id)!, overItem);

          return false;
        } else {
          return false;
        }

        this.change(item);
      }
    }

    return true;
  }

  shiftToLeft(item: Item, shift: number): boolean {
    // check if there is enough space to shift to left
    if (item.col - shift < 0) return false;

    if (
      !this.change({
        ...item,
        col: item.col - shift,
      })
    )
      return false;

    // remove cols from right
    for (let x = item.col + item.cols - shift; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this._matrix[y][x] = null;
      }
    }
    // add cols to left
    for (let x = item.col - shift; x < item.col; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this._matrix[y][x] = item.id;
      }
    }

    item.col -= shift;

    this._rerenderItem(item.template, item);

    return true;
  }

  shiftToRight(item: Item, shift: number): boolean {
    // check if there is enough space to shift to right
    if (item.col + item.cols + shift > this.cols) return false;

    if (
      !this.change({
        ...item,
        col: item.col + shift,
      })
    )
      return false;

    // remove cols from left
    for (let x = item.col; x < item.col + shift; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this._matrix[y][x] = null;
      }
    }

    // add cols to right
    for (let x = item.col + item.cols; x < item.col + item.cols + shift; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this._matrix[y][x] = item.id;
      }
    }

    item.col += shift;

    this._rerenderItem(item.template, item);

    return true;
  }

  shiftToTop(item: Item, shift: number): boolean {
    // check if there is enough space to shift to top
    if (item.row - shift < 0) return false;

    if (
      !this.change({
        ...item,
        row: item.row - shift,
      })
    )
      return false;

    // remove rows from bottom
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row + item.rows - shift; y < item.row + item.rows; y++) {
        this._matrix[y][x] = null;
      }
    }

    // add rows to top
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row - shift; y < item.row; y++) {
        this._matrix[y][x] = item.id;
      }
    }

    item.row -= shift;

    this._rerenderItem(item.template, item);

    return true;
  }

  shiftToBottom(item: Item, shift: number): boolean {
    // check if there is enough space to shift to bottom
    if (item.row + item.rows + shift > this.rows) return false;

    if (
      !this.change({
        ...item,
        row: item.row + shift,
      })
    )
      return false;

    // remove rows from top
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + shift; y++) {
        this._matrix[y][x] = null;
      }
    }

    // add rows to bottom
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row + item.rows; y < item.row + item.rows + shift; y++) {
        this._matrix[y][x] = item.id;
      }
    }

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

    item1.template.context.$implicit.col = item1.col;
    item1.template.context.$implicit.row = item1.row;
    item1.template.context.$implicit.cols = item1.cols;
    item1.template.context.$implicit.rows = item1.rows;
    item1.template.detectChanges();

    item2.template.context.$implicit.col = item2.col;
    item2.template.context.$implicit.row = item2.row;
    item2.template.context.$implicit.cols = item2.cols;
    item2.template.context.$implicit.rows = item2.rows;
    item2.template.detectChanges();
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
  }

  renderPreview(item: Item) {
    this._rerenderItem(this.preview, item);
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
    if (col !== undefined) template.context.$implicit.col = col;
    if (row !== undefined) template.context.$implicit.row = row;
    if (cols !== undefined) template.context.$implicit.cols = cols;
    if (rows !== undefined) template.context.$implicit.rows = rows;

    template.detectChanges();
  }
}
