import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-top-left',
  templateUrl: './resize-top-left.component.html',
  styleUrl: './resize-top-left.component.scss',
})
export class ResizeTopLeftComponent {
  @Input({ required: true }) item!: KcGridItem;
}
