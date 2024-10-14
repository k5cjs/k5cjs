import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-top',
  templateUrl: './resize-top.component.html',
  styleUrl: './resize-top.component.scss',
})
export class ResizeTopComponent {
  @Input({ required: true }) item!: KcGridItem;
}
