import { Injectable } from '@angular/core';

import { EffectsBase } from '@k5cjs/store';

import { actions } from './users.actions';
import { HttpService } from './users.http.service';
import { selectors } from './users.selectors';
import { User } from './users.type';

@Injectable()
export class Effects extends EffectsBase<User> {
  constructor(http: HttpService) {
    super(actions, selectors, http);
  }
}
