import { Directive, HostListener, Input, inject } from '@angular/core';
import { KC_GRID, GRID_TEMPLATE, ITEM_COMPONENT } from '../../tokens';
import { Cell } from '../../types';

@Directive({
  selector: '[kcGridResizeTopRight]',
})
export class ResizeTopRightDirective {
  @Input({ required: true }) cell!: Cell;

  private _grid = inject(KC_GRID);
  private _gridTemplate = inject(GRID_TEMPLATE);
  private _item = inject(ITEM_COMPONENT);

  isMouseDown = false;

  onMouseMove = this._onMouseMove.bind(this);

  x = 0;
  y = 0;
  width = 0;
  height = 0;

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    // TODO: add logic in move to stop if is resizing
    e.stopPropagation();

    this._item.resizing(true);

    this.isMouseDown = true;

    const { x, y, width, height } = this._item.elementRef.nativeElement.getBoundingClientRect();
    this.x = x - this._gridTemplate.itemsElementRef.nativeElement.offsetLeft + this._grid.scrollLeft;
    this.y = y - this._gridTemplate.itemsElementRef.nativeElement.offsetTop + this._grid.scrollTop;
    this.width = width;
    this.height = height;

    document.addEventListener('mousemove', this.onMouseMove);
  }

  @HostListener('window:mouseup', ['$event'])
  protected _onMouseUp(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    this._item.resizing(false);

    this.isMouseDown = false;
    document.removeEventListener('mousemove', this.onMouseMove);

    this._grid.drop();

    this._grid.release({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: this.cell.cols,
      rows: this.cell.rows,
      template: (this.cell as any).template,
    });
  }

  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = e.clientX - this._gridTemplate.itemsElementRef.nativeElement.offsetLeft + this._grid.scrollLeft;
    let y = e.clientY - this._gridTemplate.itemsElementRef.nativeElement.offsetTop + this._grid.scrollTop;

    // if y is in the last row, then we equate y to the start of the last row plus one pixel
    if (y > this.y + this.height - this._cellHeight()) y = this.y + this.height - this._cellHeight() + 1;
    // if x is in the first column, then we equate x to the end of the first column minus one pixel
    if (x < this.x + this._cellWidth()) x = this.x + this._cellWidth() - 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = col - this.cell.col + 1;
    const rows = this.cell.rows + (this.cell.row - row);

    const width = x - this.x;
    const height = this.height + (this.y - y);

    this._item.update({
      x: this.x,
      y: y,
      width: width,
      height: height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: this.cell.col,
      row: row,
      cols: cols,
      rows: rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this.cell.row = row;
    this.cell.cols = cols;
    this.cell.rows = rows;
  }

  private _col(x: number): number {
    let width = 0;

    for (let i = 0; i < this._grid.cols; i++) {
      width += this._grid.colsGaps[i];
      width += this._cellWidth();

      if (width > x) return i;
    }

    return this._grid.cols - 1;
  }

  private _row(y: number): number {
    let height = 0;

    for (let i = 0; i < this._grid.rows; i++) {
      height += this._grid.rowsGaps[i];
      height += this._cellHeight();

      if (height > y) return i;
    }

    return this._grid.rows - 1;
  }

  private _cellWidth(): number {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridWidth = this._gridTemplate.itemsElementRef.nativeElement.offsetWidth - totalColsGaps;

    const cellWidth = gridWidth / this._grid.cols;

    return cellWidth;
  }

  private _cellHeight(): number {
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridHeight = this._gridTemplate.itemsElementRef.nativeElement.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this._grid.rows;

    return cellHeight;
  }
}
