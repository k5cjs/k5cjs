import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KcGridItems } from '../../types';
import { KcGridService } from './grid.service';
import { GridDirective, PreviewDirective } from '../../directives';

@Component({
  selector: 'kc-grid-preview',
  template: `
    <ng-template #template>Template</ng-template>
    <div *kcGrid="let item"></div>
    <div *kcGridPreview="let item; let id = id; let event = event"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PreviewComponent {
  @ViewChild(GridDirective) itemDirective!: GridDirective;
  @ViewChild(PreviewDirective) previewDirective!: PreviewDirective;

  cdr = inject(ChangeDetectorRef);
}

class MockKcGridService extends KcGridService {
  get items() {
    return this._items;
  }
}

const mock = (component: PreviewComponent, size: { cols: number; rows: number }, cells: KcGridItems<void>) => {
  const grid = new MockKcGridService();

  grid.init({
    ...size,
    scrollTop: 0,
    scrollLeft: 0,
    cellWidth: 100,
    cellHeight: 100,
    preview: component.previewDirective,
    itemDirective: component.itemDirective,
    colsGaps: [10],
    rowsGaps: [10],
  });

  const items = new Map<number, symbol>();

  cells.forEach((item, index) => {
    const id = grid.add(item)!;

    items.set(index, id);
  });

  return { grid, items };
};

describe('grid', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewComponent, GridDirective, PreviewDirective],
    });
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shift to left', () => {
    const { grid, items } = mock(component, { cols: 9, rows: 5 }, [
      { col: 1, row: 1, cols: 4, rows: 4 },
      { col: 5, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     *  ┌──────────────────┐
     *  │ ┌───────┌───────┐│
     *  │ │       │       ││
     *  │ │       │       ││
     *  │ │       │       ││
     *  │ └───────└───────┘│
     *  └──────────────────┘
     *
     *  ┌─────────────────┐
     *  │ ┌─────┌───────┐ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ └─────└───────┘ │
     *  └─────────────────┘
     *
     *  ┌─────────────────┐
     *  ┌───────┌───────┐ │
     *  │       │       │ │
     *  │       │       │ │
     *  │       │       │ │
     *  └───────└───────┘ │
     *  └─────────────────┘
     *
     */
    const id = items.get(1)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 4 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(0);
    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(4);
  });

  it('shift to left multiple items', () => {
    const { grid, items } = mock(component, { cols: 14, rows: 5 }, [
      { col: 1, row: 1, cols: 4, rows: 4 },
      { col: 5, row: 1, cols: 4, rows: 4 },
      { col: 9, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     *  ┌───────────────────────────┐
     *  │ ┌───────┌───────┌───────┐ │
     *  │ │       │       │       │ │
     *  │ │       │       │       │ │
     *  │ │       │       │       │ │
     *  │ └───────└───────└───────┘ │
     *  └───────────────────────────┘
     *
     *  ┌───────────────────────────┐
     *  │ ┌───────┌─────┌───────┐   │
     *  │ │       │     │ │     │   │
     *  │ │       │     │ │     │   │
     *  │ │       │     │ │     │   │
     *  │ └───────└─────└───────┘   │
     *  └───────────────────────────┘
     *
     *  ┌───────────────────────────┐
     *  ┌───────┌───────┌───────┐   │
     *  │       │       │       │   │
     *  │       │       │       │   │
     *  │       │       │       │   │
     *  └───────└───────└───────┘   │
     *  └───────────────────────────┘
     *
     */
    const id = items.get(2)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 8 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(0);
    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(4);
    expect(grid.items.get(items.get(2)!)!.context.col).toEqual(8);
  });

  it('shift to left that is not possible', () => {
    const { grid, items } = mock(component, { cols: 9, rows: 5 }, [
      { col: 0, row: 1, cols: 4, rows: 4 },
      { col: 4, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *  ┌────────────────┐
     *  ┌───────┌───────┐│
     *  │       │       ││
     *  │       │       ││
     *  │       │       ││
     *  └───────└───────┘│
     *  └────────────────┘
     *
     *  ┌────────────────┐
     *  ┌─────┌───────┐  │
     *  │     │ │     │  │
     *  │     │ │     │  │
     *  │     │ │     │  │
     *  └─────└───────┘  │
     *  └────────────────┘
     *
     *  not possible
     *
     */
    const id = items.get(1)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 3 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(0);
    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(4);
  });

  it('shift to left more that available space', () => {
    const { grid, items } = mock(component, { cols: 9, rows: 5 }, [
      { col: 1, row: 1, cols: 4, rows: 4 },
      { col: 5, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     *  ┌─────────────────┐
     *  │ ┌───────┌───────┐
     *  │ │       │       │
     *  │ │       │       │
     *  │ │       │       │
     *  │ └───────└───────┘
     *  └─────────────────┘
     *
     *  ┌─────────────────┐
     *  │ ┌───┌───────┐   │
     *  │ │   │   │   │   │
     *  │ │   │   │   │   │
     *  │ │   │   │   │   │
     *  │ └───└───────┘   │
     *  └─────────────────┘
     *
     *  not possible
     *
     */
    const id = items.get(1)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 3 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(1);
    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(5);
  });

  it('shift to left on multiple items that not have available space to move', () => {
    const { grid, items } = mock(component, { cols: 14, rows: 5 }, [
      { col: 1, row: 1, cols: 4, rows: 4 },
      { col: 5, row: 1, cols: 4, rows: 4 },
      { col: 9, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     *  ┌───────────────────────────┐
     *  │ ┌───────┌───────┌───────┐ │
     *  │ │       │       │       │ │
     *  │ │       │       │       │ │
     *  │ │       │       │       │ │
     *  │ └───────└───────└───────┘ │
     *  └───────────────────────────┘
     *
     *  ┌───────────────────────────┐
     *  │ ┌───────┌───┌───────┐     │
     *  │ │       │   │   │   │     │
     *  │ │       │   │   │   │     │
     *  │ │       │   │   │   │     │
     *  │ └───────└───└───────┘     │
     *  └───────────────────────────┘
     *
     *  not possible
     *
     */
    const id = items.get(2)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 7 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(1);
    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(5);
    expect(grid.items.get(items.get(2)!)!.context.col).toEqual(9);
  });

  it('shift to right', () => {
    const { grid, items } = mock(component, { cols: 14, rows: 5 }, [
      { col: 0, row: 1, cols: 4, rows: 4 },
      { col: 4, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     *  ┌─────────────────┐
     *  ┌───────┐───────┐ │
     *  │       │       │ │
     *  │       │       │ │
     *  │       │       │ │
     *  └───────┘───────┘ │
     *  └─────────────────┘
     *
     *  ┌─────────────────┐
     *  │ ┌───────┐─────┐ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ └───────┘─────┘ │
     *  └─────────────────┘
     *
     *  ┌─────────────────┐
     *  ┌───────┐───────┐ │
     *  │       │       │ │
     *  │       │       │ │
     *  │       │       │ │
     *  └───────┘───────┘ │
     *  └─────────────────┘
     *
     */
    const id = items.get(0)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 1 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(1);
    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(5);
  });

  it('swap', () => {
    const { grid, items } = mock(component, { cols: 8, rows: 5 }, [
      { col: 1, row: 1, cols: 2, rows: 2 },
      { col: 3, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     * ┌───────────────┐
     * │ ┌───┌───────┐ │
     * │ │ 0 │       │ │
     * │ └───│   1   │ │
     * │     │       │ │
     * │     └───────┘ │
     * └───────────────┘
     *
     * ┌───────────────┐
     * │     ┌───────┐ │
     * │     │ ┌───┐ │ │
     * │     │ │ 0 │ │ │
     * │     │ └───┘ │ │
     * │     └───────┘ │
     * └───────────────┘
     *
     * ┌───────────────┐
     * │ ┌───┌───────┐ │
     * │ │ 1 │       │ │
     * │ └───│   0   │ │
     * │     │       │ │
     * │     └───────┘ │
     * └───────────────┘
     *
     */
    const id = items.get(0)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 4, row: 2 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(3);
    expect(grid.items.get(items.get(0)!)!.context.row).toEqual(1);

    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(1);
    expect(grid.items.get(items.get(1)!)!.context.row).toEqual(1);
  });

  it('cancel swap', () => {
    const { grid, items } = mock(component, { cols: 8, rows: 5 }, [
      { col: 1, row: 1, cols: 2, rows: 2 },
      { col: 3, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     * ┌───────────────┐
     * │ ┌───┌───────┐ │
     * │ │ 0 │       │ │
     * │ └───│   1   │ │
     * │     │       │ │
     * │     └───────┘ │
     * └───────────────┘
     *
     * ┌───────────────┐
     * │     ┌───────┐ │
     * │     │ ┌───┐ │ │
     * │     │ │ 0 │ │ │
     * │     │ └───┘ │ │
     * │     └───────┘ │
     * └───────────────┘
     *
     * ┌───────────────┐
     * │ ┌───┌───────┐ │
     * │ │ 0 │       │ │
     * │ └───│   1   │ │
     * │     │       │ │
     * │     └───────┘ │
     * └───────────────┘
     *
     * ┌───────────────┐
     * │ ┌───┌───────┐ │
     * │ │ 0 │       │ │
     * │ └───│   1   │ │
     * │     │       │ │
     * │     └───────┘ │
     * └───────────────┘
     *
     */
    const id = items.get(0)!;
    const item = grid.items.get(id)!;

    grid.move(id, { ...item.context, col: 4, row: 2 });
    grid.move(id, { ...item.context, col: 1, row: 1 });

    expect(grid.items.get(items.get(0)!)!.context.col).toEqual(1);
    expect(grid.items.get(items.get(0)!)!.context.row).toEqual(1);

    expect(grid.items.get(items.get(1)!)!.context.col).toEqual(3);
    expect(grid.items.get(items.get(1)!)!.context.row).toEqual(1);
  });
});
