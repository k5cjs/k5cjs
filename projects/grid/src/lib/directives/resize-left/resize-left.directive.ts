import { Directive } from '@angular/core';
import { ResizeDirective } from '../resize/resize.directive';

@Directive({
  selector: '[kcGridResizeLeft]',
})
export class ResizeLeftDirective extends ResizeDirective {
  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = this._x(e) - this.mouseOffsetLeft;

    // if x is in the last column, then we equate x to the start of the last column plus one pixel
    if (x > this._item.x + this._item.width - this._cellWidth())
      x = this._item.x + this._item.width - this._cellWidth() + 1;

    const col = this._col(x);

    const cols = this.cell.cols + (this.cell.col - col);

    const width = this._item.width + (this._item.x - x);

    this._item.update({
      x: x,
      y: this._item.y,
      width: width,
      height: this._item.height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: col,
      row: this.cell.row,
      cols: cols,
      rows: this.cell.rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this._item.x = x;
    this._item.width = width;

    this.cell.col = col;
    this.cell.cols = cols;
  }
}
