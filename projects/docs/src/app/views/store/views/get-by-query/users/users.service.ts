import { Injectable } from '@angular/core';

import { StoreServiceBase } from '@k5cjs/store';

import { actions } from './users.actions';
import { selectors } from './users.selectors';
import { User } from './users.type';

@Injectable({ providedIn: 'root' })
export class UsersService extends StoreServiceBase<User> {
  constructor() {
    super(actions, selectors);
  }
}
