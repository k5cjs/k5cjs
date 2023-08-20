import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { KcOption, KcOptionDirective } from '@k5cjs/select';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent implements OnInit {
  @Input() option!: KcOption<string, string, string>;
  @Input() optionTemplate!: KcOptionDirective<string, string, string>;

  @ViewChild('outlet', { static: true, read: ViewContainerRef }) protected _outlet!: ViewContainerRef;

  ngOnInit(): void {
    const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: this.option });
    this._outlet.insert(dialog);
  }
}
