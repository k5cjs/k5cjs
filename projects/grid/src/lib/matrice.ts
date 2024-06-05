import { EmbeddedViewRef } from '@angular/core';

import { Position, getPosition } from './get-position';

interface Item {
  id: symbol;
  col: number;
  row: number;
  cols: number;
  rows: number;
  template?: EmbeddedViewRef<unknown>;
}
/**
 *
 */
export class Matrice {
  private _grid: (symbol | null)[][];
  private _history: Map<symbol, Item>[];

  private _items: Map<symbol, Item> = new Map();

  constructor(public cols: number, public rows: number, public preview: EmbeddedViewRef<unknown>) {
    this._grid = new Array(rows).fill(null).map(() => new Array(cols).fill(null));
    this._history = [];
  }

  add(item: Item) {
    for (let y = item.row; y < item.row + item.rows; y++) {
      for (let x = item.col; x < item.col + item.cols; x++) {
        if (this._grid[y]) this._grid[y][x] = item.id;
      }
    }

    this._items.set(item.id, item);

    this.pushToHistory();

    return item;
  }

  // tmpGrid: (symbol | null)[][] = [];
  tmpItems: Map<symbol, Item> = new Map();

  init() {
    // this.tmpGrid = this._grid.map((row) => row.map((id) => id));
    this.tmpItems = new Map([...this._items.entries()].map(([key, item]) => [key, { ...item }]));

    // console.table(this.tmpGrid);
    console.log('init');
  }

  lastCol1 = 0;
  lastRow1 = 0;

  reset(item: Item) {
    if (item.col === this.lastCol1 && item.row === this.lastRow1) return;

    this.lastCol1 = item.col;
    this.lastRow1 = item.row;

    // this._grid = this.tmpGrid.map((row) => row.map((id) => id));
    this._items = new Map([...this.tmpItems.entries()].map(([key, item]) => [key, { ...item }]));

    this._items.forEach((item1) => {
      if (!item1.template) return;

      if (item.id === item1.id) return;

      (item1.template.context as any).$implicit.col = item1.col;
      (item1.template.context as any).$implicit.row = item1.row;
      (item1.template.context as any).$implicit.cols = item1.cols;
      (item1.template.context as any).$implicit.rows = item1.rows;

      item1.template.detectChanges();
    });

    console.log('reset');

    console.table(this._grid);
  }

  update() {
    // this.tmpGrid = this._grid.map((row) => row.map((id) => id));
    this.tmpItems = new Map([...this._items.entries()].map(([key, item]) => [key, { ...item }]));
  }

  test = 0;

  lastCol = 0;
  lastRow = 0;

  move(item: Item) {
    /**
     * skip if the item is already at the last position
     */
    if (item.col === this.lastCol && item.row === this.lastRow) return;

    this.lastCol = item.col;
    this.lastRow = item.row;

    this.remove(this._items.get(item.id)!);

    this.test = 0;

    const change = this.change(item);

    if (!change) {
      throw new Error('Can not move');
    }

    (this.preview.context as any).$implicit.col = item.col;
    (this.preview.context as any).$implicit.row = item.row;
    (this.preview.context as any).$implicit.cols = item.cols;
    (this.preview.context as any).$implicit.rows = item.rows;

    this.preview.detectChanges();
  }

  change(item: Item): boolean {
    this.test++;

    if (this.test > 100) {
      throw new Error('to many requests');
    }

    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        const over = this._grid[y]?.[x];

        console.log('over', over, item);

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

    this.remove(this._items.get(item.id)!);
    this.add(item);
    this._items.set(item.id, item);

    (item.template!.context as any).$implicit.col = item.col;
    (item.template!.context as any).$implicit.row = item.row;
    (item.template!.context as any).$implicit.cols = item.cols;
    (item.template!.context as any).$implicit.rows = item.rows;

    item.template!.detectChanges();

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
        this._grid[y][x] = null;
      }
    }
    // add cols to left
    for (let x = item.col - shift; x < item.col; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this._grid[y][x] = item.id;
      }
    }

    item.col -= shift;

    (item.template!.context as any).$implicit.col = item.col;
    item.template!.detectChanges();

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
        this._grid[y][x] = null;
      }
    }

    // add cols to right
    for (let x = item.col + item.cols; x < item.col + item.cols + shift; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this._grid[y][x] = item.id;
      }
    }

    item.col += shift;

    (item.template!.context as any).$implicit.col = item.col;
    item.template!.detectChanges();

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
        this._grid[y][x] = null;
      }
    }

    // add rows to top
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row - shift; y < item.row; y++) {
        this._grid[y][x] = item.id;
      }
    }

    item.row -= shift;

    (item.template!.context as any).$implicit.row = item.row;
    item.template!.detectChanges();

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
        this._grid[y][x] = null;
      }
    }

    // add rows to bottom
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row + item.rows; y < item.row + item.rows + shift; y++) {
        this._grid[y][x] = item.id;
      }
    }

    item.row += shift;

    (item.template!.context as any).$implicit.row = item.row;
    item.template!.detectChanges();

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

    (item1.template!.context as any).$implicit.col = item1.col;
    (item1.template!.context as any).$implicit.row = item1.row;
    (item1.template!.context as any).$implicit.cols = item1.cols;
    (item1.template!.context as any).$implicit.rows = item1.rows;
    item1.template!.detectChanges();

    (item2.template!.context as any).$implicit.col = item2.col;
    (item2.template!.context as any).$implicit.row = item2.row;
    (item2.template!.context as any).$implicit.cols = item2.cols;
    (item2.template!.context as any).$implicit.rows = item2.rows;
    item2.template!.detectChanges();
  }

  remove(item: Item) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        if (this._grid[y]) this._grid[y][x] = null;
      }
    }
  }

  pushToHistory(): void {
    this._history.push(new Map([...this._items.entries()].map(([key, item]) => [key, { ...item }])));
  }
}
