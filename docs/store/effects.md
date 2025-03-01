# Effects

## Overview
Effects handle side effects such as API calls, logging, or other asynchronous operations when actions are dispatched. They ensure that application logic remains separate from the UI and reducers.

## Defining Effects
Effects are created by extending `EffectsBase` from `@k5cjs/store`. This simplifies the integration of side effects and state management.

### Example Effects Definition
```typescript
import { Injectable } from '@angular/core';
import { EffectsBase } from '@k5cjs/store';

import { actions } from './users.actions';
import { selectors } from './users.selectors';
import { HttpService } from './users.http.service';

@Injectable()
export class Effects extends EffectsBase<User> {
  constructor(http: HttpService) {
    super(actions, selectors, http);
  }
}
```

> **See Also:**  
> - [`users.actions.ts`](./usage.md#users-actions-users-actions-ts) – Defines actions that trigger state changes.  
> - [`users.selectors.ts`](./usage.md#users-selectors-users-selectors-ts) – Provides efficient state retrieval.  
> - [`users.http.service.ts`](./usage.md#users-http-service-users-http-service-ts) – Handles API interactions.

### Explanation
- `EffectsBase<User>` provides built-in effects for handling CRUD operations.
- The `HttpService` is injected to handle API requests triggered by dispatched actions.
- The `actions` and `selectors` are used to interact with the store efficiently.

## How Effects Work
1. An action (e.g., `actions.getByQuery()`) is dispatched from a component or service.
2. The effect listens for the action and triggers an API call using `HttpService`.
3. The result is processed, and either a success or failure action is dispatched to update the store.

## Conclusion
Effects streamline the management of side effects, ensuring that API interactions and complex logic remain outside the UI components and reducers.
