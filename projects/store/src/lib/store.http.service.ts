import { Observable } from 'rxjs';

import { AtLeastDeep } from '@k5cjs/types';

import { ByQueryParams, ObjectParams } from './store.type';

export abstract class HttpServiceBase<T extends { id: PropertyKey }> {
  abstract getByQuery(params: ByQueryParams): Observable<{ items: T[] } & ObjectParams>;

  abstract getById(id: { id: T['id'] }): Observable<{ item: T } & ObjectParams>;

  abstract delete(id: { id: T['id'] }): Observable<void>;

  abstract create(item: Omit<T, 'id'>): Observable<{ item: T } & ObjectParams>;

  abstract update(params: { item: AtLeastDeep<T, 'id'> }): Observable<{ item: T } & ObjectParams>;
}
