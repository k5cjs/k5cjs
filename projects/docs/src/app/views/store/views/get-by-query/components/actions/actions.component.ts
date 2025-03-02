import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
  animations: [
    trigger('show', [
      transition(':enter', [style({ background: '#22c55e' }), animate('300ms', style({ background: '*' }))]),
    ]),
  ],
})
export class ActionsComponent {
  @ViewChild('content', { static: true }) content!: ElementRef<HTMLElement>;

  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _actions = inject(Actions);

  actions: { id: number; type: string }[] = [];

  constructor() {
    let index = 0;

    this._actions.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ type }: Action) => {
      this.actions.push({ id: index++, type });

      this._cdr.detectChanges();

      this.content.nativeElement.scrollTo({ top: this.content.nativeElement.scrollHeight });
    });
  }
}
