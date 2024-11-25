import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { KcGridModule } from '@k5cjs/grid';

import {
  BackgroundComponent,
  BackgroundPagesComponent,
  BarComponent,
  CanvasComponent,
  DeleteComponent,
  MagnificationComponent,
  MoveComponent,
  PaginationComponent,
  ResizeBottomComponent,
  ResizeBottomLeftComponent,
  ResizeBottomRightComponent,
  ResizeLeftComponent,
  ResizeRightComponent,
  ResizeTopComponent,
  ResizeTopLeftComponent,
  ResizeTopRightComponent,
  SimpleComponent,
  TestInjectorChildComponent,
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
    ResizeTopComponent,
    ResizeTopRightComponent,
    ResizeRightComponent,
    ResizeBottomComponent,
    ResizeLeftComponent,
    ResizeBottomRightComponent,
    ResizeTopLeftComponent,
    ResizeBottomLeftComponent,
    DeleteComponent,
    MoveComponent,
    TestInjectorChildComponent,
    CanvasComponent,
  ],
  imports: [CommonModule, GridRoutingModule, ReactiveFormsModule, KcGridModule],
})
export class GridModule {}
