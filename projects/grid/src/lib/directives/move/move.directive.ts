import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { GRID_ITEM_ID, GRID_TEMPLATE, ITEM_COMPONENT } from '../../tokens';
import { KcGridItem } from '../../types';
import { KcGridService } from '../../services';

@Directive({
  selector: '[kcGridMove]',
})
export class MoveDirective {
  @Input({ required: true }) item!: KcGridItem;

  id = inject(GRID_ITEM_ID);
  /**
   * actual position in grid (x, y) in pixels
   */
  // x = 0;
  /*
   * actual position in grid (x, y) in pixels
   */
  // y = 0;

  mouseOffsetLeft = 0;
  /**
   * distance from mouse to top corner of the item
   */
  mouseOffsetTop = 0;

  onMouseMove = this._onMouseMove.bind(this);
  onMouseUp = this._onMouseUp.bind(this);

  protected _x = 0;
  protected _y = 0;

  protected _grid = inject(KcGridService);
  protected _gridTemplate = inject(GRID_TEMPLATE);
  protected _item = inject(ITEM_COMPONENT);
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private _animation: Animation | null = null;

  private _requestAnimationFrameId!: number;

  // add variable to save cols when mouse is down
  // to prevent to change size when the item is swapped
  private _startCols = 0;
  private _startRows = 0;

  private _offsetLeft = 0;
  private _offsetTop = 0;

  private _parentOffsetLeft = 0;
  private _parentOffsetTop = 0;

  padding = { top: 0, right: 0, bottom: 0, left: 0 };

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    // TODO: add logic in move to stop if is resizing
    e.stopPropagation();

    this._grid.handle(this.id);

    const { x, y } = this._item.elementRef.nativeElement.getBoundingClientRect();

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    this.mouseOffsetLeft = mouseX - x;
    this.mouseOffsetTop = mouseY - y;

    this._setFixedSize(this._item.elementRef.nativeElement);
    this._animation?.cancel();

    this._startCols = this.item.cols;
    this._startRows = this.item.rows;

    this._offsetLeft = this._gridTemplate.itemsElementRef.nativeElement.offsetLeft;
    this._offsetTop = this._gridTemplate.itemsElementRef.nativeElement.offsetTop;

    this._parentOffsetLeft = this._calculateOffsetLeft(this._gridTemplate.itemsElementRef.nativeElement);
    this._parentOffsetTop = this._calculateOffsetTop(this._gridTemplate.itemsElementRef.nativeElement);

    this._grid.editing = true;

    const style = getComputedStyle(this._gridTemplate.containerElementRef.nativeElement);

    this.padding.top = parseFloat(style.paddingTop);
    this.padding.right = parseFloat(style.paddingRight);
    this.padding.bottom = parseFloat(style.paddingBottom);
    this.padding.left = parseFloat(style.paddingLeft);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  protected _onMouseUp(e: MouseEvent): void {
    e.preventDefault();

    this._grid.release(this.id);

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    cancelAnimationFrame(this._requestAnimationFrameId);

    this._grid.isItemScrolling = false;

    this._grid.editing = false;
  }

  protected _onMouseMove(e: MouseEvent): void {
    e.preventDefault();

    const mouseX = e.clientX - this.mouseOffsetLeft - this._parentOffsetLeft;
    this._x = mouseX - this._offsetLeft + this._grid.scrollLeft;

    const mouseY = e.clientY - this.mouseOffsetTop - this._parentOffsetTop;
    this._y = mouseY - this._offsetTop + this._grid.scrollTop;

    this._render();

    this._move({
      x: mouseX,
      y: mouseY,
      width: this._item.elementRef.nativeElement.offsetWidth,
      height: this._item.elementRef.nativeElement.offsetHeight,
    });

    const allowToMove = this._updateGrid();
    /**
     * skip if movement is not possible
     */
    if (!allowToMove) return;
    /**
     * save the last position when the movement is possible
     */
    // this.item.col = col;
    // this.item.row = row;
  }

  private _render() {
    const element = this._item.elementRef.nativeElement;

    element.style.transition = '';

    element.style.transform = `translate(${this._x}px, ${this._y}px)`;
    element.style.zIndex = `999`;
    element.style.backgroundColor = 'green';
  }

