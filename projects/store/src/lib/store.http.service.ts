import { Observable } from 'rxjs';

import { AtLeastDeep } from '@k5cjs/types';

import { ActionInit, Params } from './store.type';

export abstract class HttpServiceBase<T extends { id: PropertyKey }> {
  abstract getByQuery(options: ActionInit): Observable<{ items: T[]; config?: Params; before?: Params }>;

  abstract getById(
    options: ActionInit<{ item: Pick<T, 'id'> }>,
  ): Observable<{ item: T; config?: Params; before?: Params }>;

  abstract create(
    options: ActionInit<{ item: Omit<T, 'id'> }>,
  ): Observable<{ item: T; config?: Params; before?: Params }>;

  abstract update(
    options: ActionInit<{ item: AtLeastDeep<T, 'id'> }>,
  ): Observable<{ item: T; config?: Params; before?: Params }>;

  abstract delete(
    options: ActionInit<{ item: Pick<T, 'id'> }>,
  ): Observable<{ item: Pick<T, 'id'>; config?: Params; before?: Params }>;
}
