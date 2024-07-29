import { Component, ElementRef, EmbeddedViewRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { Grid } from '../../helpers';
import { Cell } from '../../types';

@Component({
  selector: 'kc-grid-resize-left',
  templateUrl: './resize-left.component.html',
  styleUrls: ['./resize-left.component.scss'],
})
export class ResizeLeftComponent {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;
  @Input({ required: true }) grid!: Grid;
  @Input({ required: true }) id!: symbol;
  @Input({ required: true }) template!: EmbeddedViewRef<{ $implicit: Cell }>;
  @Input({ required: true }) colsGaps!: number[];
  @Input({ required: true }) rowsGaps!: number[];
  @Input({ required: true }) gridRef!: HTMLElement;
  @Input({ required: true }) itemRef!: ElementRef<HTMLElement>;

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

    const x = e.clientX - this.gridRef.offsetLeft + this.grid.scrollLeft;

    const col = this._col(x);

    const cols = this.cols + (this.col - col);

    const width = this.width + (this.x - x);

    this.update.emit({
      x: x,
      y: this.y,
      width: width,
      height: this.height,
    });

    const allowToResize = this.grid.resize({
      id: this.id,
      col: col,
      row: this.row,
      cols: cols,
      rows: this.rows,
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

  private _cellWidth(): number {
    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridWidth = this.gridRef.offsetWidth - totalColsGaps;

    const cellWidth = gridWidth / this.grid.cols;

    return cellWidth;
  }
}
