import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, inject } from '@angular/core';

import { Grid } from '../grid';

@Component({
  selector: 'kc-lib-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnChanges {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;

  @Input({ required: true }) scale!: number;

  @Input() grid!: Grid;

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  cellWidth = 100;
  cellHeight = 100;

  ngOnChanges(): void {
    this.render();
  }

  render(): void {
    this.elementRef.nativeElement.style.cssText = `
      transform: translate(${this.col * (100 / this.cols)}%, ${this.row * (100 / this.rows)}%);
      width: ${(100 / this.grid.cols) * this.cols}%;
      height: ${(100 / this.grid.rows) * this.rows}%;
      transition: transform 300ms;
    `;
  }
}
