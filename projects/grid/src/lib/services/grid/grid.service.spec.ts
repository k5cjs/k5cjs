// import {
//   ChangeDetectionStrategy,
//   Component,
//   EmbeddedViewRef,
//   TemplateRef,
//   ViewChild,
//   ViewContainerRef,
// } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { Cell } from './cell.type';
// import { KcGrid } from './grid';
//
// type Context = { $implicit: Cell };
//
// @Component({
//   selector: 'kc-preview',
//   template: `
//     <ng-template #template>Template</ng-template>
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// class PreviewComponent {
//   @ViewChild('template', { static: true }) template!: TemplateRef<{ $implicit: Cell }>;
//
//   constructor(public viewContainer: ViewContainerRef) {}
//
//   render(context: Cell): EmbeddedViewRef<Context> {
//     return this.viewContainer.createEmbeddedView(this.template, { $implicit: { ...context } });
//   }
// }
//
// const mock = (component: PreviewComponent, size: { cols: number; rows: number }, cells: Omit<Cell, 'id'>[]) => {
//   const grid = new KcGrid({
//     ...size,
//     scrollTop: 0,
//     scrollLeft: 0,
//     cellWidth: 100,
//     cellHeight: 100,
//     preview: component.render({ id: Symbol('id'), col: 0, row: 0, cols: 1, rows: 1 }),
//   });
//
//   const items = new Map();
//
//   cells.forEach((item, index) => {
//     const id = Symbol(`id-${index}`);
//
//     const cell = {
//       ...item,
//       id,
//       template: component.render({ ...item, id }),
//     };
//
//     grid.add(cell);
//
//     items.set(index, cell);
//   });
//
//   return { grid, items };
// };
//
// fdescribe('grid', () => {
//   let component: PreviewComponent;
//   let fixture: ComponentFixture<PreviewComponent>;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [PreviewComponent],
//     });
//     fixture = TestBed.createComponent(PreviewComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('shift to left', () => {
//     const { grid, items } = mock(component, { cols: 9, rows: 5 }, [
//       { col: 1, row: 1, cols: 4, rows: 4 },
//       { col: 5, row: 1, cols: 4, rows: 4 },
//     ]);
//
//     /**
//      *
//      *  ┌──────────────────┐
//      *  │ ┌───────┌───────┐│
//      *  │ │       │       ││
//      *  │ │       │       ││
//      *  │ │       │       ││
//      *  │ └───────└───────┘│
//      *  └──────────────────┘
//      *
//      *  ┌─────────────────┐
//      *  │ ┌─────┌───────┐ │
//      *  │ │     │ │     │ │
//      *  │ │     │ │     │ │
//      *  │ │     │ │     │ │
//      *  │ └─────└───────┘ │
//      *  └─────────────────┘
//      *
//      *  ┌─────────────────┐
//      *  ┌───────┌───────┐ │
//      *  │       │       │ │
//      *  │       │       │ │
//      *  │       │       │ │
//      *  └───────└───────┘ │
//      *  └─────────────────┘
//      *
//      */
//
//     grid.move({
//       ...items.get(1),
//       col: 4,
//     });
//
//     expect(items.get(0).template.context.$implicit.col).toEqual(0);
//   });
//
//   it('shift to left multiple items', () => {
//     const { grid, items } = mock(component, { cols: 14, rows: 5 }, [
//       { col: 1, row: 1, cols: 4, rows: 4 },
//       { col: 5, row: 1, cols: 4, rows: 4 },
//       { col: 9, row: 1, cols: 4, rows: 4 },
//     ]);
//
//     /**
//      *
//      *  ┌───────────────────────────┐
//      *  │ ┌───────┌───────┌───────┐ │
//      *  │ │       │       │       │ │
//      *  │ │       │       │       │ │
//      *  │ │       │       │       │ │
//      *  │ └───────└───────└───────┘ │
//      *  └───────────────────────────┘
//      *
//      *  ┌───────────────────────────┐
//      *  │ ┌───────┌─────┌───────┐   │
//      *  │ │       │     │ │     │   │
//      *  │ │       │     │ │     │   │
//      *  │ │       │     │ │     │   │
//      *  │ └───────└─────└───────┘   │
//      *  └───────────────────────────┘
//      *
//      *  ┌───────────────────────────┐
//      *  ┌───────┌───────┌───────┐   │
//      *  │       │       │       │   │
//      *  │       │       │       │   │
//      *  │       │       │       │   │
//      *  └───────└───────└───────┘   │
//      *  └───────────────────────────┘
//      *
//      */
//
//     grid.move({
//       ...items.get(2),
//       col: 8,
//     });
//
//     expect(items.get(0).template.context.$implicit.col).toEqual(0);
//     expect(items.get(1).template.context.$implicit.col).toEqual(4);
//   });
//
//   it('shift to left that is not possible', () => {
//     const { grid, items } = mock(component, { cols: 9, rows: 5 }, [
//       { col: 0, row: 1, cols: 4, rows: 4 },
//       { col: 4, row: 1, cols: 4, rows: 4 },
//     ]);
//
//     /**
//      *  ┌────────────────┐
//      *  ┌───────┌───────┐│
//      *  │       │       ││
//      *  │       │       ││
//      *  │       │       ││
//      *  └───────└───────┘│
//      *  └────────────────┘
//      *
//      *  ┌────────────────┐
//      *  ┌─────┌───────┐  │
//      *  │     │ │     │  │
//      *  │     │ │     │  │
//      *  │     │ │     │  │
//      *  └─────└───────┘  │
//      *  └────────────────┘
//      *
//      *  not possible
//      *
//      */
//
//     grid.move({
//       ...items.get(1),
//       col: 3,
//     });
//
//     expect(items.get(0).col).toEqual(0);
//     expect(items.get(1).col).toEqual(4);
//   });
//
//   it('shift to left more that available space', () => {
//     const { grid, items } = mock(component, { cols: 9, rows: 5 }, [
//       { col: 1, row: 1, cols: 4, rows: 4 },
//       { col: 5, row: 1, cols: 4, rows: 4 },
//     ]);
//
//     /**
//      *
//      *  ┌─────────────────┐
//      *  │ ┌───────┌───────┐
//      *  │ │       │       │
//      *  │ │       │       │
//      *  │ │       │       │
//      *  │ └───────└───────┘
//      *  └─────────────────┘
//      *
//      *  ┌─────────────────┐
//      *  │ ┌───┌───────┐   │
//      *  │ │   │   │   │   │
//      *  │ │   │   │   │   │
//      *  │ │   │   │   │   │
//      *  │ └───└───────┘   │
//      *  └─────────────────┘
//      *
//      *  not possible
//      *
//      */
//
//     grid.move({
//       ...items.get(1),
//       col: 3,
//     });
//
//     expect(items.get(0).col).toEqual(1);
//     expect(items.get(1).col).toEqual(5);
//   });
//
//   it('shift to left on multiple items that not have available space to move', () => {
//     const { grid, items } = mock(component, { cols: 14, rows: 5 }, [
//       { col: 1, row: 1, cols: 4, rows: 4 },
//       { col: 5, row: 1, cols: 4, rows: 4 },
//       { col: 9, row: 1, cols: 4, rows: 4 },
//     ]);
//
//     /**
//      *
//      *  ┌───────────────────────────┐
//      *  │ ┌───────┌───────┌───────┐ │
//      *  │ │       │       │       │ │
//      *  │ │       │       │       │ │
//      *  │ │       │       │       │ │
//      *  │ └───────└───────└───────┘ │
//      *  └───────────────────────────┘
//      *
//      *  ┌───────────────────────────┐
//      *  │ ┌───────┌───┌───────┐     │
//      *  │ │       │   │   │   │     │
//      *  │ │       │   │   │   │     │
//      *  │ │       │   │   │   │     │
//      *  │ └───────└───└───────┘     │
//      *  └───────────────────────────┘
//      *
//      *  not possible
//      *
//      */
//
//     grid.move({
//       ...items.get(2),
//       col: 7,
//     });
//
//     expect(items.get(0).col).toEqual(1);
//     expect(items.get(1).col).toEqual(5);
//     expect(items.get(2).col).toEqual(9);
//   });
//
//   it('shift to right', () => {
//     const { grid, items } = mock(component, { cols: 14, rows: 5 }, [
//       { col: 0, row: 1, cols: 4, rows: 4 },
//       { col: 4, row: 1, cols: 4, rows: 4 },
//     ]);
//
//     /**
//      *
//      *  ┌─────────────────┐
//      *  ┌───────┐───────┐ │
//      *  │       │       │ │
//      *  │       │       │ │
//      *  │       │       │ │
//      *  └───────┘───────┘ │
//      *  └─────────────────┘
//      *
//      *  ┌─────────────────┐
//      *  │ ┌───────┐─────┐ │
//      *  │ │     │ │     │ │
//      *  │ │     │ │     │ │
//      *  │ │     │ │     │ │
//      *  │ └───────┘─────┘ │
//      *  └─────────────────┘
//      *
//      *  ┌─────────────────┐
//      *  │┌───────┐───────┐│
//      *  ││       │       ││
//      *  ││       │       ││
//      *  ││       │       ││
//      *  │└───────┘───────┘│
//      *  └─────────────────┘
//      *
//      */
//
//     grid.move({
//       ...items.get(0),
//       col: 1,
//     });
//
//     expect(items.get(0).col).toEqual(1);
//     expect(items.get(1).col).toEqual(5);
//   });
// });
