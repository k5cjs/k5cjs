import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';

import { Highlight } from 'ngx-highlightjs';

import { UsersService } from '../../users';

import { code } from './code';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, Highlight],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent {
  private _users = inject(UsersService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  reloadSelectors = new FormControl(true, { nonNullable: true });
  resetQueries = new FormControl(false, { nonNullable: true });
  reloadIdentifiers = new FormControl(false, { nonNullable: true });

  code = ``;

  constructor() {
    this._update();

    merge(this.reloadSelectors.valueChanges, this.resetQueries.valueChanges, this.reloadIdentifiers.valueChanges)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._update();
        this._cdr.detectChanges();
      });
  }

  update(): void {
    this._update();

    const age = Math.floor(Math.random() * 100);

    this._users
      .update({
        params: { item: { id: '2', age } },
        reloadSelectors: this.reloadSelectors.value,
        resetQueries: this.resetQueries.value,
        reloadIdentifiers: this.reloadIdentifiers.value,
      })
      .subscribe();
  }

  private _update(): void {
    this.code = code(this.reloadSelectors.value, this.resetQueries.value, this.reloadIdentifiers.value);
  }
}
