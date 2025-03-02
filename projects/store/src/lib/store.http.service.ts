import { Observable } from 'rxjs';

import { AtLeastDeep } from '@k5cjs/types';

import { ActionInit, Params } from './store.type';

export abstract class HttpServiceBase<T extends { id: PropertyKey }> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getByQuery(options: ActionInit): Observable<{ items: T[]; config?: Params; before?: Params }> {
    throw new Error('The getByQuery method has not been implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById(options: ActionInit<{ item: Pick<T, 'id'> }>): Observable<{ item: T; config?: Params; before?: Params }> {
    throw new Error('The getById method has not been implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(options: ActionInit<{ item: Omit<T, 'id'> }>): Observable<{ item: T; config?: Params; before?: Params }> {
    throw new Error('The create method has not been implemented.');
  }

  update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: ActionInit<{ item: AtLeastDeep<T, 'id'> }>,
  ): Observable<{ item: T; config?: Params; before?: Params }> {
    throw new Error('The update method has not been implemented.');
  }

  updateAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: ActionInit<{ items: AtLeastDeep<T, 'id'>[] }>,
  ): Observable<{ items: T[]; config?: Params; before?: Params }> {
    throw new Error('The updateAll method has not been implemented.');
  }

  delete(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: ActionInit<{ item: AtLeastDeep<T, 'id'> }>,
  ): Observable<{ item: T; config?: Params; before?: Params }> {
    throw new Error('The delete method has not been implemented.');
  }
}
