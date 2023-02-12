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
        // TODO: need to check if this is not { value: string, label: string }
        else if (selected && typeof selected === 'object' && Object.keys(selected).length > 0) return 'Object logic';
        else if (selected && selected.label) return selected.label;

        return;
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
