import { ConnectedPosition, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcOption, KcOptionValue } from '@k5cjs/select';

@Component({
  selector: 'app-overlay-options',
  templateUrl: './overlay-options.component.html',
  styleUrls: ['./overlay-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayOptionsComponent {
  control: UntypedFormControl;
  options: KcOption<string, string>[];

  overlayConfig: OverlayConfig = {
    hasBackdrop: true,
  }

  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY:50,
      offsetX:50
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY:50,
      offsetX:50
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY:50,
      offsetX:50
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY:50,
      offsetX:50
    },
  ]

  overlayConfig2: OverlayConfig = {
    hasBackdrop: true,
    positionStrategy: this._overlay.position().global().centerHorizontally().top('50px')
  }


  constructor(private _fb: UntypedFormBuilder, private _overlay: Overlay) {
    this.control = this._fb.control('Location 2');

    this.options = [
      {
        label: 'Location 1',
        value: 'Location 1',
      },
      {
        label: 'Location 2',
        value: 'Location 2',
      },
    ];
  }

  closed(value: KcOptionValue<string>) {
    // eslint-disable-next-line no-console
    console.log(value);
  }
}
