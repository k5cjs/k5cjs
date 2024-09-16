import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeTopRight]',
})
export class ResizeTopRightDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = this._x(e) + this.mouseOffsetRight;
    let y = this._y(e) - this.mouseOffsetTop;

    // if y is in the last row, then we equate y to the start of the last row plus one pixel
    if (y > this._item.y + this._item.height - this._cellHeight())
      y = this._item.y + this._item.height - this._cellHeight() + 1;
    // if x is in the first column, then we equate x to the end of the first column minus one pixel
    if (x < this._item.x + this._cellWidth()) x = this._item.x + this._cellWidth() - 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = col - this.item.col + 1;
    const rows = this.item.rows + (this.item.row - row);

    const width = x - this._item.x;
    const height = this._item.height + (this._item.y - y);

    this._item.update({
      x: this._item.x,
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

    this._item.y = y;
    this._item.width = width;
    this._item.height = height;

    this.item.row = row;
    this.item.cols = cols;
    this.item.rows = rows;
  }
}
