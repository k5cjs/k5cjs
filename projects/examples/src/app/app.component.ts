import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private _router: Router, private _route: ActivatedRoute, private _renderer: Renderer2) {
    this._route.queryParamMap.subscribe((params) => {
      const embed = params.get('embed');
      const dark = params.get('dark');

      if (coerceBooleanProperty(dark)) this._renderer.addClass(document.documentElement, 'dark');

      if (embed) void this._router.navigate([embed], { queryParams: { embed: null } });
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    // const temp = window.HTMLElement.prototype.animate;

    // window.HTMLElement.prototype.animate = function (keyframes, options) {
    //   console.warn('animate', keyframes, options);
    //   return temp(keyframes, options);
    // };

    const element = document.createElement('div');

    const originalApply = window.HTMLElement.prototype.animate;

    window.HTMLElement.prototype.animate = function (keyframes, options) {
      console.trace('INTERCEPTING APPLY', keyframes, options);
      const ret = originalApply.call(this, keyframes, options);

      // "cancel": AnimationPlaybackEvent;
      // "finish": AnimationPlaybackEvent;
      // "remove": Event;

      ret.addEventListener('cancel', () => console.log('CANCEL'));
      ret.addEventListener('finish', () => console.log('FINISH'));
      ret.addEventListener('remove', () => console.log('REMOVE'));

      const temp = ret.cancel;

      ret.cancel = function () {
        console.trace('INTERCEPTING CANCEL');
        // temp.call(this);
      };

      const finish = ret.finish;

      ret.finish = function () {
        console.trace('INTERCEPTING FINISH');
        // temp.call(this);

        return finish.call(this);
      };

      return ret;
    };
  }
}
