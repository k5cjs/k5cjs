import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, inject } from '@angular/core';

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

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  cellWidth = 100;
  cellHeight = 100;

  ngOnChanges(): void {
    this.render();
  }

  render(): void {
    const actualCellWidth = this.cellWidth * this.scale;
    const actualCellHeight = this.cellHeight * this.scale;

    const x = this.col * actualCellWidth;
    const y = this.row * actualCellHeight;

    this.elementRef.nativeElement.style.cssText = `
      transform: translate3d(${x}px, ${y}px, 0);
      width: ${actualCellWidth * this.cols}px;
      height: ${actualCellHeight * this.rows}px;
      transition: transform 300ms;
    `;
  }
}
