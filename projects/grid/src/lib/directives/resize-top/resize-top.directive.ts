import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeTop]',
})
export class ResizeTopDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    let y = this._calcY(e) - this._mouseOffsetTop;

    // if y is in the last row then equal th y to the last row
    if (y > this._y + this._height - this._cellHeight()) y = this._y + this._height - this._cellHeight() + 1;

    const row = this._row(y);

    const rows = this.item.rows + (this.item.row - row);

    const height = this._height + (this._y - y);

    this._render({
      x: this._x,
      y: y,
      width: this._width,
      height: height,
    });

    const allowToResize = this._grid.resize(this.id, {
      col: this.item.col,
      row: row,
      cols: this.item.cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._y = y;
    this._height = height;

    this.item.row = row;
    this.item.rows = rows;
  }
}
