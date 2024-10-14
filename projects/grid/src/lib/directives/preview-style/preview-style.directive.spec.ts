import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDirective } from './preview.directive';
import { GridEventType } from '../../types';

@Component({
  selector: 'kc-grid-dummy',
  template: `
    <div *kcGridPreview>Test</div>
  `,
})
class DumpyComponent {
  @ViewChild(PreviewDirective, { static: true }) gridItem!: PreviewDirective;
}

describe('PreviewDirective', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DumpyComponent, PreviewDirective],
      teardown: {
        destroyAfterEach: true,
      },
    }).compileComponents();

    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    const embeddedViewRef = component.gridItem.render(
      Symbol('id'),
      { col: 0, row: 0, cols: 1, rows: 1 },
      GridEventType.AfterAddRows,
    );

    expect(embeddedViewRef).toBeTruthy();
  });
});
