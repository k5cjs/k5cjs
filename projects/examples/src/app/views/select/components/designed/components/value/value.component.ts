import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-value',
    templateUrl: './value.component.html',
    styleUrls: ['./value.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ValueComponent {}
