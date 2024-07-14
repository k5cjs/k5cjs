import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridItemDirective } from './directives/grid-item.directivee';

@Component({
  selector: 'kc-dummy',
  template: `
    <div *gridItem>Test</div>
  `,
})
class DumpyComponent {
  @ViewChild(GridItemDirective, { static: true }) gridItem!: GridItemDirective;
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
    const embeddedViewRef = component.gridItem.render({ id: Symbol('id'), col: 0, row: 0, cols: 1, rows: 1 });

    expect(embeddedViewRef).toBeTruthy();
  });
});
