import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Directive } from '@angular/core';

@Directive({
  selector: '[kcOrigin]',
  exportAs: 'kcOrigin',
})
export class KcOriginDirective extends CdkOverlayOrigin {}
