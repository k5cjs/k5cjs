import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-resize-bottom',
  templateUrl: './resize-bottom.component.html',
  styleUrl: './resize-bottom.component.scss',
})
export class ResizeBottomComponent {
  @Input({ required: true }) item!: KcGridItem;
}
