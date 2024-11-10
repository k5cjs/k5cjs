import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeBottomLeft]',
})
export class ResizeBottomLeftDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    let x = this._calcX(e) - this._mouseOffsetLeft;
    let y = this._calcY(e) + this._mouseOffsetBottom;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this._y + this._cellHeight()) y = this._y + this._cellHeight() - 1;
    // if x is in the last column, then we equate x to the start of the last column plus one pixel
    if (x > this._x + this._width - this._cellWidth()) x = this._x + this._width - this._cellWidth() + 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = this.item.cols + (this.item.col - col);
    const rows = row - this.item.row + 1;

    const width = this._width + (this._x - x);
    const height = y - this._y;

    this._render({
      x: x,
      y: this._y,
      width: width,
      height: height,
    });

    const allowToResize = this._updateGrid({
      col: col,
      row: this.item.row,
      cols: cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._x = x;
    this._width = width;
    this._height = height;

    // this.item.col = col;
    // this.item.cols = cols;
    // this.item.rows = rows;
  }
}
