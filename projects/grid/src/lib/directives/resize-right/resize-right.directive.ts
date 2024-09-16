import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeRight]',
})
export class ResizeRightDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = this._x(e) + this.mouseOffsetRight;

    // if x is in the first column, then we equate x to the end of the first column minus one pixel
    if (x < this._item.x + this._cellWidth()) x = this._item.x + this._cellWidth() - 1;

    const col = this._col(x);

    const cols = col - this.item.col + 1;

    const width = x - this._item.x;

    this._item.update({
      x: this._item.x,
      y: this._item.y,
      width: width,
      height: this._item.height,
    });

    const allowToResize = this._grid.resize(this.id, {
      col: this.item.col,
      row: this.item.row,
      cols: cols,
      rows: this.item.rows,
    });

    if (!allowToResize) return;

    this._item.width = width;

    this.item.cols = cols;
  }
}
