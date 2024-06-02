import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridComponent } from './grid.component';
import { GridDirective } from './grid.directive';
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [GridComponent, GridDirective, ItemComponent],
  imports: [CommonModule],
  exports: [GridComponent],
})
export class GridModule {}
