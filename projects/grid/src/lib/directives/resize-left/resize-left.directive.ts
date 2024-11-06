import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeLeft]',
})
export class ResizeLeftDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    let x = this._calcX(e) - this._mouseOffsetLeft;

    // if x is in the last column, then we equate x to the start of the last column plus one pixel
    if (x > this._x + this._width - this._cellWidth()) x = this._x + this._width - this._cellWidth() + 1;

    const col = this._col(x);

    const cols = this.item.cols + (this.item.col - col);

    const width = this._width + (this._x - x);

    this._render({
      x: x,
      y: this._y,
      width: width,
      height: this._height,
    });

    const allowToResize = this._grid.resize(this.id, {
      ...this.item,
      col: col,
      row: this.item.row,
      cols: cols,
      rows: this.item.rows,
    });

    if (!allowToResize) return;

    this._x = x;
    this._width = width;

    // this.item.col = col;
    // this.item.cols = cols;
  }
}
