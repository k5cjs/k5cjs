import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeBottomRight]',
})
export class ResizeBottomRightDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = this._x(e) + this.mouseOffsetRight;
    let y = this._y(e) + this.mouseOffsetBottom;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this.y + this._cellHeight()) y = this.y + this._cellHeight() - 1;
    // if x is in the first column, then we equate x to the end of the first column minus one pixel
    if (x < this.x + this._cellWidth()) x = this.x + this._cellWidth() - 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = col - this.cell.col + 1;
    const rows = row - this.cell.row + 1;

    const width = x - this.x;
    const height = y - this.y;

    this._item.update({
      x: this.x,
      y: this.y,
      width: width,
      height: height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: cols,
      rows: rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this.cell.cols = cols;
    this.cell.rows = rows;
  }
}
