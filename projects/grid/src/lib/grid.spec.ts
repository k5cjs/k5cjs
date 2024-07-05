import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cell } from './cell.type';
import { Grid } from './grid';

type Context = { $implicit: Cell };

@Component({
  selector: 'kc-preview',
  template: `
    <ng-template #template>Template</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PreviewComponent {
  @ViewChild('template', { static: true }) template!: TemplateRef<{ $implicit: Cell }>;

  constructor(public viewContainer: ViewContainerRef) {}

  render(context: Cell): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView(this.template, { $implicit: { ...context } });
  }
}

const mock = (component: PreviewComponent, size: { cols: number; rows: number }, cells: Omit<Cell, 'id'>[]) => {
  const grid = new Grid({
    ...size,
    scrollTop: 0,
    scrollLeft: 0,
    cellWidth: 100,
    cellHeight: 100,
    preview: component.render({ id: Symbol('id'), col: 0, row: 0, cols: 1, rows: 1 }),
  });

  const items = new Map();

  cells.forEach((item, index) => {
    const id = Symbol(`id-${index}`);

    const cell = {
      ...item,
      id,
      template: component.render({ ...item, id }),
    };

    grid.add(cell);

    items.set(index, cell);
  });

  return { grid, items };
};

fdescribe('get position', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewComponent],
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

    grid.move({
      ...items.get(1),
      col: 4,
    });

    expect(items.get(0).template.context.$implicit.col).toEqual(0);
  });

  it('test', () => {
    const { grid, items } = mock(component, { cols: 14, rows: 5 }, [
      { col: 1, row: 1, cols: 4, rows: 4 },
      { col: 5, row: 1, cols: 4, rows: 4 },
      { col: 9, row: 1, cols: 4, rows: 4 },
    ]);

    /**
     *
     *  ┌───────────────────────────┐
     *  │ ┌───────┌───────┌───────┐ │
     *  │ │       │       │ │     │ │
     *  │ │       │       │ │     │ │
     *  │ │       │       │ │     │ │
     *  │ └───────└───────└───────┘ │
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

    grid.move({
      ...items.get(2),
      col: 8,
    });

    expect(items.get(0).template.context.$implicit.col).toEqual(0);
    expect(items.get(1).template.context.$implicit.col).toEqual(4);
  });
  //
  // it('test', () => {
  //   const matrice = new Grid(9, 5);
  //
  //   /**
  //    *
  //    *  ┌─────────────────┐
  //    *  │┌─────┌───────┐  │
  //    *  ││     │ │     │  │
  //    *  ││     │ │     │  │
  //    *  ││     │ │     │  │
  //    *  │└─────└───────┘  │
  //    *  └─────────────────┘
  //    *
  //    *  not possible
  //    *
  //    */
  //
  //   const item = matrice.add(0, 1, 4, 4);
  //
  //   matrice.change({
  //     id: Symbol(),
  //     col: 3,
  //     row: 1,
  //     cols: 4,
  //     rows: 4,
  //   });
  //
  //   expect(item.col).toEqual(0);
  // });
  //
  // it('test', () => {
  //   const matrice = new Grid(9, 5);
  //
  //   /**
  //    *
  //    *  ┌─────────────────┐
  //    *  │ ┌───┌───────┐   │
  //    *  │ │   │   │   │   │
  //    *  │ │   │   │   │   │
  //    *  │ │   │   │   │   │
  //    *  │ └───└───────┘   │
  //    *  └─────────────────┘
  //    *
  //    *  not possible
  //    *
  //    */
  //
  //   const item = matrice.add(1, 1, 4, 4);
  //
  //   matrice.change({
  //     id: Symbol(),
  //     col: 3,
  //     row: 1,
  //     cols: 4,
  //     rows: 4,
  //   });
  //
  //   expect(item.col).toEqual(1);
  // });
  //
  // it('test', () => {
  //   const matrice = new Grid(14, 5);
  //
  //   /**
  //    *
  //    *  ┌───────────────────────────┐
  //    *  │ ┌───────┌─────┌───────┐   │
  //    *  │ │       │     │   │   │   │
  //    *  │ │       │     │   │   │   │
  //    *  │ │       │     │   │   │   │
  //    *  │ └───────└─────└───────┘   │
  //    *  └───────────────────────────┘
  //    *
  //    *  not possible
  //    *
  //    */
  //
  //   const item1 = matrice.add(1, 1, 4, 4);
  //   const item2 = matrice.add(5, 1, 4, 4);
  //
  //   matrice.change({
  //     id: Symbol(),
  //     col: 7,
  //     row: 1,
  //     cols: 4,
  //     rows: 4,
  //   });
  //
  //   expect(item1.col).toEqual(1);
  //   expect(item2.col).toEqual(5);
  // });
  //
  // it('shift to right', () => {
  //   const matrice = new Grid(9, 5);
  //
  //   /**
  //    *
  //    *  ┌─────────────────┐
  //    *  │ ┌───────┐─────┐ │
  //    *  │ │     │ │     │ │
  //    *  │ │     │ │     │ │
  //    *  │ │     │ │     │ │
  //    *  │ └───────┘─────┘ │
  //    *  └─────────────────┘
  //    *
  //    *  ┌─────────────────┐
  //    *  │┌───────┐───────┐│
  //    *  ││       │       ││
  //    *  ││       │       ││
  //    *  ││       │       ││
  //    *  │└───────┘───────┘│
  //    *  └─────────────────┘
  //    *
  //    */
  //
  //   const item = matrice.add(4, 1, 4, 4);
  //
  //   matrice.change({
  //     id: Symbol(),
  //     col: 1,
  //     row: 1,
  //     cols: 4,
  //     rows: 4,
  //   });
  //
  //   expect(item.col).toEqual(5);
  // });
});
