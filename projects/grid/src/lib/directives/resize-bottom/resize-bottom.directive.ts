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

    const rows = row - this.cell.row + 1;

    const height = y - this._item.y;

    this._item.update({
      x: this._item.x,
      y: this._item.y,
      width: this._item.width,
      height: height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: this.cell.cols,
      rows: rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this._item.height = height;

    this.cell.rows = rows;
  }
}
