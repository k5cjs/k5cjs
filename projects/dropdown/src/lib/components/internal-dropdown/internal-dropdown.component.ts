import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { POSITIONS } from '../../config';
import { KcDropdownOptionsDirective } from '../../directives/dropdown.directive';

@Component({
  selector: 'kc-internal-dropdown',
  templateUrl: './internal-dropdown.component.html',
  styleUrls: ['./internal-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcInternalDropdownComponent implements OnDestroy {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('icon') icon!: ElementRef<HTMLElement>;
  @ContentChild(KcDropdownOptionsDirective) options!: KcDropdownOptionsDirective;

  private _dialogOverlayRef: OverlayRef | undefined;

  cdkOverlayConfig = {
    hasBackdrop: true,
    disposeOnNavigation: true,
    backdropClass: 'cdk-overlay-transparent-backdrop',
  };

  constructor(private _overlay: Overlay) {}

  ngOnDestroy(): void {
    this.container.clear();
  }

  open(): void {
    this._openDialog();
  }

  close() {
    this._closeDialog();
  }

  private _openDialog(): void {
    const overlayRef = this._overlay.create({
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this.icon)
        .withPositions(POSITIONS)
        .withPush(false),
      ...this.cdkOverlayConfig,
    });

    const dialogPortal = new TemplatePortal(this.options.template, this.container);
    overlayRef.attach(dialogPortal);

    this._dialogOverlayRef = overlayRef;

    overlayRef.backdropClick().subscribe(() => this._closeDialog());
  }

  private _closeDialog(): void {
    this._dialogOverlayRef?.dispose();
    this._dialogOverlayRef = undefined;
  }
}
