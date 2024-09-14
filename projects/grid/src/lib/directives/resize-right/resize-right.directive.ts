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
    if (x < this.x + this._cellWidth()) x = this.x + this._cellWidth() - 1;

    const col = this._col(x);

    const cols = col - this.cell.col + 1;

    const width = x - this.x;

    this._item.update({
      x: this.x,
      y: this.y,
      width: width,
      height: this.height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: cols,
      rows: this.cell.rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this.cell.cols = cols;
  }
}
