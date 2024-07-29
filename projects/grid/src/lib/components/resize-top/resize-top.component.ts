import { Component, ElementRef, EmbeddedViewRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { Grid } from '../../helpers';
import { Cell } from '../../types';

@Component({
  selector: 'kc-grid-resize-top',
  templateUrl: './resize-top.component.html',
  styleUrls: ['./resize-top.component.scss'],
})
export class ResizeTopComponent {
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

    const y = e.clientY - this.gridRef.offsetTop + this.grid.scrollTop;

    const row = this._row(y);

    const rows = this.rows + (this.row - row);

    const height = this.height + (this.y - y);

    this.update.emit({
      x: this.x,
      y: y,
      width: this.width,
      height: height,
    });

    const allowToResize = this.grid.resize({
      id: this.id,
      col: this.col,
      row: row,
      cols: this.cols,
      rows: rows,
      template: this.template,
    });

    if (!allowToResize) return;
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

  private _cellHeight(): number {
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridHeight = this.gridRef.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this.grid.rows;

    return cellHeight;
  }
}
