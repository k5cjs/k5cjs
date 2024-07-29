import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import { Grid } from '../../helpers';
import { Cell } from '../../types';

@Component({
  selector: 'kc-grid-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent implements OnInit, OnChanges {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;
  @Input({ required: true }) grid!: Grid;
  @Input({ required: true }) id!: symbol;
  @Input({ required: true }) template!: EmbeddedViewRef<{ $implicit: Cell }>;
  @Input({ required: true }) gridRef!: HTMLElement;
  @Input({ required: true }) scale!: number;

  @Input({ required: true }) colsGaps!: number[];
  @Input({ required: true }) rowsGaps!: number[];

  @Output() move = new EventEmitter<{
    x: number;
    y: number;
    width: number;
    height: number;
    item: ItemComponent;
  }>();
  @Output() stop = new EventEmitter<void>();

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  //
  width!: number;
  height!: number;

  private _animation: Animation | null = null;

  private _isInitialized = false;
  /**
   * actual position in grid (x, y) in pixels
   */
  x = 0;
  /*
   * actual position in grid (x, y) in pixels
   */
  y = 0;
  mouseOffsetLeft = 0;
  /**
   * distance from mouse to top corner of the item
   */
  mouseOffsetTop = 0;

  isMouseDown = false;

  onMouseMove = this._onMouseMove.bind(this);

  isResizing = false;

  ngOnInit(): void {
    this._isInitialized = true;

    this._renderByColAndRow();
  }

  ngOnChanges({ rowsGaps }: SimpleChanges): void {
    if (!this._isInitialized) return;
    if (this.isMouseDown) return;
    if (this.isResizing) return;

    if (rowsGaps) {
      this._renderByColAndRow();
    } else {
      this._renderByColAndRowAnimated();
    }
  }

  update({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void {
    const element = this.elementRef.nativeElement;

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    element.style.transform = `translate(${x}px, ${y}px)`;
  }

  resizing(value: boolean): void {
    this.isResizing = value;

    if (!value) this.releaseResizing();
  }

  releaseResizing(): void {
    this._renderByColAndRowAnimated();
  }

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    const { x, y } = this.elementRef.nativeElement.getBoundingClientRect();

    this.isMouseDown = true;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    this.mouseOffsetLeft = mouseX - x;
    this.mouseOffsetTop = mouseY - y;

    this._setFixedSize(this.elementRef.nativeElement);
    this._animation?.cancel();

    this.grid.capture({
      id: this.id,
      col: this.col,
      row: this.row,
      cols: this.cols,
      rows: this.rows,
      template: this.template,
    });

    document.addEventListener('mousemove', this.onMouseMove);
  }

  /**
   * use event from window to avoid losing the mouseup event when the mouse is out of the item
   */
  @HostListener('window:mouseup', ['$event'])
  protected _onMouseUp(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    this.isMouseDown = false;
    document.removeEventListener('mousemove', this.onMouseMove);

    this.stop.emit();
    this.grid.drop();

    this._renderByColAndRowAnimated();

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

    const itemOffsetLeft = e.clientX - this.gridRef.offsetLeft - this.mouseOffsetLeft; // px
    this.x = itemOffsetLeft + this.grid.scrollLeft;

    const itemOffsetTop = e.clientY - this.gridRef.offsetTop - this.mouseOffsetTop; // px
    this.y = itemOffsetTop + this.grid.scrollTop;

    const col = this._col();
    const row = this._row();

    this._render('green');

    this.move.emit({
      x: itemOffsetLeft,
      y: itemOffsetTop,
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetHeight,
      item: this,
    });

    const allowToMove = this.grid.move({
      id: this.id,
      col,
      row,
      cols: this.cols,
      rows: this.rows,
      template: this.template,
    });

    /**
     * skip if movement is not possible
     */
    if (!allowToMove) return;
    /**
     * save the last position when the movement is possible
     */
    this.col = col;
    this.row = row;
  }

  /**
   * is used to move by grid
   */
  renderMove(color = 'green'): void {
    this._render(color);

    const col = this._col();
    const row = this._row();

    const allowToMove = this.grid.move({
      id: this.id,
      col,
      row,
      cols: this.cols,
      rows: this.rows,
      template: this.template,
    });
    /**
     * skip if movement is not possible
     */
    if (!allowToMove) return;
    /**
     * save the last position when the movement is possible
     */
    this.col = col;
    this.row = row;
  }

  private _render(color = 'yellow') {
    const zIndex = color === 'green' ? 999 : 1;

    this.elementRef.nativeElement.style.transition = '';

    this.elementRef.nativeElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.elementRef.nativeElement.style.zIndex = `${zIndex}`;
    this.elementRef.nativeElement.style.backgroundColor = color;
  }

  private _col(): number {
    let width = 0;

    for (let i = 0; i < this.grid.cols; i++) {
      width += this.colsGaps[i];
      width += this._cellWidth();

      if (width > this.x) return i;
    }

    return this.grid.cols - 1;
  }

  private _row(): number {
    let height = 0;

    for (let i = 0; i < this.grid.rows; i++) {
      height += this.rowsGaps[i];
      height += this._cellHeight();

      if (height > this.y) return i;
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

  private _renderByColAndRowAnimated() {
    this.elementRef.nativeElement.style.transition = '300ms';
    this._renderByColAndRow();

    this.elementRef.nativeElement.addEventListener(
      'transitionend',
      () => (this.elementRef.nativeElement.style.transition = ''),
      false,
    );
  }

  private _setFixedSize(element: HTMLElement): void {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const style = getComputedStyle(element).transform;

    const [, left] = /([-\d\.]+), [-\d\.]+\)/.exec(style)!;
    const [, top] = /([-\d\.]+)\)/.exec(style)!;

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    element.style.transform = `translate(${left}px, ${top}px)`;
  }

  private _renderByColAndRow() {
    this._setWidthByCols(this.elementRef.nativeElement);
    this._setHeightByRows(this.elementRef.nativeElement);
    this._setTransform(this.elementRef.nativeElement);

    this.elementRef.nativeElement.style.zIndex = '';
  }

  private _setTransform(element: HTMLElement): void {
    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const colGaps = this.colsGaps.slice(0, this.col).reduce((acc, gap) => acc + gap, 0);
    const rowGaps = this.rowsGaps.slice(0, this.row).reduce((acc, gap) => acc + gap, 0);

    const xx = this.col / this.grid.cols;
    const yy = this.row / this.grid.rows;

    // eslint-disable-next-line max-len
    element.style.transform = `translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGaps}px))`;
  }

  private _setWidthByCols(element: HTMLElement): void {
    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsInCols = this.colsGaps.slice(this.col, this.col + this.cols - 1).reduce((acc, gap) => acc + gap, 0);

    element.style.width = `calc((100cqw - ${totalColsGaps}px) / ${this.grid.cols} * ${this.cols} + ${gapsInCols}px)`;
  }

  private _setHeightByRows(element: HTMLElement): void {
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsInRows = this.rowsGaps.slice(this.row, this.row + this.rows - 1).reduce((acc, gap) => acc + gap, 0);

    element.style.height = `calc((100cqh - ${totalRowsGaps}px) / ${this.grid.rows} * ${this.rows} + ${gapsInRows}px)`;
  }
}
