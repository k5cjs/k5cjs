import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-left',
  templateUrl: './resize-left.component.html',
  styleUrl: './resize-left.component.scss',
})
export class ResizeLeftComponent {
  @Input({ required: true }) item!: KcGridItem;
}
