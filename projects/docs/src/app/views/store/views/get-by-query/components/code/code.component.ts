import { ChangeDetectorRef, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';

import { Highlight } from 'ngx-highlightjs';

import { code } from './code';

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [Highlight],
  templateUrl: './code.component.html',
  styleUrl: './code.component.scss',
})
export class CodeComponent implements OnInit {
  @Input() forms!: FormGroup<{
    reloadSelectors: FormControl<boolean>;
    resetQueries: FormControl<boolean>;
    reloadIdentifiers: FormControl<boolean>;
  }>;

  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  code: string = '';

  ngOnInit(): void {
    this.forms.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._update();
      this._cdr.detectChanges();
    });

    this._update();
  }

  private _update(): void {
    const value = this.forms.value;

    this.code = code(value.reloadSelectors!, value.resetQueries!, value.reloadIdentifiers!);
  }
}
