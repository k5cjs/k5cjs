import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';

import { GridDirective } from './grid.directive';
import { Matrice } from './matrice';

@Component({
  selector: 'lib-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid!: ElementRef<HTMLElement>;
  @ViewChild(GridDirective, { static: true }) gridElement!: GridDirective;

  cols = 10;
  rows = 10;

  elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.lines();

    const matrice = new Matrice(this.cols, this.rows);

    const id1 = Symbol('id1');
    const chart = this.gridElement.render({ col: 1, row: 1, cols: 2, rows: 2, matrice, id: id1 });

    (chart.context as any).$implicit.template = chart;

    matrice.addNew({
      id: id1,
      col: 1,
      row: 1,
      cols: 2,
      rows: 2,
      template: chart,
    });

    const id2 = Symbol('id2');
    const chart2 = this.gridElement.render({ col: 3, row: 1, cols: 2, rows: 2, matrice, id: id2 });

    (chart2.context as any).$implicit.template = chart2;

    matrice.addNew({
      id: id2,
      col: 3,
      row: 1,
      cols: 2,
      rows: 2,
      template: chart2,
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
