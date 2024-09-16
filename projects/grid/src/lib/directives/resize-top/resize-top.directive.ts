import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeTop]',
})
export class ResizeTopDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let y = this._y(e) - this.mouseOffsetTop;

    // if y is in the last row then equal th y to the last row
    if (y > this._item.y + this._item.height - this._cellHeight())
      y = this._item.y + this._item.height - this._cellHeight() + 1;

    const row = this._row(y);

    const rows = this.item.rows + (this.item.row - row);

    const height = this._item.height + (this._item.y - y);

    this._item.update({
      x: this._item.x,
      y: y,
      width: this._item.width,
      height: height,
    });

    const allowToResize = this._grid.resize(this.id, {
      col: this.item.col,
      row: row,
      cols: this.item.cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._item.y = y;
    this._item.height = height;

    this.item.row = row;
    this.item.rows = rows;
  }
}
