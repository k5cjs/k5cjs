import { ActionsBase } from '@k5cjs/store';

import { key } from './users.config';
import { User } from './users.type';

class Actions extends ActionsBase<User> {}

export const actions = new Actions(key);
