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

    const rows = this.cell.rows + (this.cell.row - row);

    const height = this._item.height + (this._item.y - y);

    this._item.update({
      x: this._item.x,
      y: y,
      width: this._item.width,
      height: height,
    });

    const allowToResize = this._grid.resize({
      id: this.cell.id,
      col: this.cell.col,
      row: row,
      cols: this.cell.cols,
      rows: rows,
      template: (this.cell as any).template,
    });

    if (!allowToResize) return;

    this._item.y = y;
    this._item.height = height;

    this.cell.row = row;
    this.cell.rows = rows;
  }
}
