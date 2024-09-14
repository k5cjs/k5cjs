import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  forwardRef,
  inject,
} from '@angular/core';

import { Cell } from '../../types';
import { GRID_TEMPLATE, GridItemTemplate, ITEM_COMPONENT, KC_GRID } from '../../tokens';
import { GridItemDirective } from '../../directives';

@Component({
  selector: 'kc-grid-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ITEM_COMPONENT,
      useFactory: (component: ItemComponent) => component,
      deps: [forwardRef(() => ItemComponent)],
    },
  ],
})
export class ItemComponent<T = void> implements OnInit, OnChanges, GridItemTemplate {
  @Input({ required: true }) cell!: Cell;

  @Input({ required: true }) gridRef!: HTMLElement;
  @Input({ required: true }) scale!: number;

  @Input({ required: true }) gridItem!: GridItemDirective<T>;

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

  injector = inject(Injector);

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

  isResizing = false;

  skip = false;

  protected _grid = inject(KC_GRID);
  protected _gridTemplate = inject(GRID_TEMPLATE);

  ngOnInit(): void {
    this._isInitialized = true;

    this._renderByColAndRow();
  }

  ngOnChanges({ rowsGaps }: SimpleChanges): void {
    if (!this._isInitialized) return;
    if (this.isMouseDown) return;

    if (this.skip) return;

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

  /**
   * is used to move by grid
   */
  renderMove(color = 'green'): void {
    this._render(color);

    const col = this._col();
    const row = this._row();

    const allowToMove = this._grid.move({
      id: this.cell.id,
      col,
      row,
      cols: this.cell.cols,
      rows: this.cell.rows,
      template: this.cell.template!,
    });
    /**
     * skip if movement is not possible
     */
    if (!allowToMove) return;
    /**
     * save the last position when the movement is possible
     */
    this.cell.col = col;
    this.cell.row = row;
  }

  private _render(color = 'yellow') {
    const zIndex = color === 'green' ? 999 : 1;

    const element = this.elementRef.nativeElement;

    element.style.transition = '';

    element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    element.style.zIndex = `${zIndex}`;
    element.style.backgroundColor = color;
  }

  private _col(): number {
    let width = 0;

    for (let i = 0; i < this._grid.cols; i++) {
      width += this._grid.colsGaps[i];
      width += this._cellWidth();

      if (width > this.x) return i;
    }

    return this._grid.cols - 1;
  }

  private _row(): number {
    let height = 0;

    for (let i = 0; i < this._grid.rows; i++) {
      height += this._grid.rowsGaps[i];
      height += this._cellHeight();

      if (height > this.y) return i;
    }

    return this._grid.rows - 1;
  }

  private _cellWidth(): number {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridWidth = this.gridRef.offsetWidth - totalColsGaps;

    const cellWidth = gridWidth / this._grid.cols;

    return cellWidth;
  }

  private _cellHeight(): number {
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridHeight = this.gridRef.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this._grid.rows;

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

  private _renderByColAndRow() {
    this._setWidthByCols(this.elementRef.nativeElement);
    this._setHeightByRows(this.elementRef.nativeElement);
    this._setTransform(this.elementRef.nativeElement);

    this.elementRef.nativeElement.style.zIndex = '';
  }

  private _setTransform(element: HTMLElement): void {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const colGaps = this._grid.colsGaps.slice(0, this.cell.col).reduce((acc, gap) => acc + gap, 0);
    const rowGaps = this._grid.rowsGaps.slice(0, this.cell.row).reduce((acc, gap) => acc + gap, 0);

    const xx = this.cell.col / this._grid.cols;
    const yy = this.cell.row / this._grid.rows;

    // eslint-disable-next-line max-len
    element.style.transform = `translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGaps}px))`;
  }

  private _setWidthByCols(element: HTMLElement): void {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsInCols = this._grid.colsGaps
      .slice(this.cell.col, this.cell.col + this.cell.cols - 1)
      .reduce((acc, gap) => acc + gap, 0);

    element.style.width = `calc((100cqw - ${totalColsGaps}px) / ${this._grid.cols} * ${this.cell.cols} + ${gapsInCols}px)`;
  }

  private _setHeightByRows(element: HTMLElement): void {
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsInRows = this._grid.rowsGaps
      .slice(this.cell.row, this.cell.row + this.cell.rows - 1)
      .reduce((acc, gap) => acc + gap, 0);

    element.style.height = `calc((100cqh - ${totalRowsGaps}px) / ${this._grid.rows} * ${this.cell.rows} + ${gapsInRows}px)`;
  }
}
