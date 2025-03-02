import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { UsersService } from '../../users';
import { ItemComponent } from '../item';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AsyncPipe, ItemComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private _users = inject(UsersService);

  users$ = this._users.getByQuery({ params: {} }).pipe(map(({ items }) => items));
}
