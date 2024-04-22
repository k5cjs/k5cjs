/* eslint-disable @ngrx/good-action-hygiene */
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Observable, catchError, delay, first, map, of, throwError, zip } from 'rxjs';

import { AtLeastDeep } from '@k5cjs/types';
import { EffectsModule } from '@ngrx/effects';
import { IdSelector, createEntityAdapter } from '@ngrx/entity';
import { Action, Store, StoreModule, createAction, createReducer, on, props } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ActionsBase } from './store.actions';
import { EffectsBase } from './store.effects';
import { HttpServiceBase } from './store.http.service';
import { reducerBase, stateBase } from './store.reducer';
import { SelectorsBase } from './store.selectors';
import { StoreServiceBase } from './store.service';
import { ActionInit, HttpParams, Options, Params, StateBase } from './store.type';

const SELECT_ID_TOKEN = new InjectionToken<IdSelector<FeatureStoreType>>('SELECT_ID');

const key = 'store';

interface FeatureStoreType {
  id: string;
  name: string;
  age?: number;
}

class Actions extends ActionsBase<FeatureStoreType> {}

const actions = new Actions(key);

type State = StateBase<FeatureStoreType>;

const adapter = (selectId: IdSelector<FeatureStoreType> | null) =>
  createEntityAdapter<FeatureStoreType>({
    ...(selectId && { selectId }),
  });

const initialState = (selectId: IdSelector<FeatureStoreType> | null) =>
  adapter(selectId).getInitialState<State>({
    ...stateBase(),
  });

let reloadSelectors = 0;

function reducer(selectId: IdSelector<FeatureStoreType> | null) {
  return (state: State | undefined, action: Action): State => {
    return createReducer(
      initialState(selectId),

      ...reducerBase(adapter(selectId), actions),

      on(createAction('set', props<{ payload: State }>()), (_, { payload }): StateBase<FeatureStoreType> => payload),

      on(createAction('reset'), (state): StateBase<FeatureStoreType> => {
        reloadSelectors += 10;

        return { ...state, reloadSelectors };
      }),
    )(state, action);
  };
}

class Selectors extends SelectorsBase<FeatureStoreType> {}

const selectors = (selectId: IdSelector<FeatureStoreType> | null) => new Selectors(key, adapter(selectId));

