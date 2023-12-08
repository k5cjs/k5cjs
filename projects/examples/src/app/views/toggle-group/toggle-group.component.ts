import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-toggle-group',
  templateUrl: './toggle-group.component.html',
  styleUrls: ['./toggle-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleGroupComponent {
  control = new FormControl('a');
  multiple = new FormControl(['a', 'c']);

  options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];
}
