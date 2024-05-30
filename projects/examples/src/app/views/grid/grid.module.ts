import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridRoutingModule } from './grid-routing.module';
import { GridComponent } from './grid.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [GridComponent],
  imports: [CommonModule, GridRoutingModule, ReactiveFormsModule],
})
export class GridModule {}
