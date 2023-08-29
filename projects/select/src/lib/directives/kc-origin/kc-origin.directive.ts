import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[kcOrigin]',
  exportAs: 'kcOrigin',
})
export class KcOriginDirective extends CdkOverlayOrigin {
  override elementRef!: ElementRef<HTMLElement>;
}
