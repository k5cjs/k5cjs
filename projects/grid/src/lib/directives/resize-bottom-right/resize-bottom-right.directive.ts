import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeBottomRight]',
})
export class ResizeBottomRightDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    let x = this._calcX(e) + this._mouseOffsetRight;
    let y = this._calcY(e) + this._mouseOffsetBottom;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this._y + this._cellHeight()) y = this._y + this._cellHeight() - 1;
    // if x is in the first column, then we equate x to the end of the first column minus one pixel
    if (x < this._x + this._cellWidth()) x = this._x + this._cellWidth() - 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = col - this.item.col + 1;
    const rows = row - this.item.row + 1;

    const width = x - this._x;
    const height = y - this._y;

    this._render({
      x: this._x,
      y: this._y,
      width: width,
      height: height,
    });

    const allowToResize = this._updateGrid({
      col: this.item.col,
      row: this.item.row,
      cols: cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._width = width;
    this._height = height;

    // this.item.cols = cols;
    // this.item.rows = rows;
  }
}
