import { Component, EmbeddedViewRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grid } from '../../helpers/grid/grid';
import { Cell } from '../../types/cell.type';

import { ItemComponent } from './item.component';

@Component({
  selector: 'lib-test',
  template: `
    <lib-item
      [col]="col"
      [row]="row"
      [cols]="cols"
      [rows]="rows"
      [grid]="grid"
      [id]="id"
      [template]="template"
      [gridRef]="gridRef"
      [scale]="scale"
      [colsGaps]="colsGaps"
      [rowsGaps]="rowsGaps"
    />
  `,
})
class DumpyComponent {
  col = 0;
  row = 0;
  cols = 3;
  rows = 3;
  grid: Grid = new Grid({} as any);
  id = Symbol();
  template!: EmbeddedViewRef<{ $implicit: Cell }>;
  gridRef!: HTMLElement;
  scale = 1;

  colsGaps: number[] = [];
  rowsGaps: number[] = [];
}

describe('ItemComponent', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponent, DumpyComponent],
    });
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
