import { EntityAdapter, EntityState } from '@ngrx/entity';
import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
  createSelectorFactory,
  defaultMemoize,
} from '@ngrx/store';

import { StateBase } from './store.type';

export const isEqualCheck = <T extends { id: PropertyKey }>(a: StateBase<T>, b: StateBase<T>) => {
  return a.reloadSelectors === b.reloadSelectors;
};

export const createSelectorFirstMemoized = createSelectorFactory((memoize) =>
  defaultMemoize(memoize, isEqualCheck),
) as typeof createSelector;

export class SelectorsBase<T extends { id: PropertyKey }> {
  all: MemoizedSelector<object, T[], (s1: StateBase<T>) => T[]>;

  entities: MemoizedSelector<
    object,
    Record<T['id'], T | undefined>,
    (s1: StateBase<T>) => Record<T['id'], T | undefined>
  >;

  entity: (
    id: T['id'],
  ) => MemoizedSelector<object, T | undefined, (s1: Record<T['id'], T | undefined>) => T | undefined>;

  queries: MemoizedSelector<
    object,
    Record<PropertyKey, { ids: T['id'][] & object } | undefined>,
    (s1: StateBase<T>) => Record<PropertyKey, { ids: T['id'][] & object } | undefined>
  >;

  errors: MemoizedSelector<
    object,
    Record<PropertyKey, string | undefined>,
    (s1: StateBase<T>) => Record<PropertyKey, string | undefined>
  >;

  loadings: MemoizedSelector<
    object,
    Record<PropertyKey, boolean | undefined>,
    (s1: StateBase<T>) => Record<PropertyKey, boolean | undefined>
  >;

  error: (
    query: string,
  ) => MemoizedSelector<
    object,
    string | undefined,
    (s1: Record<PropertyKey, string | undefined>) => string | undefined
  >;

  loading: (
    query: string,
  ) => MemoizedSelector<
    object,
    boolean | undefined,
    (s1: Record<PropertyKey, boolean | undefined>) => boolean | undefined
  >;

  query: (
    query: string,
  ) => MemoizedSelector<
    object,
    { ids: T['id'][] & object } | undefined,
    (s1: Record<PropertyKey, { ids: T['id'][] & object } | undefined>) => { ids: T['id'][] & object } | undefined
  >;

  queryAll: (query: string) => MemoizedSelector<
    object,
    { items: T[] } | undefined,
    (
      //
      s1: { ids: T['id'][] & object },
      s2: Record<T['id'], T | undefined>,
    ) => { items: T[] } | undefined
  >;

  queryOne: (query: string) => MemoizedSelector<
    object,
    { item: T } | undefined,
    (
      //
      s1: { ids: T['id'][] & object },
      s2: Record<T['id'], T | undefined>,
    ) => { item: T } | undefined
  >;

  constructor(key: string, adapter: EntityAdapter<T>) {
    const stateSelector = createFeatureSelector<StateBase<T>>(key);

    const { selectEntities, selectAll } = adapter.getSelectors();

    this.all = createSelector(stateSelector, selectAll);
    this.entities = createSelector(
      stateSelector,
      selectEntities as (state: EntityState<T>) => Record<T['id'], T | undefined>,
    );
    this.entity = (id: T['id']) => createSelector(this.entities, (entities) => entities?.[id]);
    this.queries = createSelector(stateSelector, (state) => state.queries);
    this.errors = createSelector(stateSelector, (state) => state.errors);
    this.loadings = createSelector(stateSelector, (state) => state.loadings);

    this.error = (queryId: string) => createSelector(this.errors, (queries) => queries[queryId]);
    this.loading = (queryId: string) => createSelector(this.loadings, (queries) => queries[queryId]);

    this.query = (queryId: string) => createSelector(this.queries, (queries) => queries[queryId]);

    const entitiesFirstMemoized = createSelectorFirstMemoized(
      stateSelector,
      (state) => state.entities as Record<T['id'], T | undefined>,
    );

    this.queryAll = (queryId: string) =>
      createSelector(this.query(queryId), entitiesFirstMemoized, (query, entities) => {
        if (!query) return undefined;

        const { ids, ...rest } = query;

        return {
          ...rest,
          items: ids.map((id) => entities[id]).filter((item): item is T => !!item),
        };
      });

    this.queryOne = (queryId: string) =>
      createSelector(this.query(queryId), this.entities, (query, entities) => {
        if (!query) return undefined;

        const {
          ids: [id],
          ...rest
        } = query;

        return {
          ...rest,
          item: entities[id]!,
        };
      });
  }
}
