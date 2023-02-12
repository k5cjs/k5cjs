import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostListener,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { KcOptionDirective } from '../../directives';
import { KcOption } from '../../types';

@Component({
  selector: 'kc-options',
  templateUrl: './kc-options.component.html',
  styleUrls: ['./kc-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcOptionsComponent<V, K, L> {
  @Input()
  get options(): KcOption<V, K, L>[] {
    return this._options;
  }
  set options(options: KcOption<V, K, L>[]) {
    this._options = options;
    this._render();
  }
  private _options!: KcOption<V, K, L>[];

  /**
   *  { static: true } needs to be set when you want to access the ViewChild in ngOnInit.
   */
  @ContentChild(KcOptionDirective, { static: true }) public optionTemplate!: KcOptionDirective<V, K, L>;
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) protected _outlet!: ViewContainerRef;

  protected _render(): void {
    // TODO: implement trackBy
    this._outlet.clear();

    this.options.forEach((option) => {
      const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: option });
      this._outlet.insert(dialog);
    });
  }

  @HostListener('mousedown', ['$event'])
  protected _mousedown(event: MouseEvent): void {
    /**
     * Prevents the blur event from firing on the root element.
     * also prevent to close the dropdown when clicking on the options.
     */
    event.preventDefault();
  }
}
