import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridItemDirective } from './grid-item.directive';
import { GridComponent } from './grid.component';
import { GridDirective } from './grid.directive';
import { ItemComponent } from './item/item.component';
import { LinesComponent } from './lines/lines.component';
import { PreviewComponent } from './preview/preview.component';
import { PreviewDirective } from './preview.directive';

@NgModule({
  declarations: [
    GridComponent,
    GridDirective,
    GridItemDirective,
    ItemComponent,
    PreviewComponent,
    PreviewDirective,
    LinesComponent,
  ],
  imports: [CommonModule],
  exports: [GridComponent, GridItemDirective],
})
export class GridModule {}
