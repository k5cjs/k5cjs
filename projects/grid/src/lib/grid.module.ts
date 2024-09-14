import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridComponent, ItemComponent, LinesComponent, PreviewComponent } from './components';
import {
  GridDirective,
  GridItemDirective,
  PreviewDirective,
  MoveDirective,
  ResizeBottomDirective,
  ResizeBottomLeftDirective,
  ResizeBottomRightDirective,
  ResizeLeftDirective,
  ResizeRightDirective,
  ResizeTopDirective,
  ResizeTopLeftDirective,
  ResizeTopRightDirective,
} from './directives';

const externalDirectives = [
  MoveDirective,
  ResizeTopDirective,
  ResizeTopDirective,
  ResizeTopLeftDirective,
  ResizeTopRightDirective,
  ResizeRightDirective,
  ResizeLeftDirective,
  ResizeBottomDirective,
  ResizeBottomLeftDirective,
  ResizeBottomRightDirective,
];

@NgModule({
  declarations: [
    GridComponent,
    GridDirective,
    GridItemDirective,
    ItemComponent,
    PreviewComponent,
    PreviewDirective,
    LinesComponent,
    ...externalDirectives,
  ],
  imports: [CommonModule],
  exports: [GridComponent, GridItemDirective, ...externalDirectives],
})
export class KcGridModule {}
