import { Observable } from 'rxjs';

import { AtLeastDeep } from '@k5cjs/types';

export abstract class HttpServiceBase<T extends { id: PropertyKey }> {
  abstract getByQuery(params: Record<PropertyKey, unknown>): Observable<{ items: T[] }>;

  abstract getById(id: { id: T['id'] }): Observable<{ item: T }>;

  abstract delete(id: { id: T['id'] }): Observable<void>;

  abstract create(item: Omit<T, 'id'>): Observable<{ item: T }>;

  abstract update(params: { item: AtLeastDeep<T, 'id'> }): Observable<{ item: T }>;
}
