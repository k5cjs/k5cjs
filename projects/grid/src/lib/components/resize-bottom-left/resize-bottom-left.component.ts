import { Component, ElementRef, EmbeddedViewRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { KcGrid } from '../../helpers';
import { Cell } from '../../types';

@Component({
  selector: 'kc-grid-resize-bottom-left',
  templateUrl: './resize-bottom-left.component.html',
  styleUrls: ['./resize-bottom-left.component.scss'],
})
export class ResizeBottomLeftComponent {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;
  @Input({ required: true }) grid!: KcGrid;
  @Input({ required: true }) id!: symbol;
  @Input({ required: true }) template!: EmbeddedViewRef<{ $implicit: Cell }>;
  @Input({ required: true }) colsGaps!: number[];
  @Input({ required: true }) rowsGaps!: number[];
  @Input({ required: true }) gridRef!: HTMLElement;
  @Input({ required: true }) itemRef!: ElementRef<HTMLElement>;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() resize = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<{ x: number; y: number; width: number; height: number }>();

  isMouseDown = false;

  onMouseMove = this._onMouseMove.bind(this);

  x = 0;
  y = 0;
  width = 0;
  height = 0;

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    // TODO: add logic in move to stop if is resizing
    e.stopPropagation();

    this.resize.emit(true);

    this.isMouseDown = true;

    const { x, y, width, height } = this.itemRef.nativeElement.getBoundingClientRect();
    this.x = x - this.gridRef.offsetLeft + this.grid.scrollLeft;
    this.y = y - this.gridRef.offsetTop + this.grid.scrollTop;
    this.width = width;
    this.height = height;

    document.addEventListener('mousemove', this.onMouseMove);
  }

  @HostListener('window:mouseup', ['$event'])
  protected _onMouseUp(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    this.resize.emit(false);

    this.isMouseDown = false;
    document.removeEventListener('mousemove', this.onMouseMove);

    this.grid.drop();

    this.grid.release({
      id: this.id,
      col: this.col,
      row: this.row,
      cols: this.cols,
      rows: this.rows,
      template: this.template,
    });
  }

  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    let x = e.clientX - this.gridRef.offsetLeft + this.grid.scrollLeft;
    let y = e.clientY - this.gridRef.offsetTop + this.grid.scrollTop;

    // if y is in the first row, then we equate y to the end of the first row minus one pixel
    if (y < this.y + this._cellHeight()) y = this.y + this._cellHeight() - 1;
    // if x is in the last column, then we equate x to the start of the last column plus one pixel
    if (x > this.x + this.width - this._cellWidth()) x = this.x + this.width - this._cellWidth() + 1;

    const col = this._col(x);
    const row = this._row(y);

    const cols = this.cols + (this.col - col);
    const rows = row - this.row + 1;

    const width = this.width + (this.x - x);
    const height = y - this.y;

    this.update.emit({
      x: x,
      y: this.y,
      width: width,
      height: height,
    });

    const allowToResize = this.grid.resize({
      id: this.id,
      col: col,
      row: this.row,
      cols: cols,
      rows: rows,
      template: this.template,
    });

    if (!allowToResize) return;
  }

  private _col(x: number): number {
    let width = 0;

    for (let i = 0; i < this.grid.cols; i++) {
      width += this.colsGaps[i];
      width += this._cellWidth();

      if (width > x) return i;
    }

    return this.grid.cols - 1;
  }

  private _row(y: number): number {
    let height = 0;

    for (let i = 0; i < this.grid.rows; i++) {
      height += this.rowsGaps[i];
      height += this._cellHeight();

      if (height > y) return i;
    }

    return this.grid.rows - 1;
  }

  private _cellWidth(): number {
    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridWidth = this.gridRef.offsetWidth - totalColsGaps;

    const cellWidth = gridWidth / this.grid.cols;

    return cellWidth;
  }

  private _cellHeight(): number {
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridHeight = this.gridRef.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this.grid.rows;

    return cellHeight;
  }
}