  private _setFixedSize(element: HTMLElement): void {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const style = getComputedStyle(element).transform;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, left] = /([-\d.]+), [-\d.]+\)/.exec(style)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, top] = /([-\d.]+)\)/.exec(style)!;

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    element.style.transform = `translate(${left}px, ${top}px)`;
  }

  private _move({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
    /**
     * cancel previous requestAnimationFrame
     * because we want to start new one that will to current position
     */
    cancelAnimationFrame(this._requestAnimationFrameId);

    const mouseXContainer = x + width;
    const mouseYContainer = y + height;

    let increaseX = 0;
    let increaseY = 0;

    if (x < 0) {
      const percent = Math.abs(x) / (width * this.item.cols);

      const speed = Math.round(10 * percent);

      increaseX = -speed;
    } else if (mouseXContainer > this._gridTemplate.containerElementRef.nativeElement.clientWidth) {
      const offset = mouseXContainer - this._gridTemplate.containerElementRef.nativeElement.clientWidth;
      const percent = offset / (width * this.item.cols);

      const speed = Math.round(10 * percent);

      increaseX = speed;
    }

    if (y < 0) {
      const percent = Math.abs(y) / (height * this.item.rows);

      const speed = Math.round(50 * percent);

      increaseY = -speed;
    } else if (mouseYContainer > this._gridTemplate.containerElementRef.nativeElement.clientHeight) {
      const offset = mouseYContainer - this._gridTemplate.containerElementRef.nativeElement.clientHeight;
      const percent = offset / (height * this.item.rows);

      const speed = Math.round(50 * percent);

      increaseY = speed;
    }

    this._scroll(increaseX, increaseY);
  }

  private _scroll(increaseX: number, increaseY: number): void {
    if (increaseX === 0 && increaseY === 0) return;

    if (this._grid.scrollLeft + increaseX <= 0) increaseX = 0;

    if (this._grid.scrollTop + increaseY <= 0) increaseY = 0;

    const scrollWidth =
      this._gridTemplate.containerElementRef.nativeElement.clientWidth -
      this.padding.left -
      this.padding.right +
      this._grid.scrollLeft;
    const contentWidth = this._gridTemplate.contentElementRef.nativeElement.offsetWidth;

    let temp: number | undefined;

    // add new column if scroll is at the right
    if (scrollWidth + increaseX > contentWidth) {
      const remainingWidth = contentWidth - scrollWidth;

      if (remainingWidth > 0) {
        temp = increaseX;
        increaseX = remainingWidth;
      } else {
        console.error('add new column');
        // this.grid.cols += 1;
        // this._cdr.detectChanges();
        //
        // this._scroll(temp || increaseX, increaseY)
        return;
      }
    }

    const scrollHeight =
      this._gridTemplate.containerElementRef.nativeElement.clientHeight -
      this.padding.top -
      this.padding.bottom +
      this._grid.scrollTop;
    const contentHeight = this._gridTemplate.contentElementRef.nativeElement.offsetHeight;

    // add new row if scroll is at the bottom
    if (scrollHeight + increaseY > contentHeight) {
      const remainingHeight = contentHeight - scrollHeight;

      if (remainingHeight > 0) {
        temp = increaseY;
        increaseY = remainingHeight;
      } else {
        console.error('add new row');

        // this._grid.emit(this.id, this.item, GridEventType.BeforeAddRows);
        //
        // this._grid.rows += 8;
        // this._grid.rows += 8;
        // this._grid.rowsGaps = [...this._grid.rowsGaps, 0] as unknown as [number, ...number[]];
        // // this._grid.rowsTotalGaps = this._rowsTotalGaps();
        //
        // // this._cdr.detectChanges();
        //
        // this._scroll(increaseX, temp || increaseY);
        return;
      }
    }

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this._grid.scrollLeft += increaseX;
      this._grid.scrollTop += increaseY;

      this._x += increaseX;
      this._y += increaseY;

      this._render();
      this._updateGrid();

      this._grid.isItemScrolling = true;

      this._gridTemplate.containerElementRef.nativeElement.scrollTo({
        left: this._grid.scrollLeft,
        top: this._grid.scrollTop,
        behavior: 'instant',
      });

      this._scroll(increaseX, temp || increaseY);
    });
  }

  private _calculateOffsetLeft(element: HTMLElement): number {
    let offsetLeft = 0;

    let parent: Element | null = element.offsetParent;

    while (parent && parent instanceof HTMLElement) {
      offsetLeft += parent.offsetLeft;
      parent = parent.offsetParent;
    }

    return offsetLeft;
  }

  private _calculateOffsetTop(element: HTMLElement): number {
    let offsetTop = 0;

    let parent: Element | null = element.offsetParent;

    while (parent && parent instanceof HTMLElement) {
      offsetTop += parent.offsetTop;
      parent = parent.offsetParent;
    }

    return offsetTop;
  }

  private _updateGrid() {
    const col = this._col();
    const row = this._row();

    return this._grid.move(this.id, {
      col,
      row,
      cols: this._startCols,
      rows: this._startRows,
    });
  }

  private _col(): number {
    let width = 0;

    for (let i = 0; i < this._grid.cols; i++) {
      width += this._grid.colsGaps[i];
      width += this._cellWidth();

      if (width > this._x) return i;
    }

    return this._grid.cols - 1;
  }

  private _row(): number {
    let height = 0;

    for (let i = 0; i < this._grid.rows; i++) {
      height += this._grid.rowsGaps[i];
      height += this._cellHeight();

      if (height > this._y) return i;
    }

    return this._grid.rows - 1;
  }

  private _cellWidth(): number {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridWidth = this._gridTemplate.itemsElementRef.nativeElement.offsetWidth - totalColsGaps;

    const cellWidth = gridWidth / this._grid.cols;

    return cellWidth;
  }

  private _cellHeight(): number {
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gridHeight = this._gridTemplate.itemsElementRef.nativeElement.offsetHeight - totalRowsGaps;

    const cellHeight = gridHeight / this._grid.rows;

    return cellHeight;
  }
}
