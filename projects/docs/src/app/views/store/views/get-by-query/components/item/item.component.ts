import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';

import { User } from '../../users';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  animations: [
    trigger('show', [
      transition(':increment', [style({ background: '#22c55e' }), animate('300ms', style({ background: '*' }))]),
    ]),
  ],
})
export class ItemComponent implements OnChanges {
  @Input() user!: User;

  increment = 0;

  ngOnChanges(): void {
    this.increment += 1;
  }
}
