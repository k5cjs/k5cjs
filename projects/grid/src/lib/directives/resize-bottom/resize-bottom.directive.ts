import { Directive, HostListener, Input, inject } from '@angular/core';
import { KC_GRID, GRID_TEMPLATE, ITEM_COMPONENT } from '../../tokens';
import { Cell } from '../../types';

@Directive({
  selector: '[kcGridResizeBottom]',
})
export class ResizeBottomDirective {
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

    let y = e.clientY - this._gridTemplate.itemsElementRef.nativeElement.offsetTop + this._grid.scrollTop;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this.y + this._cellHeight()) y = this.y + this._cellHeight() - 1;

    const row = this._row(y);

    const rows = row - this.cell.row + 1;

    const height = y - this.y;

    this._item.update({
      x: this.x,
      y: this.y,
      width: this.width,
      height: height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: this.cell.cols,
      rows: rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this.cell.rows = rows;
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

  private _cellHeight(): number {
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridHeight = this._gridTemplate.itemsElementRef.nativeElement.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this._grid.rows;

    return cellHeight;
  }
}
