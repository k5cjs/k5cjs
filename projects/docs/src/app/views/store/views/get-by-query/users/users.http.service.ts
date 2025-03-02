import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ActionInit, HttpServiceBase, Params } from '@k5cjs/store';
import { AtLeastDeep } from '@k5cjs/types';

import { User } from './users.type';

@Injectable({ providedIn: 'root' })
export class HttpService extends HttpServiceBase<User> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getByQuery(_options: ActionInit): Observable<{ items: User[]; config?: Params; before?: Params }> {
    return of({
      items: Array.from({ length: 10 }).map((_, i) => ({
        id: `${i}`,
        name: `name ${i}`,
        age: i + 20,
        nickname: `nickname ${i}`,
      })),
    }).pipe(delay(300));
  }

  override update(
    options: ActionInit<{ item: AtLeastDeep<User, 'id'> }>,
  ): Observable<{ item: AtLeastDeep<User, 'id'> }> {
    return of({
      item: options.params.item,
    }).pipe(delay(300));
  }
}
