import { InjectionToken } from '@angular/core';

import { KcOptionGroupValue, KcOptionValue } from '../types';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const KC_VALUE = new InjectionToken<KcOptionValue<unknown> | KcOptionGroupValue<unknown>>('KC_VALUE');
