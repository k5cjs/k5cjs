import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { K5cFakeProgressBarComponent } from '@k5cjs/fake-progress-bar';

import { FakeProgressBarRoutingModule } from './fake-progress-bar-routing.module';
import { FakeProgressBarComponent } from './fake-progress-bar.component';

@NgModule({
  declarations: [FakeProgressBarComponent],
  imports: [CommonModule, FakeProgressBarRoutingModule, K5cFakeProgressBarComponent, ReactiveFormsModule],
})
export class FakeProgressBarModule {}
