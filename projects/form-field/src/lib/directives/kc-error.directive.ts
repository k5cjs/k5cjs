import { Directive, EmbeddedViewRef, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

type LabelFn<T = unknown> = (args: T) => string;
type Label<T = unknown> = string | LabelFn<T>;

interface Context<T = unknown> {
  $implicit: string;
  error: T;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[kcError]',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class KcError<T = unknown> {
  @Input('kcError') name!: string;
  @Input('kcErrorLabel') label!: Label<T>;

  private _embeddedViewRef?: EmbeddedViewRef<unknown>;

  // Make sure the template checker knows the type of the context with which the
  // template of this directive will be rendered
  static ngTemplateContextGuard<T>(_directive: KcError<T>, _context: unknown): _context is Context<T> {
    return true;
  }

  constructor(private vcr: ViewContainerRef, @Optional() public templateRef: TemplateRef<unknown>) {}

  render(error: T) {
    const context = this.context(error);

    const embeddedViewRef = this.templateRef.createEmbeddedView(context);
    const viewRef = this.vcr.insert(embeddedViewRef);
    this._embeddedViewRef = embeddedViewRef;

    return viewRef;

    // this._embeddedViewRef = this.vcr.createEmbeddedView(this.templateRef, context);

    // return this._embeddedViewRef;
  }

  update(error: T): void {
    if (!this._embeddedViewRef) return;

    const context = this.context(error);

    this._embeddedViewRef.context = context;
  }

  destroy(): void {
    if (!this._embeddedViewRef) return;

    this._embeddedViewRef.destroy();
  }

  context(error: T): Context<T> {
    const label: string = this._isLabelFn(this.label) ? this.label(error) : this.label;

    return {
      $implicit: label,
      error,
    };
  }

  private _isLabelFn(label: Label<T>): label is LabelFn<T> {
    return typeof label === 'function';
  }
}
