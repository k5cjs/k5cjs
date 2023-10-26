import { Injectable } from '@angular/core';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Observable, first, map, of } from 'rxjs';

import { AtLeastDeep } from '@k5cjs/types';
import { EffectsModule } from '@ngrx/effects';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, Store, StoreModule, createAction, createReducer, on, props } from '@ngrx/store';

import { ActionsBase } from './store.actions';
import { EffectsBase } from './store.effects';
import { HttpServiceBase } from './store.http.service';
import { reducerBase, stateBase } from './store.reducer';
import { SelectorsBase } from './store.selectors';
import { StoreServiceBase } from './store.service';
import { StateBase } from './store.type';

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
  override getByQuery(params: Record<PropertyKey, unknown>): Observable<{ items: FeatureStoreType[] }> {
    return of({ items: [], total: 0 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getById(id: { id: string }): Observable<{ item: FeatureStoreType }> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override delete(id: { id: string }): Observable<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override create(item: Omit<FeatureStoreType, 'id'>): Observable<{ item: FeatureStoreType }> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override update(params: { item: AtLeastDeep<FeatureStoreType, 'id'> }): Observable<{ item: FeatureStoreType }> {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
class Effects extends EffectsBase<FeatureStoreType> {
  constructor(http: HttpService) {
    super(actions, selectors, http);
  }
}

declare module './store.service' {
  export interface StoreServiceBase<T extends { id: PropertyKey }> {
    getByQuery(params: Record<string, string | number | boolean>): Observable<{ items: T[]; total: number }>;
    create(params: Omit<T, 'id'> & { age: number }): Observable<{ item: T }>;
  }
}

@Injectable({ providedIn: 'root' })
class StoreService extends StoreServiceBase<FeatureStoreType> {
  constructor() {
    super(actions, selectors);
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
      imports: [StoreModule.forRoot({ [key]: reducer }), EffectsModule.forRoot([Effects])],
      teardown: {
        destroyAfterEach: true,
      },
    });

    service = TestBed.inject(StoreService);
    http = TestBed.inject(HttpService);
    store = TestBed.inject(Store) as Store<{ [key]: StateBase<FeatureStoreType> }>;

    store.dispatch({ type: 'reset' });
  });

  it('getByQuery success', fakeAsync(() => {
    spyOn(http, 'getByQuery').and.returnValue(of({ items: [{ id: '1', name: 'first' }], total: 1 }));

    let expected: { items: unknown[]; total: number };
    service.getByQuery({}).subscribe((value) => (expected = value));

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
          [service.query({})]: {
            ids: ['1'],
            total: 1,
          },
        },
        reloadSelectors,
      },
    });

    let expected: { items: unknown[]; total: number };

    service.getByQuery({}).subscribe((value) => (expected = value));

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
    service.getByQuery({}).subscribe((value) => (expected = value));

    let expectedError: unknown;
    service.error({}).subscribe((value) => (expectedError = value));

    flush();

    expect(expected!).toBeUndefined();
    expect(expectedError!).toEqual('error message');
  }));

  it('getById success', fakeAsync(() => {
    spyOn(http, 'getById').and.returnValue(of({ item: { id: '1', name: 'first' } }));

    let expected: { item: FeatureStoreType };
    service
      .getById({ id: '1' })
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
          [service.query({ id: '1' })]: {
            ids: ['1'],
          },
        },
        reloadSelectors,
      },
    });

    flush();

    let expected: { item: FeatureStoreType };

    service.getById({ id: '1' }).subscribe((value) => (expected = value));

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
    service.getById({ id: '1' }).subscribe((value) => (expected = value));

    let expectedError: unknown;
    service.error({ id: '1' }).subscribe((value) => (expectedError = value));

    flush();

    expect(expected!).toBeUndefined();
    expect(expectedError!).toEqual('error message');
  }));

  it('create success', fakeAsync(() => {
    spyOn(http, 'create').and.returnValue(of({ item: { id: '1', name: 'created' } }));

    let expected: { item: FeatureStoreType };
    service
      .create({ name: 'test create' })
      .pipe(first())
      .subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({ item: { id: '1', name: 'created' } });
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
    service.create({ name: 'test update' }).subscribe((value) => (expected = value));

    flush();

    let expectedError: unknown;
    service.error({ name: 'test update' }).subscribe((value) => (expectedError = value));

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
    service.update({ id: '1', name: 'test update' }).subscribe((value) => (expected = value));

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
    service.update({ id: '1', name: 'test update' }).subscribe((value) => (expected = value));

    let expectedError: unknown;
    service.error({ id: '1', name: 'test update' }).subscribe((value) => (expectedError = value));

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

    spyOn(http, 'delete').and.returnValue(of(undefined));

    let expected: boolean;
    service.delete({ id: '1' }).subscribe((value) => (expected = value));

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
      errors: {},
      loadings: {},
      queries: {},
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
    service.delete({ id: '1' }).subscribe((value) => (expected = value));

    flush();

    let expectedError: unknown;
    service.error({ id: '1' }).subscribe((value) => (expectedError = value));

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
        [service.query({ id: '1' })]: 'error message',
      },
      loadings: {
        [service.query({ id: '1' })]: false,
      },
      queries: {},
      reloadSelectors,
    });
  }));

  it('reload identifier', fakeAsync(() => {
    spyOn(http, 'getByQuery').and.returnValues(
      of({
        items: [{ id: '1', name: 'first' }],
        total: 1,
      }),
      of({
        items: [
          { id: '1', name: 'first' },
          { id: '2', name: 'second' },
        ],
        total: 2,
      }),
    );

    let expected: { items: FeatureStoreType[]; total: number };
    service.getByQuery({ limit: 10 }).subscribe((value) => (expected = value));

    flush();

    expect(expected!).toEqual({
      items: [{ id: '1', name: 'first' }],
      total: 1,
    });

    spyOn(http, 'create').and.returnValue(of({ item: { id: '2', name: 'second' } }));

    service.create({ name: 'test create', age: 10 }).subscribe();

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
        [service.query({ name: 'test create', age: 10 })]: undefined,
        [service.query({ limit: 10 })]: undefined,
      },
      loadings: {
        [service.query({ name: 'test create', age: 10 })]: false,
        [service.query({ limit: 10 })]: false,
      },
      queries: {
        [service.query({ name: 'test create', age: 10 })]: {
          ids: ['2'],
        },
        [service.query({ limit: 10 })]: {
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
        total: 3,
      }),
    );

    let expected: { items: unknown[]; total: number };
    service.getByQuery({}).subscribe((value) => (expected = value));

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
      .getById({ id: '1' })
      .pipe(first())
      .subscribe((value) => (expectedFull = value as { item: Full }));

    flush();

    expect(expectedFull!).toEqual({ item: { id: '1', name: 'first', age: 18 } });
  }));
});
