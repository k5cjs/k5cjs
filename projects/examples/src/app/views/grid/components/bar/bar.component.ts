import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { KcGridService } from '@k5cjs/grid';

import { Data } from '../../types';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss',
})
export class BarComponent implements OnInit {
  @Input({ required: true }) grid!: KcGridService;
  @Input({ required: true }) scale!: FormControl<number>;

  hasUndo!: Observable<boolean>;
  hasRedo!: Observable<boolean>;

  ngOnInit(): void {
    this.hasUndo = this.grid.hasUndo$;
    this.hasRedo = this.grid.hasRedo$;
  }

  undo(): void {
    this.grid.undo();
  }

  redo(): void {
    this.grid.redo();
  }

  add(): void {
    this.grid.add<Data>({ rows: 2, cols: 2, data: { id: '5', name: 'Item 5', value: 5 } });
  }
}
