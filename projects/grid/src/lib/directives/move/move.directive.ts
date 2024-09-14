import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { GRID_TEMPLATE, ITEM_COMPONENT } from '../../tokens';
import { Cell, GridEvent } from '../../types';
import { ItemComponent } from '../../components';
import { KcGridService } from '../../services';

@Directive({
  selector: '[kcGridMove]',
})
export class MoveDirective {
  @Input({ required: true }) cell!: Cell;

  isMouseDown = false;

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

  protected _grid = inject(KcGridService);
  protected _gridTemplate = inject(GRID_TEMPLATE);
  protected _item = inject(ITEM_COMPONENT);
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private _animation: Animation | null = null;

  private _requestAnimationFrameId!: number;

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    // TODO: add logic in move to stop if is resizing
    e.stopPropagation();

    console.log('mousedown');

    const { x, y } = this._item.elementRef.nativeElement.getBoundingClientRect();

    this.isMouseDown = true;
    this._item.skip = true;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    this.mouseOffsetLeft = mouseX - x;
    this.mouseOffsetTop = mouseY - y;

    this._setFixedSize(this._item.elementRef.nativeElement);
    this._animation?.cancel();

    this._grid.capture({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: this.cell.cols,
      rows: this.cell.rows,
      template: this.cell.template!,
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
    this._item.skip = false;

    document.removeEventListener('mousemove', this.onMouseMove);

    this._grid.isItemsMoving = false;
    this._grid.drop();

    this._renderByColAndRowAnimated();

    this._grid.release({
      id: this.cell.id,
      col: this.cell.col,
      row: this.cell.row,
      cols: this.cell.cols,
      rows: this.cell.rows,
      template: this.cell.template!,
    });
  }

  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    const itemOffsetLeft =
      e.clientX - this._gridTemplate.itemsElementRef.nativeElement.offsetLeft - this.mouseOffsetLeft; // px
    this._item.x = itemOffsetLeft + this._grid.scrollLeft;

    const itemOffsetTop = e.clientY - this._gridTemplate.itemsElementRef.nativeElement.offsetTop - this.mouseOffsetTop; // px
    this._item.y = itemOffsetTop + this._grid.scrollTop;

    const col = this._col();
    const row = this._row();

    this._render('green');

    this._move({
      x: itemOffsetLeft,
      y: itemOffsetTop,
      width: this._item.elementRef.nativeElement.offsetWidth,
      height: this._item.elementRef.nativeElement.offsetHeight,
      item: this._item as ItemComponent,
    });

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

    this._item.elementRef.nativeElement.style.transition = '';

    this._item.elementRef.nativeElement.style.transform = `translate(${this._item.x}px, ${this._item.y}px)`;
    this._item.elementRef.nativeElement.style.zIndex = `${zIndex}`;
    this._item.elementRef.nativeElement.style.backgroundColor = color;
  }

  private _col(): number {
    let width = 0;

    for (let i = 0; i < this._grid.cols; i++) {
      width += this._grid.colsGaps[i];
      width += this._cellWidth();

      if (width > this._item.x) return i;
    }

    return this._grid.cols - 1;
  }

