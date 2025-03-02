import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { blockInitialRender } from '@k5cjs/animations';

import { ActionsComponent } from './components/actions';
import { CodeComponent } from './components/code';
import { TableComponent } from './components/table';
import { UpdateComponent } from './components/update';
import { UsersModule } from './users';

@Component({
  selector: 'app-get-by-query',
  standalone: true,
  imports: [UsersModule, UpdateComponent, ActionsComponent, TableComponent, CodeComponent],
  templateUrl: './get-by-query.component.html',
  styleUrl: './get-by-query.component.scss',
  animations: [blockInitialRender()],
})
export class GetByQueryComponent {
  forms = new FormGroup({
    reloadSelectors: new FormControl(true, { nonNullable: true }),
    resetQueries: new FormControl(false, { nonNullable: true }),
    reloadIdentifiers: new FormControl(false, { nonNullable: true }),
  });
}
