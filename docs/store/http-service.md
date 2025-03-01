# HTTP Service

## Overview
The HTTP service is responsible for making API requests to fetch, create, update, and delete data from the backend. It extends `HttpServiceBase` from `@k5cjs/store` to ensure consistency and reuse across different entities.

## Defining the HTTP Service
The HTTP service interacts with the API and maps responses to the expected format.

### Example HTTP Service Definition
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
}
```

> **See Also:**  
> - [`users.type.ts`](./usage.md#users-types-users-type-ts) – Defines the `User` type structure.  

### Explanation
- `HttpServiceBase<User>` extends the base HTTP service functionality for handling API requests.
- `HttpClient` is injected to make HTTP calls to the backend.
- `User` represents the entity type managed by this service.

## Using the HTTP Service
The HTTP service is used inside effects to manage API calls efficiently.

## Conclusion
By extending `HttpServiceBase`, the HTTP service provides a structured way to interact with the API, ensuring consistency and efficiency.

