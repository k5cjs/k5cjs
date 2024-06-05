import { Component, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

@Component({
  selector: 'lib-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnChanges {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;

  @Input({ required: true }) scale!: number;

  elementRef = inject(ElementRef);

  cellWidth = 100;
  cellHeight = 100;

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  render(): void {
    console.log('render', this.col, this.row, this.cols, this.rows, this.scale);

    const actualCellWidth = this.cellWidth * this.scale;
    const actualCellHeight = this.cellHeight * this.scale;

    const x = this.col * actualCellWidth;
    const y = this.row * actualCellHeight;

    this.elementRef.nativeElement.style.cssText = `
      transform: translate3d(${x * (1 / this.scale)}px, ${y * (1 / this.scale)}px, 0);
      width: ${this.cellWidth * this.cols}px;
      height: ${this.cellHeight * this.rows}px;
      transition: transform 300ms;
    `;
  }
}
