import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeBottom]',
})
export class ResizeBottomDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    let y = this._calcY(e) + this._mouseOffsetBottom;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this._y + this._cellHeight()) y = this._y + this._cellHeight() - 1;

    const row = this._row(y);

    const rows = row - this.item.row + 1;

    const height = y - this._y;

    this._render({
      x: this._x,
      y: this._y,
      width: this._width,
      height: height,
    });

    const allowToResize = this._grid.resize(this.id, {
      ...this.item,
      col: this.item.col,
      row: this.item.row,
      cols: this.item.cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._height = height;

    // this.item.rows = rows;
  }
}
