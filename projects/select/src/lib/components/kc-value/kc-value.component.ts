import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { Observable, map, startWith } from 'rxjs';

import { MapEmitSelect } from '../../helpers';
import { KC_SELECTION } from '../../tokens';
import { KcOption } from '../../types';

@Component({
  selector: 'kc-value',
  templateUrl: './kc-value.component.html',
  styleUrls: ['./kc-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcValueComponent<T extends boolean = false> {
  value!: Observable<string | undefined>;

  constructor(@Inject(KC_SELECTION) private _selection: MapEmitSelect<KcOption<string, unknown>, string, T>) {
    this.value = this._selection.changed.pipe(
      startWith({ source: { selected: this._selection.selected } }),
      map(({ source: { selected } }) => {
        if (Array.isArray(selected)) return selected.map(({ label }) => label).join(', ');
        else if (selected && selected.label) return selected.label;
        else if (selected && typeof selected === 'object') return 'Object logic';

        return;
      }),
    );
  }

  @HostBinding('attr.prevent-close') get preventClose(): boolean {
    return true;
  }

  removeTag(event: Event): void {
    event.stopPropagation();
  }
}
