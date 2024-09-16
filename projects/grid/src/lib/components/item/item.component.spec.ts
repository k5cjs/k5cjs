import { Component, EmbeddedViewRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcGridService } from '../../services';

import { ItemComponent } from './item.component';
import { KcGridModule } from '../../grid.module';
import { KcGridItem } from '../../types';

@Component({
  selector: 'kc-grid-test',
  template: `
    <kc-grid-item
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grid: KcGridService = new KcGridService();
  id = Symbol();
  template!: EmbeddedViewRef<{ $implicit: KcGridItem }>;
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
      imports: [KcGridModule],
    });
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
