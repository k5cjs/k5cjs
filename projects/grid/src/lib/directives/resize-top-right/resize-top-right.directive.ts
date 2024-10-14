import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeTopRight]',
})
export class ResizeTopRightDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    let x = this._calcX(e) + this._mouseOffsetRight;
    let y = this._calcY(e) - this._mouseOffsetTop;

    // if y is in the last row, then we equate y to the start of the last row plus one pixel
    if (y > this._y + this._height - this._cellHeight()) y = this._y + this._height - this._cellHeight() + 1;
    // if x is in the first column, then we equate x to the end of the first column minus one pixel
    if (x < this._x + this._cellWidth()) x = this._x + this._cellWidth() - 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = col - this.item.col + 1;
    const rows = this.item.rows + (this.item.row - row);

    const width = x - this._x;
    const height = this._height + (this._y - y);

    this._render({
      x: this._x,
      y: y,
      width: width,
      height: height,
    });

    const allowToResize = this._grid.resize(this.id, {
      rows: rows,
      col: this.item.col,
      row: row,
      cols: cols,
    });

    if (!allowToResize) return;

    this._y = y;
    this._width = width;
    this._height = height;

    // this.item.row = row;
    // this.item.cols = cols;
    // this.item.rows = rows;
  }
}
