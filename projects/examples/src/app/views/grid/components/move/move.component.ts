import { Component, Input } from '@angular/core';

import { KcGridItem } from '@k5cjs/grid';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrl: './move.component.scss',
})
export class MoveComponent {
  @Input({ required: true }) item!: KcGridItem;
}
