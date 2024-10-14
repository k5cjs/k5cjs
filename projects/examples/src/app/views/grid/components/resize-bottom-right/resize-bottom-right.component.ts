import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-bottom-right',
  templateUrl: './resize-bottom-right.component.html',
  styleUrl: './resize-bottom-right.component.scss',
})
export class ResizeBottomRightComponent {
  @Input({ required: true }) item!: KcGridItem;
}
