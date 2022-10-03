import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { KcOption, KcOptionsComponent } from '@k5cjs/select';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent extends KcOptionsComponent<string, string> {
  @Output() index: EventEmitter<number>;

  constructor() {
    super();

    this.index = new EventEmitter<number>();
  }

  trackBy(_: number, option: KcOption<string, string>): string {
    return option.value;
  }

  scrolledIndexChange(index: number): void {
    this.index.next(index);
  }

  protected override _render(): void {
    //
  }
}
