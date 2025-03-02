import { reducerBase, stateBase } from '@k5cjs/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer } from '@ngrx/store';

import { actions } from './users.actions';
import { State, User } from './users.type';

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

const initialState: State = adapter.getInitialState({
  ...stateBase(),
});

export function reducer(state: State | undefined, action: Action): State {
  return createReducer(
    initialState,

    ...reducerBase(adapter, actions),
  )(state, action);
}
