import { Component } from '@angular/core';

import { blockInitialRender } from '@k5cjs/animations';

import { ActionsComponent } from './components/actions';
import { TableComponent } from './components/table';
import { UpdateComponent } from './components/update';
import { UsersModule } from './users';

@Component({
  selector: 'app-get-by-query',
  standalone: true,
  imports: [UsersModule, UpdateComponent, ActionsComponent, TableComponent],
  templateUrl: './get-by-query.component.html',
  styleUrl: './get-by-query.component.scss',
  animations: [blockInitialRender()],
})
export class GetByQueryComponent {}
