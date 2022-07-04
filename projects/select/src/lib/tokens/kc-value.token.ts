import { InjectionToken } from '@angular/core';

import { KcOptionGroupValue, KcOptionValue } from '../types';

export const KC_VALUE = new InjectionToken<KcOptionValue<unknown> | KcOptionGroupValue<unknown>>('KC_VALUE');
