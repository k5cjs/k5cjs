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
  inject,
} from '@angular/core';

import { Cell } from '../cell.type';
import { Grid } from '../grid';

@Component({
  selector: 'lib-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
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

  ngOnInit(): void {
    this._isInitialized = true;

    this._renderByColAndRow();
  }

  ngOnChanges(): void {
    if (!this._isInitialized) return;
    if (this.isMouseDown) return;

    this._renderByColAndRowAnimated();
  }

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
    // console.log('_onMouseUp');
    if (!this.isMouseDown) return;

    e.preventDefault();

    this.isMouseDown = false;
    document.removeEventListener('mousemove', this.onMouseMove);

    this.stop.emit();
    this.grid.drop();

    this._renderByColAndRowAnimated();
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
    // console.log('renderMove');

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
    // console.log('_render');

    const zIndex = color === 'green' ? 999 : 1;

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
    // console.log('_renderByColAndRowAnimated: ', this.id, this.col, this.row);

    this._setFixedSize(this.elementRef.nativeElement);
    this._animation?.cancel();

    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const colGaps = this.colsGaps.slice(0, this.col).reduce((acc, gap) => acc + gap, 0);
    const rowGaps = this.rowsGaps.slice(0, this.row).reduce((acc, gap) => acc + gap, 0);

    const gapsInCols = this.colsGaps.slice(this.col, this.col + this.cols - 1).reduce((acc, gap) => acc + gap, 0);
    const gapsInRows = this.rowsGaps.slice(this.row, this.row + this.rows - 1).reduce((acc, gap) => acc + gap, 0);

    const xx = this.col / this.grid.cols;
    const yy = this.row / this.grid.rows;

    this._animation = this.elementRef.nativeElement.animate(
      [
        {
          transform: `translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGaps}px))`,
          width: `calc((100cqw - ${totalColsGaps}px) / ${this.grid.cols} * ${this.cols} + ${gapsInCols}px)`,
          height: `calc((100cqh - ${totalRowsGaps}px) / ${this.grid.rows} * ${this.rows} + ${gapsInRows}px)`,
        },
      ],
      {
        duration: 3000,
        easing: 'ease-in-out',
      },
    );

    this._animation.onfinish = () => {
      // console.log('onfinish', this.id);
      this._animation?.cancel();
      this._renderByColAndRow();
    };
  }

  private _setFixedSize(element: HTMLElement): void {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const style = getComputedStyle(element).transform;

    // console.log('style', style);

    const [, left] = /([-\d\.]+), [-\d\.]+\)/.exec(style)!;
    const [, top] = /([-\d\.]+)\)/.exec(style)!;

    // console.log('setFixedSize', { width, height, top, left, style: style });

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    element.style.transform = `translate(${left}px, ${top}px)`;
  }

  private _renderByColAndRow() {
    // console.log('renderByColAndRow: ', this.id, this.col, this.row);

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
