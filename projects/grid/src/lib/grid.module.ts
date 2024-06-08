import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridComponent } from './grid.component';
import { GridDirective } from './grid.directive';
import { ItemComponent } from './item/item.component';
import { PreviewComponent } from './preview/preview.component';
import { PreviewDirective } from './preview.directive';
import { LinesComponent } from './lines/lines.component';

@NgModule({
  declarations: [GridComponent, GridDirective, ItemComponent, PreviewComponent, PreviewDirective, LinesComponent],
  imports: [CommonModule],
  exports: [GridComponent],
})
export class GridModule {}