@Injectable({ providedIn: 'root' })
class HttpService extends HttpServiceBase<FeatureStoreType> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getByQuery(_options: ActionInit<HttpParams>): Observable<{ items: FeatureStoreType[] }> {
    return of({ items: [], total: 0 });
  }

  test = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById(_options: ActionInit<{ item: Pick<FeatureStoreType, 'id'> }>): Observable<{ item: FeatureStoreType }> {
    if (this.test) {
      return of({ item: { id: '1', name: 'first' } });
    }

    this.test += 1;

    return throwError(() => 'errror');
  }

  delete(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: ActionInit<{ item: AtLeastDeep<FeatureStoreType, 'id'> }>,
  ): Observable<{ item: FeatureStoreType }> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_options: ActionInit<{ item: Omit<FeatureStoreType, 'id'> }>): Observable<{ item: FeatureStoreType }> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_options: ActionInit<{ item: AtLeastDeep<FeatureStoreType, 'id'> }>): Observable<{ item: FeatureStoreType }> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAll(_options: ActionInit<{ items: AtLeastDeep<FeatureStoreType, 'id'>[] }>): Observable<{
    items: FeatureStoreType[];
  }> {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
class Effects extends EffectsBase<FeatureStoreType> {
  constructor(
    http: HttpService,
    @Optional()
    @Inject(SELECT_ID_TOKEN)
    selectId: IdSelector<FeatureStoreType> | null,
  ) {
    super(actions, selectors(selectId), http);
  }
}

@Injectable({ providedIn: 'root' })
class StoreService extends StoreServiceBase<FeatureStoreType> {
  constructor(
    @Optional()
    @Inject(SELECT_ID_TOKEN)
    selectId: IdSelector<FeatureStoreType> | null,
  ) {
    super(actions, selectors(selectId));
  }

  override getByQuery(
    options: Options<Params, unknown, { items: unknown[]; name: string; age: number }>,
  ): Observable<{ items: FeatureStoreType[]; total: number }>;
  override getByQuery(options: Options<Params>): Observable<{ items: FeatureStoreType[] } & Params> {
    return super.getByQuery(options);
  }

  query(params: Record<PropertyKey, unknown>): string {
    return this._query(params);
  }
}

describe('Store', () => {
  let service: StoreService;
  let http: HttpService;
  // eslint-disable-next-line @ngrx/no-typed-global-store
  let store: Store<{ [key]: StateBase<FeatureStoreType> }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ [key]: reducer(null) }),
        EffectsModule.forRoot([Effects]),
        StoreDevtoolsModule.instrument({ maxAge: 100, name: 'Orbility back office' }),
      ],
      teardown: {
        destroyAfterEach: false,
      },
    });

    service = TestBed.inject(StoreService);
    http = TestBed.inject(HttpService);
    store = TestBed.inject(Store) as Store<{ [key]: StateBase<FeatureStoreType> }>;

    store.dispatch({ type: 'reset' });
  });

  it('getByQuery success', fakeAsync(() => {
    spyOn(http, 'getByQuery').and.returnValue(of({ items: [{ id: '1', name: 'first' }], config: { total: 1 } }));

    let expected: { items: unknown[]; total: number };
    service.getByQuery({ params: {} }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ items: [{ id: '1', name: 'first' }], total: 1 });
  }));

  it('getByQuery is loaded', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {
          [service.query({ params: {} })]: {
            ids: ['1'],
            total: 1,
          },
        },
        reloadSelectors,
      },
    });

    let expected: { items: unknown[]; total: number };

    service.getByQuery({ params: {} }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ items: [{ id: '1', name: 'first' }], total: 1 });
  }));

  it('getByQuery error', fakeAsync(() => {
    spyOn(http, 'getByQuery').and.returnValue(
      of({ items: [{ id: '1', name: 'first' }], total: 1 }).pipe(
        map(() => {
          throw new HttpErrorResponse({ error: 'error message' });
        }),
      ),
    );

    let expected: unknown;
    let expectedError: unknown;

    service.getByQuery({ params: {} }).subscribe({
      next: () => (expected = 'next'),
      error: (error: unknown) => (expectedError = error),
    });

    let expectedErrorFromError: unknown;
    service.error({ params: {} }).subscribe((value) => (expectedErrorFromError = value));

    flush();

    expect(expected).toBeUndefined();
    expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
    expect(expectedError!).toEqual(expectedErrorFromError!);
  }));

  it('getById success', fakeAsync(() => {
    spyOn(http, 'getById').and.returnValue(of({ item: { id: '1', name: 'first' } }));

    let expected: { item: FeatureStoreType };
    service
      .getById({ params: { item: { id: '1' } } })
      .pipe(first())
      .subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ item: { id: '1', name: 'first' } });
  }));

  it('getById is loaded', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {
          [service.query({ params: { item: { id: '1' } } })]: {
            ids: ['1'],
          },
        },
        reloadSelectors,
      },
    });

    flush();

    let expected: { item: FeatureStoreType };

    service.getById({ params: { item: { id: '1' } } }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ item: { id: '1', name: 'first' } });
  }));

  it('getById error', fakeAsync(() => {
    spyOn(http, 'getById').and.returnValue(
      of({ item: { id: '1', name: 'first' } }).pipe(
        map(() => {
          throw new HttpErrorResponse({ error: 'error message' });
        }),
      ),
    );

    let expected: unknown;
    let expectedError: unknown;

    service.getById({ params: { item: { id: '1' } } }).subscribe({
      next: () => (expected = 'next'),
      error: (error: unknown) => (expectedError = error),
    });

    let expectedErrorFromError: unknown;
    service.error({ params: { item: { id: '1' } } }).subscribe((value) => (expectedErrorFromError = value));

    flush();

    expect(expected).toBeUndefined();
    expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
    expect(expectedError!).toEqual(expectedErrorFromError!);
  }));

  it('create success', fakeAsync(() => {
    spyOn(http, 'create').and.returnValue(of({ item: { id: '1', name: 'created' } }));

    let expected: { item: FeatureStoreType };
    service.create({ params: { item: { name: 'test create' } }, first: true }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ item: { id: '1', name: 'created' } });
  }));

  it('create success (skip reset)', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {
          [service.query({ params: { item: { name: 'first' } } })]: { ids: ['1'] },
        },
        reloadSelectors,
      },
    });

    spyOn(http, 'create').and.returnValue(of({ item: { id: '2', name: 'created' } }));

    let expected: { item: FeatureStoreType };
    service
      .create({ params: { item: { name: 'created' } }, resetQueries: false, first: true })
      .subscribe((value) => (expected = value));

    flush();

    let expectedState: State;
    store
      .select(key)
      .pipe(first())
      .subscribe((value) => (expectedState = value));

    expect(expected!).toEqual({ item: { id: '2', name: 'created' } });

    expect(expectedState!).toEqual({
      ids: ['1', '2'],
      entities: {
        '1': { id: '1', name: 'first' },
        '2': { id: '2', name: 'created' },
      },
      errors: {
        [service.query({ params: { item: { name: 'created' } } })]: undefined,
      },
      loadings: {
        [service.query({ params: { item: { name: 'created' } } })]: false,
      },
      queries: {
        [service.query({ params: { item: { name: 'first' } } })]: { ids: ['1'] },
        [service.query({ params: { item: { name: 'created' } } })]: { ids: ['2'] },
      },
      reloadSelectors,
    });
  }));

  it('create error', fakeAsync(() => {
    spyOn(http, 'create').and.returnValue(
      of({ item: { id: '1', name: 'first' } }).pipe(
        map(() => {
          throw new HttpErrorResponse({ error: 'error message' });
        }),
      ),
    );

    let expected: unknown;
    let expectedError: unknown;

    service.create({ params: { item: { name: 'test update' } } }).subscribe({
      next: () => (expected = 'next'),
      error: (error: unknown) => (expectedError = error),
    });

    flush();

    let expectedErrorFromError: unknown;
    service.error({ params: { item: { name: 'test update' } } }).subscribe((value) => (expectedErrorFromError = value));

    flush();

    expect(expected!).toBeUndefined();
    expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
    expect(expectedError!).toEqual(expectedErrorFromError!);
  }));

  it('update success', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    spyOn(http, 'update').and.returnValue(of({ item: { id: '1', name: 'after update' } }));

    let expected: { item: FeatureStoreType };
    service.update({ params: { item: { id: '1', name: 'test update' } } }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ item: { id: '1', name: 'after update' } });
  }));

  it('update error', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    spyOn(http, 'update').and.returnValue(
      of({ item: { id: '1', name: 'first' } }).pipe(
        map(() => {
          throw new HttpErrorResponse({ error: 'error message' });
        }),
      ),
    );

    let expected: unknown;
    let expectedError: unknown;

    service.update({ params: { item: { id: '1', name: 'test update' } } }).subscribe({
      next: () => (expected = 'next'),
      error: (error: unknown) => (expectedError = error),
    });

    let expectedErrorFromError: unknown;
    service
      .error({ params: { item: { id: '1', name: 'test update' } } })
      .subscribe((value) => (expectedErrorFromError = value));

    flush();

    expect(expected).toBeUndefined();
    expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
    expect(expectedError!).toEqual(expectedErrorFromError!);
  }));

  it('update all success', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1', '2'],
        entities: {
          '1': { id: '1', name: 'first' },
          '2': { id: '2', name: 'second' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    spyOn(http, 'updateAll').and.returnValue(
      of({
        items: [
          { id: '1', name: 'first item test update all' },
          { id: '2', name: 'second item test update all' },
        ],
      }),
    );

    let expected: { items: FeatureStoreType[] };
    service
      .updateAll({
        params: {
          items: [
            { id: '1', name: 'first item test update all' },
            { id: '2', name: 'second item test update all' },
          ],
        },
      })
      .subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({
      items: [
        { id: '1', name: 'first item test update all' },
        { id: '2', name: 'second item test update all' },
      ],
    });
  }));

  it('update all error', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1', '2'],
        entities: {
          '1': { id: '1', name: 'first' },
          '2': { id: '2', name: 'second' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    spyOn(http, 'updateAll').and.returnValues(
      of({
        items: [
          { id: '1', name: 'first' },
          { id: '2', name: 'second' },
        ],
      }).pipe(
        map(() => {
          throw new HttpErrorResponse({ error: 'error message' });
        }),
      ),
    );

    let expected: unknown;
    let expectedError: unknown;

    service
      .updateAll({
        params: {
          items: [
            { id: '1', name: 'first item test update all' },
            { id: '2', name: 'second item test update all' },
          ],
        },
      })
      .subscribe({
        next: () => (expected = 'next'),
        error: (error: unknown) => (expectedError = error),
      });

    let expectedErrorFromError: unknown;
    service
      .error({
        params: {
          items: [
            { id: '1', name: 'first item test update all' },
            { id: '2', name: 'second item test update all' },
          ],
        },
      })
      .subscribe((value) => (expectedErrorFromError = value));

    flush();

    expect(expected).toBeUndefined();
    expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
    expect(expectedError!).toEqual(expectedErrorFromError!);
  }));

  it('delete success', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    spyOn(http, 'delete').and.returnValue(of({ item: { id: '1', name: 'first' } }));

    let expected: boolean | undefined = true;
    service.delete({ params: { item: { id: '1' } } }).subscribe((value) => (expected = value));

    flush();

    let expectedState: State;
    store
      .select(key)
      .pipe(first())
      .subscribe((value) => (expectedState = value));

    expect(expected).toBeUndefined();
    expect(expectedState!).toEqual({
      ids: [],
      entities: {},
      errors: {
        [service.query({ params: { item: { id: '1' } } })]: undefined,
      },
      loadings: {
        [service.query({ params: { item: { id: '1' } } })]: undefined,
      },
      queries: {
        [service.query({ params: { item: { id: '1' } } })]: undefined,
      },
      reloadSelectors,
    });
  }));

  it('delete error', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    spyOn(http, 'delete').and.returnValue(
      of(undefined).pipe(
        map(() => {
          throw new HttpErrorResponse({ error: 'error message' });
        }),
      ),
    );

    let expected: unknown;
    let expectedError: unknown;

    service.delete({ params: { item: { id: '1' } } }).subscribe({
      next: () => (expected = 'next'),
      error: (error: unknown) => (expectedError = error),
    });

    flush();

    let expectedErrorFromError: unknown;
    service.error({ params: { item: { id: '1' } } }).subscribe((value) => (expectedErrorFromError = value));

    flush();

    let expectedState: State;
    store
      .select(key)
      .pipe(first())
      .subscribe((value) => (expectedState = value));

    expect(expected).toBeUndefined();
    expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
    expect(expectedError!).toEqual(expectedErrorFromError!);

    expect(expectedState!).toEqual({
      ids: ['1'],
      entities: {
        '1': { id: '1', name: 'first' },
      },
      errors: {
        [service.query({ params: { item: { id: '1' } } })]: new HttpErrorResponse({ error: 'error message' }),
      },
      loadings: {
        [service.query({ params: { item: { id: '1' } } })]: false,
      },
      queries: {},
      reloadSelectors,
    });
  }));

  it('reload identifier', fakeAsync(() => {
    spyOn(http, 'getByQuery').and.returnValues(
      of({
        items: [{ id: '1', name: 'first' }],
        config: { total: 1 },
      }),
      of({
        items: [
          { id: '1', name: 'first' },
          { id: '2', name: 'second' },
        ],
        config: { total: 2 },
      }),
    );

    let expected: { items: FeatureStoreType[]; total: number };
    service.getByQuery({ params: { limit: 10 } }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({
      items: [{ id: '1', name: 'first' }],
      total: 1,
    });

    spyOn(http, 'create').and.returnValue(of({ item: { id: '2', name: 'second' } }));

    service.create({ params: { item: { name: 'test create' }, age: 10 } }).subscribe();

    flush();

    let expectedState: StateBase<FeatureStoreType>;
    store
      .select(key)
      .pipe(first())
      .subscribe((value) => (expectedState = value));

    expect(expectedState!).toEqual({
      ids: ['1', '2'],
      entities: {
        '1': { id: '1', name: 'first' },
        '2': { id: '2', name: 'second' },
      },
      errors: {
        [service.query({ params: { item: { name: 'test create' }, age: 10 } })]: undefined,
        [service.query({ params: { limit: 10 } })]: undefined,
      },
      loadings: {
        [service.query({ params: { item: { name: 'test create' }, age: 10 } })]: false,
        [service.query({ params: { limit: 10 } })]: false,
      },
      queries: {
        [service.query({ params: { item: { name: 'test create' }, age: 10 } })]: {
          ids: ['2'],
        },
        [service.query({ params: { limit: 10 } })]: {
          ids: ['1', '2'],
          total: 2,
        },
      },
      reloadSelectors: reloadSelectors + 2,
    });
  }));

  it('get full item after the list was loaded', fakeAsync(() => {
    spyOn(http, 'getByQuery').and.returnValue(
      of({
        items: [
          { id: '1', name: 'first' },
          { id: '2', name: 'second' },
          { id: '3', name: 'third' },
        ],
        config: {
          total: 3,
        },
      }),
    );

    let expected: { items: unknown[]; total: number };
    service.getByQuery({ params: {} }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({
      items: [
        { id: '1', name: 'first' },
        { id: '2', name: 'second' },
        { id: '3', name: 'third' },
      ],
      total: 3,
    });

    spyOn(http, 'getById').and.returnValue(of({ item: { id: '1', name: 'first', age: 18 } }));

    type Full = FeatureStoreType & { age: number };
    let expectedFull: { item: Full };

    service
      .getById({ params: { item: { id: '1' } } })
      .pipe(first())
      .subscribe((value) => (expectedFull = value as { item: Full }));

    flush();

    expect(expectedFull!).toEqual({ item: { id: '1', name: 'first', age: 18 } });
  }));

  it('call before', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {
          [service.query({ params: { id: '1' } })]: {
            ids: ['1'],
            total: 1,
          },
        },
        reloadSelectors,
      },
    });

    spyOn(http, 'getByQuery').and.returnValue(
      of({
        items: [
          { id: '2', name: 'User' },
          { id: '3', name: 'Name' },
        ],
        config: {
          total: 2,
        },
        before: {
          name: 'Cristian',
          age: 18,
        },
      }),
    );

    let expected: { items: unknown[]; total: number };
    let user: { name: string; age: number };

    service
      .getByQuery({
        params: {},
        beforeSuccess: (body) => {
          user = body;

          return of(user);
        },
      })
      .subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({
      items: [
        { id: '2', name: 'User' },
        { id: '3', name: 'Name' },
      ],
      total: 2,
    });

    expect(user!).toEqual({ name: 'Cristian', age: 18 });
  }));

  it('set', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    let expected: { items: FeatureStoreType[] };
    service
      .set({
        params: {
          items: [
            { id: '1', name: 'test update' },
            { id: '2', name: 'test update' },
          ],
        },
      })
      .subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({
      items: [
        { id: '1', name: 'test update' },
        { id: '2', name: 'test update' },
      ],
    });
  }));

  it('set with query', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    let expected: { items: FeatureStoreType[] };
    service
      .set({
        params: {
          items: [
            { id: '1', name: 'test update' },
            { id: '2', name: 'test update' },
          ],
          query: { siteId: 10 },
        },
      })
      .subscribe((value) => (expected = value));

    flush();

    let expectedQuery: { items: FeatureStoreType[] };
    service.byQuery({ siteId: 10 }).subscribe((value) => (expectedQuery = value));

    expect(expected!).toEqual({
      items: [
        { id: '1', name: 'test update' },
        { id: '2', name: 'test update' },
      ],
    });

    expect(expectedQuery!).toEqual({
      items: [
        { id: '1', name: 'test update' },
        { id: '2', name: 'test update' },
      ],
    });

    let expectedExactQuery: { items: FeatureStoreType[] };
    service
      .set({
        params: {
          items: [
            { id: '3', name: 'test update' },
            { id: '4', name: 'test update' },
          ],
          query: { siteId: 10 },
        },
        reloadSelectors: true,
      })
      .subscribe((value) => (expectedExactQuery = value));

    flush();

    let expectedQueryExactQuery: { items: FeatureStoreType[] };
    service.byQuery({ siteId: 10 }).subscribe((value) => (expectedQueryExactQuery = value));

    expect(expectedExactQuery!).toEqual({
      items: [
        { id: '3', name: 'test update' },
        { id: '4', name: 'test update' },
      ],
    });

    expect(expectedQueryExactQuery!).toEqual({
      items: [
        { id: '3', name: 'test update' },
        { id: '4', name: 'test update' },
      ],
    });
  }));

  it('by id', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {},
        queries: {},
        reloadSelectors,
      },
    });

    let expected: FeatureStoreType | undefined;

    service.byId('1').subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ id: '1', name: 'first' });
  }));

  it('by query', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1', '2'],
        entities: {
          '1': { id: '1', name: 'first' },
          '2': { id: '2', name: 'second' },
        },
        errors: {},
        loadings: {},
        queries: {
          [service.query({ params: { limit: 100 } })]: { ids: ['1', '2'] },
        },
        reloadSelectors,
      },
    });

    let expected: { items: FeatureStoreType[] };

    service.byQuery({ limit: 100 }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({
      items: [
        { id: '1', name: 'first' },
        { id: '2', name: 'second' },
      ],
    });
  }));

  it('loading', fakeAsync(() => {
    store.dispatch({
      type: 'set',
      payload: {
        ids: ['1'],
        entities: {
          '1': { id: '1', name: 'first' },
        },
        errors: {},
        loadings: {
          [service.query({ params: { limit: 100 } })]: true,
        },
        queries: {},
        reloadSelectors,
      },
    });

    let expected: boolean | undefined;

    service.loading({ limit: 100 }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toBeTrue();
  }));

  it('check queryOne in selector', fakeAsync(() => {
    let expected: undefined | { item: FeatureStoreType };
    store.select(selectors(null).queryOne('undefined')).subscribe((value) => (expected = value));

    flush();

    expect(expected).toEqual(undefined);
  }));

  it('getById error multiple requests', fakeAsync(() => {
    spyOn(http, 'getById').and.returnValues(
      of({ item: { id: '1', name: 'first' } }),
      throwError(() => new HttpErrorResponse({ error: 'Error message' })),
      of({ item: { id: '3', name: 'third' } }),
    );

    let expected1: unknown;
    let expected2: unknown;
    let expected3: unknown;

    zip(
      service.getById({ params: { item: { id: '1' } } }),
      service
        .getById({ params: { item: { id: '2' } } })
        .pipe(catchError(({ error }: { error: string }) => of(new HttpErrorResponse({ error })))),
      service.getById({ params: { item: { id: '3' } } }),
    ).subscribe(([result1, result2, result3]) => {
      expected1 = result1;
      expected2 = result2;
      expected3 = result3;
    });

    flush();

    expect(expected1!).toEqual({ item: { id: '1', name: 'first' } });
    expect(expected2!).toEqual(new HttpErrorResponse({ error: 'Error message' }));
    expect(expected3!).toEqual({ item: { id: '3', name: 'third' } });
  }));

  it('check paralel dispaches', fakeAsync(() => {
    spyOn(http, 'getById').and.returnValues(
      of({ item: { id: '1', name: 'first' } }).pipe(delay(300)),
      throwError(() => new HttpErrorResponse({ error: 'Error message' })).pipe(delay(200)),
      of({ item: { id: '3', name: 'third' } }).pipe(delay(100)),
    );

    let expected1: unknown;
    let expected2: unknown;
    let expected3: unknown;

    zip(
      service.getById({ params: { item: { id: '1' } } }),
      service
        .getById({ params: { item: { id: '2' } } })
        .pipe(catchError(({ error }: { error: string }) => of(new HttpErrorResponse({ error })))),
      service.getById({ params: { item: { id: '3' } } }),
    ).subscribe(([result1, result2, result3]) => {
      expected1 = result1;
      expected2 = result2;
      expected3 = result3;
    });

    tick(300);
    flush();

    let expectedState: State;
    store
      .select(key)
      .pipe(first())
      .subscribe((value) => (expectedState = value));

    flush();

    expect(expected1!).toEqual({ item: { id: '1', name: 'first' } });
    expect(expected2!).toEqual(new HttpErrorResponse({ error: 'Error message' }));
    expect(expected3!).toEqual({ item: { id: '3', name: 'third' } });
    expect(expectedState!).toEqual({
      ids: ['3', '1'],
      entities: {
        '1': {
          id: '1',
          name: 'first',
        },
        '3': {
          id: '3',
          name: 'third',
        },
      },
      errors: {
        [service.query({ params: { item: { id: '1' } } })]: undefined,
        [service.query({ params: { item: { id: '2' } } })]: new HttpErrorResponse({ error: 'Error message' }),
        [service.query({ params: { item: { id: '3' } } })]: undefined,
      },
      loadings: {
        [service.query({ params: { item: { id: '1' } } })]: false,
        [service.query({ params: { item: { id: '2' } } })]: false,
        [service.query({ params: { item: { id: '3' } } })]: false,
      },
      queries: {
        [service.query({ params: { item: { id: '1' } } })]: {
          ids: ['1'],
        },
        [service.query({ params: { item: { id: '3' } } })]: {
          ids: ['3'],
        },
      },
      reloadSelectors,
    });
  }));

  describe('Store with select id', () => {
    const selectId = ({ id, name }: FeatureStoreType) => `${id}-${name}`;

    beforeEach(() => {
      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({ [key]: reducer(selectId) }),
          EffectsModule.forRoot([Effects]),
          StoreDevtoolsModule.instrument({ maxAge: 100, name: 'Orbility back office' }),
        ],
        teardown: {
          destroyAfterEach: false,
        },
        providers: [
          {
            provide: SELECT_ID_TOKEN,
            useValue: selectId,
          },
        ],
      });

      service = TestBed.inject(StoreService);
      http = TestBed.inject(HttpService);
      store = TestBed.inject(Store) as Store<{ [key]: StateBase<FeatureStoreType> }>;

      store.dispatch({ type: 'reset' });
    });

    it('getByQuery success', fakeAsync(() => {
      spyOn(http, 'getByQuery').and.returnValue(of({ items: [{ id: '1', name: 'first' }], config: { total: 1 } }));

      let expected: { items: unknown[]; total: number };
      service.getByQuery({ params: {} }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({ items: [{ id: '1', name: 'first' }], total: 1 });
    }));

    it('getByQuery is loaded', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {
            [service.query({ params: {} })]: {
              ids: [selectId({ id: '1', name: 'first' })],
              total: 1,
            },
          },
          reloadSelectors,
        },
      });

      let expected: { items: unknown[]; total: number };

      service.getByQuery({ params: {} }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({ items: [{ id: '1', name: 'first' }], total: 1 });
    }));

    it('getByQuery error', fakeAsync(() => {
      spyOn(http, 'getByQuery').and.returnValue(
        of({ items: [{ id: '1', name: 'first' }], total: 1 }).pipe(
          map(() => {
            throw new HttpErrorResponse({ error: 'error message' });
          }),
        ),
      );

      let expected: unknown;
      let expectedError: unknown;

      service.getByQuery({ params: {} }).subscribe({
        next: () => (expected = 'next'),
        error: (error: unknown) => (expectedError = error),
      });

      let expectedErrorFromError: unknown;
      service.error({ params: {} }).subscribe((value) => (expectedErrorFromError = value));

      flush();

      expect(expected).toBeUndefined();
      expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
      expect(expectedError!).toEqual(expectedErrorFromError!);
    }));

    it('getById success', fakeAsync(() => {
      spyOn(http, 'getById').and.returnValue(of({ item: { id: '1', name: 'first' } }));

      let expected: { item: FeatureStoreType };
      service
        .getById({ params: { item: { id: '1' } } })
        .pipe(first())
        .subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({ item: { id: '1', name: 'first' } });
    }));

    it('getById is loaded', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {
            [service.query({ params: { item: { id: '1' } } })]: {
              ids: [selectId({ id: '1', name: 'first' })],
            },
          },
          reloadSelectors,
        },
      });

      flush();

      let expected: { item: FeatureStoreType };

      service.getById({ params: { item: { id: '1' } } }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({ item: { id: '1', name: 'first' } });
    }));

    it('getById error', fakeAsync(() => {
      spyOn(http, 'getById').and.returnValue(
        of({ item: { id: '1', name: 'first' } }).pipe(
          map(() => {
            throw new HttpErrorResponse({ error: 'error message' });
          }),
        ),
      );

      let expected: unknown;
      let expectedError: unknown;

      service.getById({ params: { item: { id: '1' } } }).subscribe({
        next: () => (expected = 'next'),
        error: (error: unknown) => (expectedError = error),
      });

      let expectedErrorFromError: unknown;
      service.error({ params: { item: { id: '1' } } }).subscribe((value) => (expectedErrorFromError = value));

      flush();

      expect(expected).toBeUndefined();
      expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
      expect(expectedError!).toEqual(expectedErrorFromError!);
    }));

    it('create success', fakeAsync(() => {
      spyOn(http, 'create').and.returnValue(of({ item: { id: '1', name: 'created' } }));

      let expected: { item: FeatureStoreType };
      service
        .create({ params: { item: { name: 'test create' } }, first: true })
        .subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({ item: { id: '1', name: 'created' } });
    }));

    it('create success (skip reset)', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {
            [service.query({ params: { item: { name: 'first' } } })]: { ids: [selectId({ id: '1', name: 'first' })] },
          },
          reloadSelectors,
        },
      });

      spyOn(http, 'create').and.returnValue(of({ item: { id: '2', name: 'created' } }));

      let expected: { item: FeatureStoreType };
      service
        .create({ params: { item: { name: 'created' } }, resetQueries: false, first: true })
        .subscribe((value) => (expected = value));

      flush();

      let expectedState: State;
      store
        .select(key)
        .pipe(first())
        .subscribe((value) => (expectedState = value));

      expect(expected!).toEqual({ item: { id: '2', name: 'created' } });

      expect(expectedState!).toEqual({
        ids: [selectId({ id: '1', name: 'first' }), selectId({ id: '2', name: 'created' })],
        entities: {
          [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          [selectId({ id: '2', name: 'created' })]: { id: '2', name: 'created' },
        },
        errors: {
          [service.query({ params: { item: { name: 'created' } } })]: undefined,
        },
        loadings: {
          [service.query({ params: { item: { name: 'created' } } })]: false,
        },
        queries: {
          [service.query({ params: { item: { name: 'first' } } })]: { ids: [selectId({ id: '1', name: 'first' })] },
          [service.query({ params: { item: { name: 'created' } } })]: { ids: [selectId({ id: '2', name: 'created' })] },
        },
        reloadSelectors,
      });
    }));

    it('create error', fakeAsync(() => {
      spyOn(http, 'create').and.returnValue(
        of({ item: { id: '1', name: 'first' } }).pipe(
          map(() => {
            throw new HttpErrorResponse({ error: 'error message' });
          }),
        ),
      );

      let expected: unknown;
      let expectedError: unknown;

      service.create({ params: { item: { name: 'test update' } } }).subscribe({
        next: () => (expected = 'next'),
        error: (error: unknown) => (expectedError = error),
      });

      flush();

      let expectedErrorFromError: unknown;
      service
        .error({ params: { item: { name: 'test update' } } })
        .subscribe((value) => (expectedErrorFromError = value));

      flush();

      expect(expected!).toBeUndefined();
      expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
      expect(expectedError!).toEqual(expectedErrorFromError!);
    }));

    it('update success', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first', age: 18 },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      spyOn(http, 'update').and.returnValue(of({ item: { id: '1', name: 'first', age: 30 } }));

      let expected: { item: FeatureStoreType };

      service
        .update({ params: { item: { id: '1', name: 'first', age: 30 } } })
        .subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({ item: { id: '1', name: 'first', age: 30 } });
    }));

    it('update error', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      spyOn(http, 'update').and.returnValue(
        of({ item: { id: '1', name: 'first' } }).pipe(
          map(() => {
            throw new HttpErrorResponse({ error: 'error message' });
          }),
        ),
      );

      let expected: unknown;
      let expectedError: unknown;

      service.update({ params: { item: { id: '1', name: 'test update' } } }).subscribe({
        next: () => (expected = 'next'),
        error: (error: unknown) => (expectedError = error),
      });

      let expectedErrorFromError: unknown;
      service
        .error({ params: { item: { id: '1', name: 'test update' } } })
        .subscribe((value) => (expectedErrorFromError = value));

      flush();

      expect(expected).toBeUndefined();
      expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
      expect(expectedError!).toEqual(expectedErrorFromError!);
    }));

    it('update all success', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [
            selectId({ id: '2', name: 'second' }),
            selectId({ id: '1', name: 'third' }),
            selectId({ id: '1', name: 'first' }),
          ],
          entities: {
            [selectId({ id: '2', name: 'second' })]: { id: '2', name: 'second', age: 13 },
            [selectId({ id: '1', name: 'third' })]: { id: '1', name: 'third', age: 13 },
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first', age: 12 },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      spyOn(http, 'updateAll').and.returnValue(
        of({
          items: [
            { id: '1', name: 'first', age: 20 },
            { id: '2', name: 'second', age: 24 },
            { id: '1', name: 'third', age: 70 },
          ],
        }),
      );

      let expected: { items: FeatureStoreType[] };
      service
        .updateAll({
          params: {
            items: [
              { id: '1', name: 'first', age: 20 },
              { id: '2', name: 'second', age: 24 },
              { id: '1', name: 'third', age: 70 },
            ],
          },
        })
        .subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({
        items: [
          { id: '1', name: 'first', age: 20 },
          { id: '2', name: 'second', age: 24 },
          { id: '1', name: 'third', age: 70 },
        ],
      });
    }));

    it('update all error', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' }), selectId({ id: '2', name: 'second' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
            [selectId({ id: '2', name: 'second' })]: { id: '2', name: 'second' },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      spyOn(http, 'updateAll').and.returnValues(
        of({
          items: [
            { id: '1', name: 'first' },
            { id: '2', name: 'second' },
          ],
        }).pipe(
          map(() => {
            throw new HttpErrorResponse({ error: 'error message' });
          }),
        ),
      );

      let expected: unknown;
      let expectedError: unknown;

      service
        .updateAll({
          params: {
            items: [
              { id: '1', name: 'first item test update all' },
              { id: '2', name: 'second item test update all' },
            ],
          },
        })
        .subscribe({
          next: () => (expected = 'next'),
          error: (error: unknown) => (expectedError = error),
        });

      let expectedErrorFromError: unknown;
      service
        .error({
          params: {
            items: [
              { id: '1', name: 'first item test update all' },
              { id: '2', name: 'second item test update all' },
            ],
          },
        })
        .subscribe((value) => (expectedErrorFromError = value));

      flush();

      expect(expected).toBeUndefined();
      expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
      expect(expectedError!).toEqual(expectedErrorFromError!);
    }));

    it('delete success', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      spyOn(http, 'delete').and.returnValue(of({ item: { id: '1', name: 'first' } }));

      let expected: boolean | undefined = true;
      service.delete({ params: { item: { id: '1', name: 'first' } } }).subscribe((value) => (expected = value));

      flush();

      let expectedState: State;
      store
        .select(key)
        .pipe(first())
        .subscribe((value) => {
          return (expectedState = value);
        });

      expect(expected).toBeUndefined();
      expect(expectedState!).toEqual({
        ids: [],
        entities: {},
        errors: {
          [service.query({ params: { item: { id: '1', name: 'first' } } })]: undefined,
        },
        loadings: {
          [service.query({ params: { item: { id: '1', name: 'first' } } })]: undefined,
        },
        queries: {
          [service.query({ params: { item: { id: '1', name: 'first' } } })]: undefined,
        },
        reloadSelectors,
      });
    }));

    it('delete error', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      spyOn(http, 'delete').and.returnValue(
        of(undefined).pipe(
          map(() => {
            throw new HttpErrorResponse({ error: 'error message' });
          }),
        ),
      );

      let expected: unknown;
      let expectedError: unknown;

      service.delete({ params: { item: { id: '1' } } }).subscribe({
        next: () => (expected = 'next'),
        error: (error: unknown) => (expectedError = error),
      });

      flush();

      let expectedErrorFromError: unknown;
      service.error({ params: { item: { id: '1' } } }).subscribe((value) => (expectedErrorFromError = value));

      flush();

      let expectedState: State;
      store
        .select(key)
        .pipe(first())
        .subscribe((value) => (expectedState = value));

      expect(expected).toBeUndefined();
      expect(expectedError!).toEqual(new HttpErrorResponse({ error: 'error message' }));
      expect(expectedError!).toEqual(expectedErrorFromError!);

      expect(expectedState!).toEqual({
        ids: [selectId({ id: '1', name: 'first' })],
        entities: {
          [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
        },
        errors: {
          [service.query({ params: { item: { id: '1' } } })]: new HttpErrorResponse({ error: 'error message' }),
        },
        loadings: {
          [service.query({ params: { item: { id: '1' } } })]: false,
        },
        queries: {},
        reloadSelectors,
      });
    }));

    it('reload identifier', fakeAsync(() => {
      spyOn(http, 'getByQuery').and.returnValues(
        of({
          items: [{ id: '1', name: 'first' }],
          config: { total: 1 },
        }),
        of({
          items: [
            { id: '1', name: 'first' },
            { id: '2', name: 'second' },
          ],
          config: { total: 2 },
        }),
      );

      let expected: { items: FeatureStoreType[]; total: number };
      service.getByQuery({ params: { limit: 10 } }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({
        items: [{ id: '1', name: 'first' }],
        total: 1,
      });

      spyOn(http, 'create').and.returnValue(of({ item: { id: '2', name: 'second' } }));

      service.create({ params: { item: { name: 'test create' }, age: 10 } }).subscribe();

      flush();

      let expectedState: StateBase<FeatureStoreType>;
      store
        .select(key)
        .pipe(first())
        .subscribe((value) => (expectedState = value));

      expect(expectedState!).toEqual({
        ids: [selectId({ id: '1', name: 'first' }), selectId({ id: '2', name: 'second' })],
        entities: {
          [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          [selectId({ id: '2', name: 'second' })]: { id: '2', name: 'second' },
        },
        errors: {
          [service.query({ params: { item: { name: 'test create' }, age: 10 } })]: undefined,
          [service.query({ params: { limit: 10 } })]: undefined,
        },
        loadings: {
          [service.query({ params: { item: { name: 'test create' }, age: 10 } })]: false,
          [service.query({ params: { limit: 10 } })]: false,
        },
        queries: {
          [service.query({ params: { item: { name: 'test create' }, age: 10 } })]: {
            ids: [selectId({ id: '2', name: 'second' })],
          },
          [service.query({ params: { limit: 10 } })]: {
            ids: [selectId({ id: '1', name: 'first' }), selectId({ id: '2', name: 'second' })],
            total: 2,
          },
        },
        reloadSelectors: reloadSelectors + 2,
      });
    }));

    it('get full item after the list was loaded', fakeAsync(() => {
      spyOn(http, 'getByQuery').and.returnValue(
        of({
          items: [
            { id: '1', name: 'first' },
            { id: '2', name: 'second' },
            { id: '3', name: 'third' },
          ],
          config: {
            total: 3,
          },
        }),
      );

      let expected: { items: unknown[]; total: number };
      service.getByQuery({ params: {} }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({
        items: [
          { id: '1', name: 'first' },
          { id: '2', name: 'second' },
          { id: '3', name: 'third' },
        ],
        total: 3,
      });

      spyOn(http, 'getById').and.returnValue(of({ item: { id: '1', name: 'first', age: 18 } }));

      type Full = FeatureStoreType & { age: number };
      let expectedFull: { item: Full };

      service
        .getById({ params: { item: { id: '1' } } })
        .pipe(first())
        .subscribe((value) => (expectedFull = value as { item: Full }));

      flush();

      expect(expectedFull!).toEqual({ item: { id: '1', name: 'first', age: 18 } });
    }));

    it('call before', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {
            [service.query({ params: { id: '1' } })]: {
              ids: [selectId({ id: '1', name: 'first' })],
              total: 1,
            },
          },
          reloadSelectors,
        },
      });

      spyOn(http, 'getByQuery').and.returnValue(
        of({
          items: [
            { id: '2', name: 'User' },
            { id: '3', name: 'Name' },
          ],
          config: {
            total: 2,
          },
          before: {
            name: 'Cristian',
            age: 18,
          },
        }),
      );

      let expected: { items: unknown[]; total: number };
      let user: { name: string; age: number };

      service
        .getByQuery({
          params: {},
          beforeSuccess: (body) => {
            user = body;

            return of(user);
          },
        })
        .subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({
        items: [
          { id: '2', name: 'User' },
          { id: '3', name: 'Name' },
        ],
        total: 2,
      });

      expect(user!).toEqual({ name: 'Cristian', age: 18 });
    }));

    it('set', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      let expected: { items: FeatureStoreType[] };
      service
        .set({
          params: {
            items: [
              { id: '1', name: 'test update' },
              { id: '2', name: 'test update' },
            ],
          },
        })
        .subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({
        items: [
          { id: '1', name: 'test update' },
          { id: '2', name: 'test update' },
        ],
      });
    }));

    it('by id', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {},
          queries: {},
          reloadSelectors,
        },
      });

      let expected: FeatureStoreType | undefined;

      service.byId({ id: '1', name: 'first' }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({ id: '1', name: 'first' });
    }));

    it('by query', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' }), selectId({ id: '2', name: 'second' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
            [selectId({ id: '1', name: 'second' })]: { id: '2', name: 'second' },
          },
          errors: {},
          loadings: {},
          queries: {
            [service.query({ params: { limit: 100 } })]: {
              ids: [selectId({ id: '1', name: 'first' }), selectId({ id: '1', name: 'second' })],
            },
          },
          reloadSelectors,
        },
      });

      let expected: { items: FeatureStoreType[] };

      service.byQuery({ limit: 100 }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toEqual({
        items: [
          { id: '1', name: 'first' },
          { id: '2', name: 'second' },
        ],
      });
    }));

    it('loading', fakeAsync(() => {
      store.dispatch({
        type: 'set',
        payload: {
          ids: [selectId({ id: '1', name: 'first' })],
          entities: {
            [selectId({ id: '1', name: 'first' })]: { id: '1', name: 'first' },
          },
          errors: {},
          loadings: {
            [service.query({ params: { limit: 100 } })]: true,
          },
          queries: {},
          reloadSelectors,
        },
      });

      let expected: boolean | undefined;

      service.loading({ limit: 100 }).subscribe((value) => (expected = value));

      flush();

      expect(expected!).toBeTrue();
    }));
  });
});
