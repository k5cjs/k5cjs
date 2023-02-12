import { InjectionToken } from '@angular/core';

import { MapEmitSelect } from '../helpers';

export const KC_SELECTION = new InjectionToken<MapEmitSelect<unknown>>('KC_SELECTION');
