# Usage

## Overview

This page provides an overview of how to use the store library, detailing each file's purpose and role in managing state with NGRX.

---

## Users Config (`users.config.ts`)

Defines the key used to identify the store.

```typescript
export const key = 'users';
```

---

## Users Types (`users.type.ts`)

Defines the structure of user-related entities.

```typescript
import { StateBase } from '@k5cjs/store';

export type State = StateBase<User>;

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}
```

---

## Users Actions (`users.actions.ts`)

Defines the actions used to interact with the store.

```typescript
import { ActionsBase } from '@k5cjs/store';

import { key } from './users.config';
import { User } from './users.type';

class Actions extends ActionsBase<User> {}

export const actions = new Actions(key);
```

---

## Users Reducer (`users.reducer.ts`)

Defines how the store state changes in response to actions.

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

---

## Users Selectors (`users.selectors.ts`)

Selectors allow components to get specific slices of state efficiently.

```typescript
import { SelectorsBase } from '@k5cjs/store';

import { key } from './users.config';
import { adapter } from './users.reducer';
import { User } from './users.type';

class Selectors extends SelectorsBase<User> {}

export const selectors = new Selectors(key, adapter);
```

---

## Users HTTP Service (`users.http.service.ts`)

Handles API calls and interacts with backend services.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ActionInit, HttpParams, HttpServiceBase, Params } from '@k5cjs/store';

import { User } from './users.type';

@Injectable({ providedIn: 'root' })
export class HttpService extends HttpServiceBase<User> {
  constructor(private _http: HttpClient) {
    super();
  }

  override getByQuery({ params }: ActionInit<HttpParams>): Observable<{ items: User[]; config: Params }> {
    return this._http
      .get<{ content: User[]; totalElements: number }>('/api/users', { params })
      .pipe(map(({ content: items, totalElements: total }) => ({ items, config: { total } })));
  }
}
```

---

## Users Effects (`users.effects.ts`)

Handles side effects such as API requests when actions are dispatched.

```typescript
import { Injectable } from '@angular/core';
import { EffectsBase } from '@k5cjs/store';

import { actions } from './users.actions';
import { selectors } from './users.selectors';
import { HttpService } from './users.http.service';
import { User } from './users.type';

@Injectable()
export class Effects extends EffectsBase<User> {
  constructor(http: HttpService) {
    super(actions, selectors, http);
  }
}
```

---

## Users Service (`users.service.ts`)

Provides an abstraction over store interactions.

```typescript
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
```

---

## Users Module (`users.module.ts`)

Registers the store and effects for users.

```typescript
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { key } from './users.config';
import { Effects } from './users.effects';
import { reducer } from './users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(key, reducer),
    EffectsModule.forFeature([Effects])
  ],
})
export class UsersModule {}
```

---

## Conclusion

This guide provides a complete overview of the store's core files and their roles in managing state efficiently
