import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridItemDirective } from './grid-item.directive';

@Component({
  selector: 'kc-grid-dummy',
  template: `
    <div *kcGridItem>Test</div>
  `,
})
class DumpyComponent {
  @ViewChild(GridItemDirective, { static: true }) gridItem!: GridItemDirective<void>;
}

describe('GridItemDirective', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DumpyComponent, GridItemDirective],
      teardown: {
        destroyAfterEach: true,
      },
    }).compileComponents();

    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    const embeddedViewRef = component.gridItem.viewContainer.createEmbeddedView(component.gridItem.template, {
      id: Symbol('id'),
      $implicit: { col: 0, row: 0, cols: 1, rows: 1 },
    });

    expect(embeddedViewRef).toBeTruthy();
  });
});
