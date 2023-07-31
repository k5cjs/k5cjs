import { transition, trigger } from '@angular/animations';

export const blockInitialRender = () => trigger('blockInitialRender', [transition(':enter, :leave', [])]);
