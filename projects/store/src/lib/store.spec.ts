import { Injectable } from '@angular/core';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Observable, first, map, of } from 'rxjs';

import { AtLeastDeep } from '@k5cjs/types';
import { EffectsModule } from '@ngrx/effects';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, Store, StoreModule, createAction, createReducer, on, props } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ActionsBase } from './store.actions';
import { EffectsBase } from './store.effects';
import { HttpServiceBase } from './store.http.service';
import { reducerBase, stateBase } from './store.reducer';
import { SelectorsBase } from './store.selectors';
import { StoreServiceBase } from './store.service';
import { ActionInit, HttpParams, Options, Params, StateBase } from './store.type';

const key = 'store';

interface FeatureStoreType {
  id: string;
  name: string;
}

class Actions extends ActionsBase<FeatureStoreType> {}

const actions = new Actions(key);

type State = StateBase<FeatureStoreType>;

const adapter: EntityAdapter<FeatureStoreType> = createEntityAdapter<FeatureStoreType>();

const initialState: State = adapter.getInitialState({
  ...stateBase(),
});

let reloadSelectors = 0;

function reducer(state: State | undefined, action: Action): State {
  return createReducer(
    initialState,

    ...reducerBase(adapter, actions),

    on(createAction('set', props<{ payload: State }>()), (_, { payload }) => payload),

    on(createAction('reset'), (state) => {
      reloadSelectors += 10;

      return { ...state, reloadSelectors };
    }),
  )(state, action);
}

class Selectors extends SelectorsBase<FeatureStoreType> {}

const selectors = new Selectors(key, adapter);

@Injectable({ providedIn: 'root' })
class HttpService extends HttpServiceBase<FeatureStoreType> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getByQuery(_options: ActionInit<HttpParams>): Observable<{ items: FeatureStoreType[] }> {
    return of({ items: [], total: 0 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById(_options: ActionInit<{ item: Pick<FeatureStoreType, 'id'> }>): Observable<{ item: FeatureStoreType }> {
    throw new Error('Method not implemented.');
  }

  delete(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: ActionInit<{ item: Pick<FeatureStoreType, 'id'> }>,
  ): Observable<{ item: Pick<FeatureStoreType, 'id'> }> {
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
}

@Injectable()
class Effects extends EffectsBase<FeatureStoreType> {
  constructor(http: HttpService) {
    super(actions, selectors, http);
  }
}

@Injectable({ providedIn: 'root' })
class StoreService extends StoreServiceBase<FeatureStoreType> {
  constructor() {
    super(actions, selectors);
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
  let store: Store<{ [key]: StateBase<FeatureStoreType> }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ [key]: reducer }),
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
          throw { message: 'error message' };
        }),
      ),
    );

    let expected: { items: unknown[]; total: number };
    service.getByQuery({ params: {} }).subscribe((value) => (expected = value));

    let expectedError: unknown;
    service.error({ params: {} }).subscribe((value) => (expectedError = value));

    flush();

    expect(expected!).toBeUndefined();
    expect(expectedError!).toEqual('error message');
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
          throw { message: 'error message' };
        }),
      ),
    );

    let expected: { item: FeatureStoreType };
    service.getById({ params: { item: { id: '1' } } }).subscribe((value) => (expected = value));

    let expectedError: unknown;
    service.error({ params: { item: { id: '1' } } }).subscribe((value) => (expectedError = value));

    flush();

    expect(expected!).toBeUndefined();
    expect(expectedError!).toEqual('error message');
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
          throw { message: 'error message' };
        }),
      ),
    );

    let expected: { item: FeatureStoreType };
    service.create({ params: { item: { name: 'test update' } } }).subscribe((value) => (expected = value));

    flush();

    let expectedError: unknown;
    service.error({ params: { item: { name: 'test update' } } }).subscribe((value) => (expectedError = value));

    flush();

    expect(expected!).toBeUndefined();
    expect(expectedError!).toEqual('error message');
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
          throw { message: 'error message' };
        }),
      ),
    );

    let expected: { item: FeatureStoreType };
    service.update({ params: { item: { id: '1', name: 'test update' } } }).subscribe((value) => (expected = value));

    let expectedError: unknown;
    service.error({ params: { item: { id: '1', name: 'test update' } } }).subscribe((value) => (expectedError = value));

    flush();

    expect(expected!).toBeUndefined();
    expect(expectedError!).toEqual('error message');
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

    spyOn(http, 'delete').and.returnValue(of({ item: { id: '1' } }));

    let expected: boolean;
    service.delete({ params: { item: { id: '1' } } }).subscribe((value) => (expected = value));

    flush();

    let expectedState: State;
    store
      .select(key)
      .pipe(first())
      .subscribe((value) => (expectedState = value));

    expect(expected!).toBeTrue();
    expect(expectedState!).toEqual({
      ids: [],
      entities: {},
      errors: {
        [service.query({ params: { item: { id: '1' } } })]: undefined,
      },
      loadings: {
        [service.query({ params: { item: { id: '1' } } })]: false,
      },
      queries: {
        [service.query({ params: { item: { id: '1' } } })]: { ids: [] },
      },
      reloadSelectors: reloadSelectors + 1,
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
          throw { message: 'error message' };
        }),
      ),
    );

    let expected: boolean;
    service.delete({ params: { item: { id: '1' } } }).subscribe((value) => (expected = value));

    flush();

    let expectedError: unknown;
    service.error({ params: { item: { id: '1' } } }).subscribe((value) => (expectedError = value));

    flush();

    let expectedState: State;
    store
      .select(key)
      .pipe(first())
      .subscribe((value) => (expectedState = value));

    expect(expected!).toBeFalse();
    expect(expectedError!).toEqual('error message');
    expect(expectedState!).toEqual({
      ids: ['1'],
      entities: {
        '1': { id: '1', name: 'first' },
      },
      errors: {
        [service.query({ params: { item: { id: '1' } } })]: 'error message',
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
});
