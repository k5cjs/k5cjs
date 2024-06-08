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
  @Input({ required: true }) scale!: number;

  @Output() move = new EventEmitter<ItemComponent>();
  @Output() stop = new EventEmitter<void>();

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  //
  width!: number;
  height!: number;

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.isMouseDown) return;

    this.width = this.grid.cellWidth * this.scale;
    this.height = this.grid.cellHeight * this.scale;

    this.x = this.col * this.width;
    this.y = this.row * this.height;

    this.render();
  }

  /**
   * actual position in grid (x, y) in pixels
   */
  x = 0;
  /**
   * actual position in grid (x, y) in pixels
   */
  y = 0;
  offsetLeft = 0;
  /**
   * distance from mouse to top corner of the item
   */
  offsetTop = 0;

  isMouseDown = false;

  onMouseMove = this._onMouseMove.bind(this);

  @HostListener('mousedown', ['$event'])
  protected _onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    this.isMouseDown = true;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    this.offsetLeft = mouseX + this.grid.scrollLeft - this.x;
    this.offsetTop = mouseY + this.grid.scrollTop - this.y;

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

    this.x = this.col * this.width;
    this.y = this.row * this.height;
    this.grid.drop();

    this.render('orange');
  }

  protected _onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;

    e.preventDefault();

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    this.x = mouseX + this.grid.scrollLeft - this.offsetLeft;
    this.y = mouseY + this.grid.scrollTop - this.offsetTop;

    const col = Math.trunc(this.x / this.width);
    const row = Math.trunc(this.y / this.height);

    this.render('green');

    this.move.emit(this);

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
    this.col = Math.trunc(this.x / this.width);
    this.row = Math.trunc(this.y / this.height);

    this.render(color);

    const col = Math.trunc(this.x / this.width);
    const row = Math.trunc(this.y / this.height);

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

    // transform: translate3d(${this.x * (1 / this.scale)}px, ${this.y * (1 / this.scale)}px, 0);
    this.elementRef.nativeElement.style.cssText = `
      transform: translate3d(${this.x}px, ${this.y}px, 0);
      background: ${color};
      width: ${this.width * this.cols}px;
      height: ${this.height * this.rows}px;
      opacity: ${opacity};
      transition: ${transition};
      z-index: ${zIndex};
    `;
  }
}
