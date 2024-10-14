import { Directive, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { BackgroundConfig } from '../../types';

type Context = {
  $implicit: BackgroundConfig;
};

@Directive({
  selector: '[kcGridBackground]',
})
export class BackgroundDirective {
  public template = inject(TemplateRef<Context>);
  public viewContainer = inject(ViewContainerRef);

  static ngTemplateContextGuard(_dir: BackgroundDirective, _ctx: Context): _ctx is Context {
    return true;
  }
}
