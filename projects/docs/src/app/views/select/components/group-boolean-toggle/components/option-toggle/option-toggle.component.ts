import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';

import { KC_SELECTION, KcOption, KcOptionComponent, MapEmitSelect } from '@k5cjs/select';

@Component({
  selector: 'app-option-toggle',
  templateUrl: './option-toggle.component.html',
  styleUrls: ['./option-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionToggleComponent extends KcOptionComponent<boolean, string, string> {
  constructor(
    @Inject(KC_SELECTION) selection: MapEmitSelect<KcOption<boolean, string, string>, string, boolean>,
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
