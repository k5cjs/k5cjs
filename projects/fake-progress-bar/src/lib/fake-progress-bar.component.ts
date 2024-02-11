import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';

import { toggleO } from '@k5cjs/animations';

import { K5cFakeProgressBarService } from './fake-progress-bar.service';

@Component({
  standalone: true,
  imports: [NgIf, AsyncPipe],
  selector: 'kc-fake-progress-bar, k5c-fake-progress-bar',
  templateUrl: './fake-progress-bar.component.html',
  styleUrls: ['./fake-progress-bar.component.scss'],
  animations: [toggleO(300)],
})
export class K5cFakeProgressBarComponent {
  width$: Observable<number>;

  constructor(private _fakeProgressBar: K5cFakeProgressBarService) {
    this.width$ = this._fakeProgressBar.progress.pipe(map((progress) => progress / 100));
  }
}
