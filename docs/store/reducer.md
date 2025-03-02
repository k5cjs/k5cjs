# Reducer

## Overview
Reducers define how the store's state changes in response to actions. They handle incoming actions and update the state accordingly. This ensures that the application's state remains predictable and immutable.

## Defining a Reducer
Reducers in this library are based on `@ngrx/store` and leverage `reducerBase` from `@k5cjs/store` to simplify state management.

### Example Reducer Definition
```typescript
import { reducerBase, stateBase } from '@k5cjs/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action } from '@ngrx/store';

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
```

> **See Also:**  
> - [`users.actions.ts`](./usage.md#users-actions-users-actions-ts) – Defines the actions used in the reducer.  
> - [`users.type.ts`](./usage.md#users-types-users-type-ts) – Defines the `User` type structure, including the `State` interface.  

### Explanation
- The `adapter` manages entity operations such as adding, updating, and removing users.
- The `initialState` sets up the default state using `adapter.getInitialState()`.
- The `reducerBase(adapter, actions)` automatically generates handlers for standard CRUD actions.

## Conclusion
Reducers are responsible for defining how state changes based on actions. With `reducerBase`, `@ngrx/entity`, and structured action handling, managing state remains efficient and scalable.
