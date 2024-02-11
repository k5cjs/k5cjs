import { HttpErrorResponse } from '@angular/common/http';

import { EntityAdapter, EntityState, IdSelector } from '@ngrx/entity';
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

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
export const createSelectorFirstMemoized = createSelectorFactory((memoize) =>
  defaultMemoize(memoize, isEqualCheck),
) as typeof createSelector;

export class SelectorsBase<T extends { id: PropertyKey }> {
  all: MemoizedSelector<object, T[], (s1: StateBase<T>) => T[]>;

  entities: MemoizedSelector<
    object,
    Record<ReturnType<IdSelector<T>>, T | undefined>,
    (s1: StateBase<T>) => Record<ReturnType<IdSelector<T>>, T | undefined>
  >;

  entity: (
    item: Partial<T>,
  ) => MemoizedSelector<object, T | undefined, (s1: Record<ReturnType<IdSelector<T>>, T | undefined>) => T | undefined>;

  queries: MemoizedSelector<
    object,
    Record<PropertyKey, { ids: ReturnType<IdSelector<T>>[] & object } | undefined>,
    (s1: StateBase<T>) => Record<PropertyKey, { ids: ReturnType<IdSelector<T>>[] & object } | undefined>
  >;

  errors: MemoizedSelector<
    object,
    Record<PropertyKey, HttpErrorResponse | undefined>,
    (s1: StateBase<T>) => Record<PropertyKey, HttpErrorResponse | undefined>
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
    HttpErrorResponse | undefined,
    (s1: Record<PropertyKey, HttpErrorResponse | undefined>) => HttpErrorResponse | undefined
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
    { ids: ReturnType<IdSelector<T>>[] & object } | undefined,
    (
      s1: Record<PropertyKey, { ids: ReturnType<IdSelector<T>>[] & object } | undefined>,
    ) => { ids: ReturnType<IdSelector<T>>[] & object } | undefined
  >;

  queryAll: (query: string) => MemoizedSelector<
    object,
    { items: T[] } | undefined,
    (
      //
      s1: { ids: ReturnType<IdSelector<T>>[] & object },
      s2: Record<ReturnType<IdSelector<T>>, T | undefined>,
    ) => { items: T[] } | undefined
  >;

  queryOne: (query: string) => MemoizedSelector<
    object,
    { item: T } | undefined,
    (
      //
      s1: { ids: ReturnType<IdSelector<T>>[] & object },
      s2: Record<ReturnType<IdSelector<T>>, T | undefined>,
    ) => { item: T } | undefined
  >;

  constructor(key: string, adapter: EntityAdapter<T>) {
    const selectState = createFeatureSelector<StateBase<T>>(key);

    const { selectEntities, selectAll } = adapter.getSelectors();

    this.all = createSelector(selectState, selectAll);
    this.entities = createSelector(
      selectState,
      selectEntities as (state: EntityState<T>) => Record<ReturnType<IdSelector<T>>, T | undefined>,
    );
    this.entity = (item: Partial<T>) =>
      createSelector(this.entities, (entities) => entities?.[adapter.selectId(item as T)]);
    this.queries = createSelector(selectState, (state) => state.queries);
    this.errors = createSelector(selectState, (state) => state.errors);
    this.loadings = createSelector(selectState, (state) => state.loadings);

    this.error = (queryId: string) => createSelector(this.errors, (queries) => queries[queryId]);
    this.loading = (queryId: string) => createSelector(this.loadings, (queries) => queries[queryId]);

    this.query = (queryId: string) => createSelector(this.queries, (queries) => queries[queryId]);

    const entitiesFirstMemoized = createSelectorFirstMemoized(selectState, (state) => state.entities);

    this.queryAll = (queryId: string) =>
      createSelector(this.query(queryId), entitiesFirstMemoized, (query, entities) => {
        if (!query) return undefined;

        const { ids, ...rest } = query;

        return {
          ...rest,
          items: ids.map((selectId) => entities[selectId]).filter((item): item is T => !!item),
        };
      });

    this.queryOne = (queryId: string) =>
      createSelector(this.query(queryId), this.entities, (query, entities) => {
        if (!query) return undefined;

        const {
          ids: [selectId],
          ...rest
        } = query;

        return {
          ...rest,
          item: entities[selectId]!,
        };
      });
  }
}
