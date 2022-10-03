import { ChangeDetectionStrategy, Component, ContentChild, Input, ViewChild, ViewContainerRef } from '@angular/core';

import { KcOptionDirective } from '../../directives';
import { KcOption } from '../../types';

@Component({
  selector: 'kc-options',
  templateUrl: './kc-options.component.html',
  styleUrls: ['./kc-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcOptionsComponent<K, V> {
  @Input()
  get options(): KcOption<K, V>[] {
    return this._options;
  }
  set options(options: KcOption<K, V>[]) {
    this._options = options;
    this._render();
  }
  private _options!: KcOption<K, V>[];

  /**
   *  { static: true } needs to be set when you want to access the ViewChild in ngOnInit.
   */
  @ContentChild(KcOptionDirective, { static: true }) public optionTemplate!: KcOptionDirective<K, V>;
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) protected _outlet!: ViewContainerRef;

  protected _render(): void {
    // TODO: implement trackBy
    this._outlet.clear();

    this.options.forEach((option) => {
      const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: option });
      this._outlet.insert(dialog);
    });
  }
}
