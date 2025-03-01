# Selectors

## Overview
Selectors are functions that allow you to efficiently retrieve and compute derived state from the store. They help improve performance by reducing redundant calculations and ensuring optimized state selection.

## Defining Selectors
Selectors in this library are based on `@ngrx/store` and leverage the `SelectorsBase` class from `@k5cjs/store` to simplify state retrieval.

### Example Selector Definition
```typescript
import { SelectorsBase } from '@k5cjs/store';

import { key } from './users.config';
import { adapter } from './users.reducer';
import { User } from './users.type';

class Selectors extends SelectorsBase<User> {}

export const selectors = new Selectors(key, adapter);
```

> **See Also:**  
> - [`users.config.ts`](./usage.md#users-config-users-config-ts) – Defines the store `key`.  
> - [`users.reducer.ts`](./usage.md#users-reducer-users-reducer-ts) – Defines how the store updates the state.  
> - [`users.type.ts`](./usage.md#users-types-users-type-ts) – Defines the `User` type structure.  

### Explanation
- `SelectorsBase<User>` extends the base selectors functionality for `User` entities.
- `key` uniquely identifies the store feature.
- `adapter` is used to generate entity-based selectors.

## Using Selectors
Selectors are used within components and services to efficiently access store data. Example:

```typescript
import { Store } from '@ngrx/store';
import { selectors } from './users.selectors';

constructor(private store: Store) {}

this.store.select(selectors.all).subscribe(users => {
  console.log(users);
});
```

## Conclusion
Selectors provide a structured way to access store data efficiently. Using `SelectorsBase` helps maintain consistency and performance in your application.

