import { Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * @deprecated Use `relativeToByComponent` instead
 */
export const relativeToByComponentName = (route: ActivatedRoute, name: string): ActivatedRoute => {
  if (route.component?.name === name) return route;

  if (!route.parent) return route;

  return relativeToByComponentName(route.parent, name);
};

export const relativeToByComponent = (route: ActivatedRoute, component: Type<unknown>): ActivatedRoute => {
  if (route.component === component) return route;

  if (!route.parent) return route;

  return relativeToByComponent(route.parent, component);
};
