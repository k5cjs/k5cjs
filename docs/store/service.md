# Service

## Overview
The **Service** is a layer that facilitates communication between the application components and the NGRX store. It extends `StoreServiceBase` from `@k5cjs/store`, providing a structured way to manage state interactions.

## Defining the Service
The Users Service is responsible for dispatching actions and selecting state data using predefined selectors.

### Example Service Definition
```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StoreServiceBase } from '@k5cjs/store';

import { actions } from './users.actions';
import { selectors } from './users.selectors';

@Injectable({ providedIn: 'root' })
export class UsersService extends StoreServiceBase<User> {
  constructor() {
    super(actions, selectors);
  }
}
```

> **See Also:**  
> - [`users.actions.ts`](./usage.md#users-actions-users-actions-ts) – Defines actions that trigger state changes.  
> - [`users.selectors.ts`](./usage.md#users-selectors-users-selectors-ts) – Provides efficient state retrieval.  

### Explanation
- **Extends `StoreServiceBase<User>`** – Inherits built-in CRUD functionalities for handling store actions.
- **Uses predefined `actions`** – These actions trigger state updates.
- **Uses predefined `selectors`** – Enables efficient state queries.

## Using the Users Service
The Users Service simplifies store interactions within Angular components and other services.

## Conclusion
By extending `StoreServiceBase`, the Users Service provides a structured and reusable way to manage the state layer.
