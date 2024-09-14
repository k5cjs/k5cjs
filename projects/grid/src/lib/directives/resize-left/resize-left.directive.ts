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
    if (x > this.x + this.width - this._cellWidth()) x = this.x + this.width - this._cellWidth() + 1;

    const col = this._col(x);

    const cols = this.cell.cols + (this.cell.col - col);

    const width = this.width + (this.x - x);

    this._item.update({
      x: x,
      y: this.y,
      width: width,
      height: this.height,
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

    this.cell.col = col;
    this.cell.cols = cols;
  }
}