  private _row(): number {
    let height = 0;

    for (let i = 0; i < this._grid.rows; i++) {
      height += this._grid.rowsGaps[i];
      height += this._cellHeight();

      if (height > this._item.y) return i;
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

  private _renderByColAndRowAnimated() {
    this._item.elementRef.nativeElement.style.transition = '300ms';
    this._renderByColAndRow();

    this._item.elementRef.nativeElement.addEventListener(
      'transitionend',
      () => (this._item.elementRef.nativeElement.style.transition = ''),
      false,
    );
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

  private _renderByColAndRow() {
    this._setWidthByCols(this._item.elementRef.nativeElement);
    this._setHeightByRows(this._item.elementRef.nativeElement);
    this._setTransform(this._item.elementRef.nativeElement);

    this._item.elementRef.nativeElement.style.zIndex = '';
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

  private _move({
    x,
    y,
    width,
    height,
    item,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    item: ItemComponent;
  }) {
    /**
     * cancel previous requestAnimationFrame
     * because we want to start new one that will to current position
     */
    cancelAnimationFrame(this._requestAnimationFrameId);

    const mouseYContainer = y + height;
    const mouseXContainer = x + width;

    let increaseX = 0;
    let increaseY = 0;

    if (y < 0) {
      const percent = Math.abs(y) / (height * item.cell.rows);

      const speed = Math.round(20 * percent);

      increaseY = -speed;
    } else if (mouseYContainer > this._gridTemplate.containerElementRef.nativeElement.clientHeight) {
      const offset = mouseYContainer - this._gridTemplate.containerElementRef.nativeElement.clientHeight;
      const percent = offset / (height * item.cell.rows);

      const speed = Math.round(20 * percent);

      increaseY = speed;
    }

    if (x < 0) {
      const percent = Math.abs(x) / (width * item.cell.cols);

      const speed = Math.round(20 * percent);

      increaseX = -speed;
    } else if (mouseXContainer > this._gridTemplate.containerElementRef.nativeElement.clientWidth) {
      const offset = mouseXContainer - this._gridTemplate.containerElementRef.nativeElement.clientWidth;
      const percent = offset / (width * item.cell.cols);

      const speed = Math.round(20 * percent);

      increaseX = speed;
    }

    this._scroll(item, increaseX, increaseY);
  }

  private _scroll(item: ItemComponent, increaseX: number, increaseY: number): void {
    if (increaseX === 0 && increaseY === 0) return;

    if (this._grid.scrollLeft + increaseX <= 0) increaseX = 0;

    if (this._grid.scrollTop + increaseY <= 0) increaseY = 0;

    const scrollWidth = this._gridTemplate.containerElementRef.nativeElement.clientWidth + this._grid.scrollLeft;
    const contentWidth = this._gridTemplate.contentElementRef.nativeElement.offsetWidth;

    // add new column if scroll is at the right
    if (scrollWidth + increaseX > contentWidth) {
      const remainingWidth = contentWidth - scrollWidth;

      if (remainingWidth > 0) {
        increaseX = remainingWidth;
      } else {
        console.error('add new column');
        // this.grid.cols += 1;
        // this._cdr.detectChanges();
        //
        // this._scroll(item, increaseX, increaseY, increaseYPercentage, increaseXPercentage);
        return;
      }
    }

    const scrollHeight = this._gridTemplate.containerElementRef.nativeElement.clientHeight + this._grid.scrollTop;
    const contentHeight = this._gridTemplate.contentElementRef.nativeElement.offsetHeight;

    let temp: number | undefined;

    // add new row if scroll is at the bottom
    if (scrollHeight + increaseY > contentHeight - 500) {
      // const remainingHeight = contentHeight - scrollHeight;

      // if (remainingHeight > 0) {
      //   temp = increaseY;
      //   increaseY = remainingHeight;
      // } else {
      console.warn('add new row');

      this._grid.event.next(GridEvent.BeforeAddRows);

      this._grid.rows += 8;
      this._grid.rows += 8;
      this._grid.rowsGaps = [...this._grid.rowsGaps, 0] as unknown as [number, ...number[]];
      // this._grid.rowsTotalGaps = this._rowsTotalGaps();

      // this._cdr.detectChanges();

      this._scroll(item, increaseX, temp || increaseY);
      return;
      // }
    }

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this._grid.scrollLeft += increaseX;
      this._grid.scrollTop += increaseY;

      item.x += increaseX;
      item.y += increaseY;

      item.renderMove('green');

      this._grid.isItemsMoving = true;

      this._gridTemplate.containerElementRef.nativeElement.scrollTo({
        left: this._grid.scrollLeft,
        top: this._grid.scrollTop,
        behavior: 'instant',
      });

      this._scroll(item, increaseX, temp || increaseY);
    });
  }
}
