import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Highlight } from 'ngx-highlightjs';

import { UsersService } from '../../users';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, Highlight],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent {
  @Input() forms!: FormGroup<{
    reloadSelectors: FormControl<boolean>;
    resetQueries: FormControl<boolean>;
    reloadIdentifiers: FormControl<boolean>;
  }>;

  private _users = inject(UsersService);

  update(): void {
    const age = Math.floor(Math.random() * 100);

    this._users
      .update({
        params: { item: { id: '2', age } },
        ...this.forms.value,
      })
      .subscribe();
  }
}
