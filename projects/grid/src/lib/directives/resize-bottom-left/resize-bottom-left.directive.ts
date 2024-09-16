import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeBottomLeft]',
})
export class ResizeBottomLeftDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = this._x(e) - this.mouseOffsetLeft;
    let y = this._y(e) + this.mouseOffsetBottom;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this._item.y + this._cellHeight()) y = this._item.y + this._cellHeight() - 1;
    // if x is in the last column, then we equate x to the start of the last column plus one pixel
    if (x > this._item.x + this._item.width - this._cellWidth())
      x = this._item.x + this._item.width - this._cellWidth() + 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = this.item.cols + (this.item.col - col);
    const rows = row - this.item.row + 1;

    const width = this._item.width + (this._item.x - x);
    const height = y - this._item.y;

    this._item.update({
      x: x,
      y: this._item.y,
      width: width,
      height: height,
    });

    const allowToResize = this._grid.resize(this.id, {
      col: col,
      row: this.item.row,
      cols: cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._item.x = x;
    this._item.width = width;
    this._item.height = height;

    this.item.col = col;
    this.item.cols = cols;
    this.item.rows = rows;
  }
}
