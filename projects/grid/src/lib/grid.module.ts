import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  GridComponent,
  ItemComponent,
  LinesComponent,
  PreviewComponent,
  ResizeBottomComponent,
  ResizeBottomLeftComponent,
  ResizeBottomRightComponent,
  ResizeLeftComponent,
  ResizeRightComponent,
  ResizeTopComponent,
  ResizeTopLeftComponent,
  ResizeTopRightComponent,
} from './components';
import { GridDirective, GridItemDirective, PreviewDirective } from './directives';

@NgModule({
  declarations: [
    GridComponent,
    GridDirective,
    GridItemDirective,
    ItemComponent,
    PreviewComponent,
    PreviewDirective,
    LinesComponent,
    ResizeTopComponent,
    ResizeTopRightComponent,
    ResizeRightComponent,
    ResizeBottomComponent,
    ResizeLeftComponent,
    ResizeBottomRightComponent,
    ResizeBottomLeftComponent,
    ResizeTopLeftComponent,
  ],
  imports: [CommonModule],
  exports: [GridComponent, GridItemDirective],
})
export class GridModule {}
