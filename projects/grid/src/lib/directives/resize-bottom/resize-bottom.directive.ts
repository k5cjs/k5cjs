import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeBottom]',
})
export class ResizeBottomDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let y = this._y(e) + this.mouseOffsetBottom;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this._item.y + this._cellHeight()) y = this._item.y + this._cellHeight() - 1;

    const row = this._row(y);

    const rows = row - this.item.row + 1;

    const height = y - this._item.y;

    this._item.update({
      x: this._item.x,
      y: this._item.y,
      width: this._item.width,
      height: height,
    });

    const allowToResize = this._grid.resize(this.id, {
      col: this.item.col,
      row: this.item.row,
      cols: this.item.cols,
      rows: rows,
    });

    if (!allowToResize) return;

    this._item.height = height;

    this.item.rows = rows;
  }
}
