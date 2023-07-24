import { InjectionToken } from '@angular/core';

import { KcCalBaseSelector } from '../types';

export const KC_CAL_SELECTOR = new InjectionToken<KcCalBaseSelector<unknown>>('KcCalSelector');
