import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { KC_GRID, GRID_TEMPLATE, ITEM_COMPONENT } from '../../tokens';
import { Cell } from '../../types';

@Directive({
  selector: '[kcGridResize]',
})
export abstract class ResizeDirective {
  @Input({ required: true }) cell!: Cell;

  mouseOffsetTop = 0;
  mouseOffsetBottom = 0;
  mouseOffsetLeft = 0;
  mouseOffsetRight = 0;

  isMouseDown = false;

  onMouseMove = this._onMouseMove.bind(this);

  protected _grid = inject(KC_GRID);
  protected _gridTemplate = inject(GRID_TEMPLATE);
  protected _item = inject(ITEM_COMPONENT);
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    // TODO: add logic in move to stop if is resizing
    e.stopPropagation();

    this._item.resizing(true);

    this.isMouseDown = true;
    this._item.skip = true;

    this._setCellPositionAndSize();
    this._setMouseOffset(e);

    document.addEventListener('mousemove', this.onMouseMove);
  }

  @HostListener('window:mouseup', ['$event'])
  protected _onMouseUp(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    this._item.resizing(false);

    this.isMouseDown = false;
    this._item.skip = false;
    document.removeEventListener('mousemove', this.onMouseMove);

    this._grid.drop();

    this._grid.release({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: this.cell.cols,
      rows: this.cell.rows,
      template: (this.cell as any).template,
    });
  }

  protected abstract _onMouseMove(e: MouseEvent): void;

  protected _setCellPositionAndSize(): void {
    const { x, y, width, height } = this._item.elementRef.nativeElement.getBoundingClientRect();

    this._item.x = x - this._gridTemplate.itemsElementRef.nativeElement.offsetLeft + this._grid.scrollLeft;
    this._item.y = y - this._gridTemplate.itemsElementRef.nativeElement.offsetTop + this._grid.scrollTop;

    this._item.width = width;
    this._item.height = height;
  }

  protected _setMouseOffset(e: MouseEvent): void {
    const { x, y, width, height } = this._item.elementRef.nativeElement.getBoundingClientRect();

    this.mouseOffsetLeft = e.clientX - x;
    this.mouseOffsetRight = x + width - e.clientX;

    this.mouseOffsetTop = e.clientY - y;
    this.mouseOffsetBottom = y + height - e.clientY;
  }

  protected _y(e: MouseEvent): number {
    return e.clientY - this._gridTemplate.itemsElementRef.nativeElement.offsetTop + this._grid.scrollTop;
  }

  protected _x(e: MouseEvent): number {
    return e.clientX - this._gridTemplate.itemsElementRef.nativeElement.offsetLeft + this._grid.scrollLeft;
  }

  protected _col(x: number): number {
    let width = 0;

    for (let i = 0; i < this._grid.cols; i++) {
      width += this._grid.colsGaps[i];
      width += this._cellWidth();

      if (width > x) return i;
    }

    return this._grid.cols - 1;
  }

  protected _row(y: number): number {
    let height = 0;

    for (let i = 0; i < this._grid.rows; i++) {
      height += this._grid.rowsGaps[i];
      height += this._cellHeight();

      if (height > y) return i;
    }

    return this._grid.rows - 1;
  }

  protected _cellWidth(): number {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridWidth = this._gridTemplate.itemsElementRef.nativeElement.offsetWidth - totalColsGaps;

    const cellWidth = gridWidth / this._grid.cols;

    return cellWidth;
  }

  protected _cellHeight(): number {
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridHeight = this._gridTemplate.itemsElementRef.nativeElement.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this._grid.rows;

    return cellHeight;
  }
}
