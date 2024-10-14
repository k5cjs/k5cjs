import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { KcGridModule } from '@k5cjs/grid';

import {
  BackgroundComponent,
  BackgroundPagesComponent,
  BarComponent,
  MagnificationComponent,
  PaginationComponent,
  SimpleComponent,
  TestInjectorComponent,
} from './components';
import { GridRoutingModule } from './grid-routing.module';
import { GridComponent } from './grid.component';

@NgModule({
  declarations: [
    GridComponent,
    TestInjectorComponent,
    SimpleComponent,
    PaginationComponent,
    BackgroundComponent,
    BackgroundPagesComponent,
    BarComponent,
    MagnificationComponent,
  ],
  imports: [CommonModule, GridRoutingModule, ReactiveFormsModule, KcGridModule],
})
export class GridModule {}
