import { InjectionToken } from '@angular/core';

import { MapEmit } from '@k5cjs/selection-model';

export const KC_SELECTION = new InjectionToken<MapEmit<unknown, unknown>>('KC_SELECTION');
