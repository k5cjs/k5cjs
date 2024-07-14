import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridComponent, ItemComponent, LinesComponent , PreviewComponent } from './components';
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
  ],
  imports: [CommonModule],
  exports: [GridComponent, GridItemDirective],
})
export class GridModule {}
