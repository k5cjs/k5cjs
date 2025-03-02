import { SelectorsBase } from '@k5cjs/store';

import { key } from './users.config';
import { adapter } from './users.reducer';
import { User } from './users.type';

class Selectors extends SelectorsBase<User> {}

export const selectors = new Selectors(key, adapter);
