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

  @Output() move = new EventEmitter<{
    offsetHeight: number;
    offsetWidth: number;
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

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.isMouseDown) return;

    this.width = (100 / this.grid.cols) * this.cols;
    this.height = (100 / this.grid.rows) * this.rows;

    this.x = (this.col * 100) / this.grid.cols;
    this.y = (this.row * 100) / this.grid.rows;

    this.render();
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

    this.stop.emit();

    document.removeEventListener('mousemove', this.onMouseMove);

    this.x = (this.col * 100) / this.grid.cols;
    this.y = (this.row * 100) / this.grid.rows;

    this.grid.drop();

    this.render('orange');
  }

  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    const itemOffsetTop = e.clientY - this.gridRef.offsetTop - this.mouseOffsetTop; // px
    const itemY = itemOffsetTop + this.grid.scrollTop;

    const itemOffsetLeft = e.clientX - this.gridRef.offsetLeft - this.mouseOffsetLeft; // px
    const itemX = itemOffsetLeft + this.grid.scrollLeft;

    this.x = (itemX * 100) / this.gridRef.offsetWidth;
    this.y = (itemY * 100) / this.gridRef.offsetHeight;

    const col = this._col();
    const row = this._row();

    this.render('green');

    this.move.emit({
      offsetHeight: this.gridRef.offsetHeight,
      offsetWidth: this.gridRef.offsetWidth,
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

  renderMove(color = 'green'): void {
    this.render(color);

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

  render(color = 'yellow') {
    const opacity = color === 'green' ? 0.5 : 1;
    const transition = color !== 'green' ? 'transform 300ms' : null;
    const zIndex = color === 'green' ? 999 : 1;

    this.elementRef.nativeElement.style.cssText = `
      transform: translate(${this.x}cqw, ${this.y}cqh);
      background: ${color};
      width: ${this.width}%;
      height: ${this.height}%;
      opacity: ${opacity};
      transition: ${transition};
      z-index: ${zIndex};
    `;
  }

  private _col(): number {
    return Math.trunc((this.grid.cols * this.x) / 100);
  }

  private _row(): number {
    return Math.trunc((this.grid.rows * this.y) / 100);
  }
}
