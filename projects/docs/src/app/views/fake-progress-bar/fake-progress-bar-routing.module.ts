import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FakeProgressBarComponent } from './fake-progress-bar.component';

const routes: Routes = [
  {
    path: '',
    component: FakeProgressBarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FakeProgressBarRoutingModule {}
