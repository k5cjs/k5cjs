# Module

## Overview
The **Module** integrates the store and effects into the Angular application. It sets up the state management for the `users` feature using **NgRx Store** and **NgRx Effects**.

## Defining the Users Module
This module registers the reducer and effects for managing user-related state.

### Example Users Module Definition
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

> **See Also:**  
> - [`users.config.ts`](./usage.md#users-config-users-config-ts) – Defines the store key.  
> - [`users.effects.ts`](./usage.md#users-effects-users-effects-ts) – Handles API interactions.  
> - [`users.reducer.ts`](./usage.md#users-reducer-users-reducer-ts) – Manages state updates.  

## Explanation
- **`StoreModule.forFeature(key, reducer)`** registers the reducer for the users feature in the store.
- **`EffectsModule.forFeature([Effects])`** enables side effects for handling asynchronous operations.
- The `UsersModule` encapsulates all NgRx-related logic for managing users.

## Conclusion
The `UsersModule` integrates the store and effects for managing users in an Angular application using NgRx. This module ensures that user-related state and effects are properly registered and available throughout the application.
