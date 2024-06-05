import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';

import { GridDirective } from './grid.directive';
import { Matrice } from './matrice';
import { PreviewDirective } from './preview.directive';

@Component({
  selector: 'lib-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges {
  @Input() scale = 1;

  @ViewChild('grid', { static: true }) grid!: ElementRef<HTMLElement>;
  @ViewChild(GridDirective, { static: true }) gridElement!: GridDirective;
  @ViewChild(PreviewDirective, { static: true }) preview!: PreviewDirective;

  cols = 10;
  rows = 10;

  elementRef = inject(ElementRef);

  matrice!: Matrice;

  ngOnChanges(changes: SimpleChanges): void {
    // this.matrice.scale = this.scale;
    console.log('scale', this.scale);
  }

  ngOnInit(): void {
    this.matrice = new Matrice(this.cols, this.rows, this.preview.render({}));

    this.lines();

    const id1 = Symbol('id1');
    const chart1 = this.gridElement.render({ col: 1, row: 1, cols: 2, rows: 2, matrice: this.matrice, id: id1 });

    (chart1.context as any).$implicit.template = chart1;

    this.matrice.add({
      id: id1,
      col: 1,
      row: 1,
      cols: 2,
      rows: 2,
      template: chart1,
    });

    const id2 = Symbol('id2');
    const chart2 = this.gridElement.render({ col: 3, row: 1, cols: 3, rows: 3, matrice: this.matrice, id: id2 });

    (chart2.context as any).$implicit.template = chart2;

    this.matrice.add({
      id: id2,
      col: 3,
      row: 1,
      cols: 3,
      rows: 3,
      template: chart2,
    });

    const id3 = Symbol('id3');
    const chart3 = this.gridElement.render({ col: 1, row: 3, cols: 2, rows: 2, matrice: this.matrice, id: id3 });

    (chart3.context as any).$implicit.template = chart3;

    this.matrice.add({
      id: id3,
      col: 1,
      row: 3,
      cols: 2,
      rows: 2,
      template: chart3,
    });

    const id4 = Symbol('id4');
    const chart4 = this.gridElement.render({ col: 3, row: 4, cols: 2, rows: 2, matrice: this.matrice, id: id4 });

    (chart4.context as any).$implicit.template = chart4;

    this.matrice.add({
      id: id4,
      col: 3,
      row: 4,
      cols: 2,
      rows: 2,
      template: chart4,
    });
  }

  lines(): void {
    const girdLines = document.createElement('div');

    girdLines.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(${this.cols}, 1fr);
      grid-template-rows: repeat(${this.rows}, 1fr);
      border: 1px solid #000;
    `;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cell = document.createElement('div');
        cell.innerHTML = `${x}, ${y}`;

        cell.style.cssText = `
          border: 1px solid #000;
        `;
        girdLines.appendChild(cell);
      }
    }

    this.grid.nativeElement.appendChild(girdLines);

    this.grid.nativeElement.style.cssText = `
      position: relative;
      width: ${this.cols * 100}px;
      height: ${this.rows * 100}px;
    `;
  }
}
