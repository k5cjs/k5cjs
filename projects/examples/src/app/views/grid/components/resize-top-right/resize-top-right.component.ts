import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-top-right',
  templateUrl: './resize-top-right.component.html',
  styleUrl: './resize-top-right.component.scss',
})
export class ResizeTopRightComponent {
  @Input({ required: true }) item!: KcGridItem;
}
