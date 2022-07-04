import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { Observable, map, startWith } from 'rxjs';

import { MapEmit } from '@k5cjs/selection-model';

import { KC_SELECTION } from '../../tokens';
import { KcOption } from '../../types';

@Component({
  selector: 'kc-value',
  templateUrl: './kc-value.component.html',
  styleUrls: ['./kc-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcValueComponent<T extends boolean = false> {
  value!: Observable<string>;

  constructor(@Inject(KC_SELECTION) private _selection: MapEmit<string, KcOption<string, unknown>, T>) {
    this.value = this._selection.changed.pipe(
      startWith({ source: { selected: this._selection.selected } }),
      map(({ source: { selected } }) => {
        if (Array.isArray(selected)) {
          return selected.map(({ label }) => label).join(', ');
        }

        if (selected && selected.label) return selected.label;

        return '';
      }),
    );
  }

  @HostBinding('prevent-close') get preventClose(): boolean {
    return true;
  }

  removeTag(event: Event): void {
    event.stopPropagation();
  }
}
