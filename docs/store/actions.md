# Actions

## Overview
Actions define the events that trigger state changes in the NGRX store. They serve as the primary communication mechanism between components, services, and the store. Actions in this library follow a standardized naming convention to maintain consistency and predictability.

## Defining Actions
Actions are created using `createAction` from `@ngrx/store`. The `ActionsBase` class from `@k5cjs/store` simplifies the process of defining and managing actions.

### Example Action Definitions
```typescript
import { ActionsBase } from '@k5cjs/store';
import { key } from './users.config';
import { User } from './users.type';

class Actions extends ActionsBase<User> {}

export const actions = new Actions(key);
```

> **See Also:**  
> - [`users.config.ts`](./usage.md#users-config-users-config-ts) – Defines the store key.  
> - [`users.type.ts`](./usage.md#users-types-users-type-ts) – Defines the `User` type structure.  

### Explanation
- The `ActionsBase<User>` class automatically generates CRUD actions.
- `key` is the unique identifier for this store (e.g., `'users'`).
- The `actions` instance provides methods to interact with the store.

## Available Actions
The `ActionsBase` provides the following predefined actions:

| Action Method           | Description                                      |
|-------------------------|--------------------------------------------------|
| `actions.getByQuery()`  | Fetch a list of items based on a query.         |
| `actions.getById()`     | Fetch a single item by its ID.                  |
| `actions.create()`      | Create a new entity in the store.               |
| `actions.update()`      | Update an existing entity.                      |
| `actions.updateAll()`   | Update multiple entities at once.               |
| `actions.delete()`      | Remove an entity from the store.                |

Each of these actions follows the standard NGRX pattern:
- **Trigger Action:** Initiates the operation.
- **Success Action:** Dispatched when the operation succeeds.
- **Error Action:** Dispatched when an error occurs.
- **Loaded Action:** Dispatched when the data is fully loaded (for `getByQuery` and `getById`).


## Conclusion
The `ActionsBase` class in `@k5cjs/store` simplifies action management by generating standard CRUD actions. These actions can be dispatched from components, handled in reducers, and processed in effects.
