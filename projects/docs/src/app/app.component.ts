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
  }
}
