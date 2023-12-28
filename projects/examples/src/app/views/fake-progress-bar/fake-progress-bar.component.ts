import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { K5cFakeProgressBarService } from '@k5cjs/fake-progress-bar';

@Component({
  selector: 'app-fake-progress-bar',
  templateUrl: './fake-progress-bar.component.html',
  styleUrls: ['./fake-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FakeProgressBarComponent {
  duration: FormControl = new FormControl(3000, { nonNullable: true });

  constructor(private _fakeProgressBar: K5cFakeProgressBarService) {}

  start(): void {
    this._fakeProgressBar.start(Number(this.duration.value));
  }

  stop(): void {
    this._fakeProgressBar.end();
  }
}
