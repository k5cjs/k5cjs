import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-bottom-left',
  templateUrl: './resize-bottom-left.component.html',
  styleUrl: './resize-bottom-left.component.scss',
})
export class ResizeBottomLeftComponent {
  @Input({ required: true }) item!: KcGridItem;
}
