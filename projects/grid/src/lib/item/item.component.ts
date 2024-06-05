import { Component, ElementRef, EmbeddedViewRef, HostListener, Input, OnChanges, inject } from '@angular/core';

import { Matrice } from '../matrice';

@Component({
  selector: 'lib-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnChanges {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;
  @Input({ required: true }) matrice!: Matrice;
  @Input({ required: true }) id!: symbol;
  @Input({ required: true }) template!: EmbeddedViewRef<unknown>;
  @Input({ required: true }) scale!: number;

  elementRef = inject(ElementRef);

  cellWidth = 100;
  cellHeight = 100;

  //
  private _actualCellWidth!: number;
  private _actualCellHeight!: number;

  private _requestAnimationFrameId!: number;

  ngOnChanges(): void {
    if (this.isMouseDown) return;

    this._actualCellWidth = this.cellWidth * this.scale;
    this._actualCellHeight = this.cellHeight * this.scale;

    this.x = this.col * this._actualCellWidth;
    this.y = this.row * this._actualCellHeight;

    console.log('on change', this.id, this.col, this.row, this.scale);

    this.render();
  }

  mouseX = 0;
  mouseY = 0;
  x = 0;
  y = 0;
  scrollLeft = 0;
  scrollTop = 0;
  offsetLeft = 0;
  offsetTop = 0;

  isMouseDown = false;

  onMouseMove = this._onMouseMove.bind(this);
  onMouseUp = this._onMouseUp.bind(this);
  onMouseDown = this._onMouseDown.bind(this);

  // @HostListener('mousemove', ['$event'])
  private _onMouseMove(e: MouseEvent): void {
    e.preventDefault();
    // e.stopPropagation();

    if (!this.isMouseDown) return;

    cancelAnimationFrame(this._requestAnimationFrameId);

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.x = this.mouseX + this.scrollLeft - this.offsetLeft;
    this.y = this.mouseY + this.scrollTop - this.offsetTop;

    this.render('green');

    this.matrice.reset({
      id: this.id,
      col: this.col,
      row: this.row,
      cols: this.cols,
      rows: this.rows,
      template: this.template,
    });

    this.matrice.move({
      id: this.id,
      col: this.col,
      row: this.row,
      cols: this.cols,
      rows: this.rows,
      template: this.template,
    });
  }

  @HostListener('mouseup', ['$event'])
  private _onMouseUp(e: MouseEvent): void {
    e.preventDefault();

    this.isMouseDown = false;

    cancelAnimationFrame(this._requestAnimationFrameId);

    document.removeEventListener('mousemove', this.onMouseMove);
    // document.removeEventListener('mouseup', this.onMouseUp);

    this.col = Math.trunc(this.x / this._actualCellWidth);
    // if (this.col < 0) this.col = 0;

    this.row = Math.trunc(this.y / this._actualCellHeight);
    // if (this.row < 0) this.row = 0;

    this.x = this.col * this._actualCellWidth;
    this.y = this.row * this._actualCellHeight;

    this.render('orange');

    this.matrice.update();

    this.matrice.move({
      id: this.id,
      col: this.col,
      row: this.row,
      cols: this.cols,
      rows: this.rows,
      template: this.template,
    });
  }

  @HostListener('mousedown', ['$event'])
  private _onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    this.isMouseDown = true;

    // this.scrollLeft = this._container.scrollLeft;
    // this.scrollTop = this._container.scrollTop;

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.offsetLeft = this.mouseX + this.scrollLeft - this.x;
    this.offsetTop = this.mouseY + this.scrollTop - this.y;

    document.addEventListener('mousemove', this.onMouseMove);
    // document.addEventListener('mouseup', this.onMouseUp);
    //
    this.matrice.init();
  }

  render(color = 'yellow') {
    const opacity = color === 'green' ? 0.5 : 1;
    const transition = color !== 'green' ? 'transform 300ms' : null;

    this.elementRef.nativeElement.style.cssText = `
      transform: translate3d(${this.x * (1 / this.scale)}px, ${this.y * (1 / this.scale)}px, 0);
      background: ${color};
      width: ${this.cellWidth * this.cols}px;
      height: ${this.cellHeight * this.rows}px;
      opacity: ${opacity};
      transition: ${transition};
    `;

    const col = this.col;
    const row = this.row;

    this.col = Math.trunc(this.x / this._actualCellWidth);
    // if (this.col < 0) this.col = 0;

    this.row = Math.trunc(this.y / this._actualCellHeight);
    // if (this.row < 0) this.row = 0;
  }
}
