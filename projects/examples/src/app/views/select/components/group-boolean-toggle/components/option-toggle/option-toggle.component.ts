import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';

import { KC_SELECTION, KcOption, KcOptionComponent } from '@k5cjs/select';
import { MapEmit } from '@k5cjs/selection-model';

@Component({
  selector: 'app-option-toggle',
  templateUrl: './option-toggle.component.html',
  styleUrls: ['./option-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionToggleComponent extends KcOptionComponent<string, boolean> {
  constructor(
    @Inject(KC_SELECTION) selection: MapEmit<string | boolean, KcOption<string | boolean, boolean>, boolean>,
    cdr: ChangeDetectorRef,
  ) {
    super(selection, cdr);
  }

  override get selected(): boolean {
    return !!this._selection.get(this.option.key || this.option.value)?.value || false;
  }

  override toggle(): void {
    if (this._selection.has(this.option.key || this.option.value)) this._update();
    else this.select();
  }

  override select(): void {
    this._selection.set(this.option.key || this.option.value, this.option);
  }

  private _update(): void {
    this._selection.update(this.option.key || this.option.value, {
      ...this.option,
      value: !this.selected,
    });
  }
}
