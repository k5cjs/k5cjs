import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { key } from './users.config';
import { Effects } from './users.effects';
import { reducer } from './users.reducer';

@NgModule({
  imports: [StoreModule.forFeature(key, reducer), EffectsModule.forFeature([Effects])],
})
export class UsersModule {}
