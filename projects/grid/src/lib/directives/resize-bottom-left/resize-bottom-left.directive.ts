import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeBottomLeft]',
})
export class ResizeBottomLeftDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = this._x(e) - this.mouseOffsetLeft;
    let y = this._y(e) + this.mouseOffsetBottom;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this.y + this._cellHeight()) y = this.y + this._cellHeight() - 1;
    // if x is in the last column, then we equate x to the start of the last column plus one pixel
    if (x > this.x + this.width - this._cellWidth()) x = this.x + this.width - this._cellWidth() + 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = this.cell.cols + (this.cell.col - col);
    const rows = row - this.cell.row + 1;

    const width = this.width + (this.x - x);
    const height = y - this.y;

    this._item.update({
      x: x,
      y: this.y,
      width: width,
      height: height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: col,
      row: this.cell.row,
      cols: cols,
      rows: rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this.cell.col = col;
    this.cell.cols = cols;
    this.cell.rows = rows;
  }
}
