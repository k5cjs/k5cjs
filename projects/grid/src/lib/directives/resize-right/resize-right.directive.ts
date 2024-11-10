import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeRight]',
})
export class ResizeRightDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    let x = this._calcX(e) + this._mouseOffsetRight;

    // if x is in the first column, then we equate x to the end of the first column minus one pixel
    if (x < this._x + this._cellWidth()) x = this._x + this._cellWidth() - 1;

    const col = this._col(x);

    const cols = col - this.item.col + 1;

    const width = x - this._x;

    this._render({
      x: this._x,
      y: this._y,
      width: width,
      height: this._height,
    });

    const allowToResize = this._updateGrid({
      col: this.item.col,
      row: this.item.row,
      cols: cols,
      rows: this.item.rows,
    });

    if (!allowToResize) return;

    this._width = width;

    // this.item.cols = cols;
  }
}
