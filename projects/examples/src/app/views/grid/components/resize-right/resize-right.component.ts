import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-right',
  templateUrl: './resize-right.component.html',
  styleUrl: './resize-right.component.scss',
})
export class ResizeRightComponent {
  @Input({ required: true }) item!: KcGridItem;
}
