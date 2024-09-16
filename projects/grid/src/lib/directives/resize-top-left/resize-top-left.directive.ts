import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeTopLeft]',
})
export class ResizeTopLeftDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = this._x(e) - this.mouseOffsetLeft;
    let y = this._y(e) - this.mouseOffsetTop;

    // if y is in the last row, then we equate y to the start of the last row plus one pixel
    if (y > this._item.y + this._item.height - this._cellHeight())
      y = this._item.y + this._item.height - this._cellHeight() + 1;
    // if x is in the last column, then we equate x to the start of the last column plus one pixel
    if (x > this._item.x + this._item.width - this._cellWidth())
      x = this._item.x + this._item.width - this._cellWidth() + 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = this.item.cols + (this.item.col - col);
    const rows = this.item.rows + (this.item.row - row);

    const width = this._item.width + (this._item.x - x);
    const height = this._item.height + (this._item.y - y);

    this._item.update({
      x: x,
      y: y,
      width: width,
      height: height,
    });

    const allowToResize = this._grid.resize(this.id, {
      col: col,
      row: row,
      cols: cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._item.x = x;
    this._item.y = y;
    this._item.width = width;
    this._item.height = height;

    this.item.col = col;
    this.item.row = row;
    this.item.cols = cols;
    this.item.rows = rows;
  }
}
