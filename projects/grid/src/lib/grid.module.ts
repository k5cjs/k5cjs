import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { GridComponent, ItemComponent, LinesComponent, PreviewComponent } from './components';
import {
  GridDirective,
  GridItemDirective,
  PreviewDirective,
  PreviewStyleDirective,
  MoveDirective,
  ResizeBottomDirective,
  ResizeBottomLeftDirective,
  ResizeBottomRightDirective,
  ResizeLeftDirective,
  ResizeRightDirective,
  ResizeTopDirective,
  ResizeTopLeftDirective,
  ResizeTopRightDirective,
  BackgroundDirective,
} from './directives';

const externalDirectives: Type<unknown>[] = [
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
  BackgroundDirective,
  PreviewDirective,
  PreviewStyleDirective,
];

const internalDirectives: Type<unknown>[] = [];

@NgModule({
  declarations: [
    GridComponent,
    GridDirective,
    GridItemDirective,
    ItemComponent,
    PreviewComponent,
    LinesComponent,
    ...internalDirectives,
    ...externalDirectives,
  ],
  imports: [CommonModule],
  exports: [GridComponent, GridItemDirective, ...externalDirectives],
})
export class KcGridModule {}
