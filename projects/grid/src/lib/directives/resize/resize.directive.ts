import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { GRID_ITEM_ID, GRID_TEMPLATE, ITEM_COMPONENT } from '../../tokens';
import { KcGridItem } from '../../types';
import { KcGridService } from '../../services';
import { gapSize } from '../../helpers';

@Directive({
  selector: '[kcGridResize]',
})
export abstract class ResizeDirective {
  @Input({ required: true }) item!: KcGridItem;

  id = inject(GRID_ITEM_ID);

  protected _x = 0;
  protected _y = 0;
  protected _width = 0;
  protected _height = 0;

  protected _mouseOffsetTop = 0;
  protected _mouseOffsetBottom = 0;
  protected _mouseOffsetLeft = 0;
  protected _mouseOffsetRight = 0;

  protected _isMouseDown = false;

  protected _onMouseMoveRef = this._onMouseMove.bind(this);
  protected _onMouseUpRef = this._onMouseUp.bind(this);

  protected _grid = inject(KcGridService);
  protected _gridTemplate = inject(GRID_TEMPLATE);
  protected _item = inject(ITEM_COMPONENT);
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private _offsetLeft = 0;
  private _offsetTop = 0;

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    // TODO: add logic in move to stop if is resizing
    e.stopPropagation();

    this._grid.handle(this.id);

    this._isMouseDown = true;

    this._setCellPositionAndSize();
    this._setMouseOffset(e);

    this._grid.editing = true;

    document.addEventListener('mousemove', this._onMouseMoveRef);
    document.addEventListener('mouseup', this._onMouseUpRef);
  }

  protected _onMouseUp(e: MouseEvent): void {
    if (!this._isMouseDown) return;

    e.preventDefault();

    this._isMouseDown = false;

    this._grid.release(this.id);

    document.removeEventListener('mousemove', this._onMouseMoveRef);
    document.removeEventListener('mouseup', this._onMouseMoveRef);

    this._grid.editing = false;
  }

  protected abstract _onMouseMove(e: MouseEvent): void;

  protected _updateGrid(config: { col: number; row: number; cols: number; rows: number }): boolean {
    return this._grid.resize(this.id, {
      ...this.item,
      ...config,
    });
  }

  protected _calcY(e: MouseEvent): number {
    return e.clientY - this._offsetTop + this._grid.scrollTop;
  }

  protected _calcX(e: MouseEvent): number {
    return e.clientX - this._offsetLeft + this._grid.scrollLeft;
  }

  protected _col(x: number): number {
    // calculate the width till the x position
    let width = 0;

    for (let i = 0; i < this._grid.cols; i++) {
      width += gapSize(this._grid.colsGaps[i]);
      // TODO: implement memoization function to prevent to calculate every time
      width += this._cellWidth();

      if (width > x) return i;
    }

    return this._grid.cols - 1;
  }

  protected _row(y: number): number {
    // calculate the height till the y position
    let height = 0;

    for (let i = 0; i < this._grid.rows; i++) {
      height += gapSize(this._grid.rowsGaps[i]);
      // TODO: implement memoization function to prevent to calculate every time
      height += this._cellHeight();

      if (height > y) return i;
    }

    return this._grid.rows - 1;
  }

  protected _cellWidth(): number {
    const totalColsGaps = this._grid.colsGaps.reduce<number>((acc, gap) => acc + gapSize(gap), 0);
    const gridWidth = this._gridTemplate.itemsElementRef.nativeElement.offsetWidth - totalColsGaps;

    const cellWidth = gridWidth / this._grid.cols;

    return cellWidth;
  }

  protected _cellHeight(): number {
    const totalRowsGaps = this._grid.rowsGaps.reduce<number>((acc, gap) => acc + gapSize(gap), 0);
    const gridHeight = this._gridTemplate.itemsElementRef.nativeElement.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this._grid.rows;

    return cellHeight;
  }

  protected _render({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void {
    const element = this._item.elementRef.nativeElement;

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    element.style.transform = `translate(${x}px, ${y}px)`;
    element.style.zIndex = `999`;
    element.style.background = 'pink';
  }

  private _setCellPositionAndSize(): void {
    this._offsetLeft = this._calculateOffsetLeft(this._gridTemplate.itemsElementRef.nativeElement);
    this._offsetTop = this._calculateOffsetTop(this._gridTemplate.itemsElementRef.nativeElement);

    const { x, y, width, height } = this._item.elementRef.nativeElement.getBoundingClientRect();

    this._x = x - this._offsetLeft + this._grid.scrollLeft;
    this._y = y - this._offsetTop + this._grid.scrollTop;

    this._width = width;
    this._height = height;
  }

  private _setMouseOffset(e: MouseEvent): void {
    const { x, y, width, height } = this._item.elementRef.nativeElement.getBoundingClientRect();

    this._mouseOffsetLeft = e.clientX - x;
    this._mouseOffsetRight = x + width - e.clientX;

    this._mouseOffsetTop = e.clientY - y;
    this._mouseOffsetBottom = y + height - e.clientY;
  }

  private _calculateOffsetLeft(element: HTMLElement): number {
    let offsetLeft = element.offsetLeft;

    let parent: Element | null = element.offsetParent;

    while (parent && parent instanceof HTMLElement) {
      offsetLeft += parent.offsetLeft;
      parent = parent.offsetParent;
    }

    return offsetLeft;
  }

  private _calculateOffsetTop(element: HTMLElement): number {
    let offsetTop = element.offsetTop;

    let parent: Element | null = element.offsetParent;

    while (parent && parent instanceof HTMLElement) {
      offsetTop += parent.offsetTop;
      parent = parent.offsetParent;
    }

    return offsetTop;
  }
}
