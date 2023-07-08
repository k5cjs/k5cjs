import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private _router: Router, private _route: ActivatedRoute) {
    this._route.queryParamMap.subscribe((params) => {
      const embed = params.get('embed');

      if (embed) void this._router.navigate([embed], { queryParams: { embed: null } });
    });
  }
}
