import { Component, Input } from '@angular/core';

import { KcGridService } from '@k5cjs/grid';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
})
export class DeleteComponent {
  @Input({ required: true }) grid!: KcGridService;
  @Input({ required: true }) id!: symbol;

  delete(): void {
    this.grid.delete(this.id);
  }
}
