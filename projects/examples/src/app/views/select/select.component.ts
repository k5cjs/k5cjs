import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  links: { link: string; label: string }[];

  constructor() {
    this.links = [
      { link: 'simple-multiple', label: 'Simple Multiple' },
      { link: 'simple-multiple-select-all', label: 'Simple Multiple Select All' },
      { link: 'simple-multiple-deselect-all', label: 'Simple Multiple Deselect All' },
      { link: 'simple-multiple-toggle', label: 'Simple Multiple Toggle' },
      { link: 'simple-multiple-submit', label: 'Simple Multiple Submit' },
      { link: 'simple-modal', label: 'Simple Modal' },
      { link: 'simple-search', label: 'Simple Search' },
      { link: 'simple-wrapped', label: 'Simple Wrapped' },
      { link: 'simple-without-form-control', label: 'Simple Without FormControl' },
      { link: 'group-search', label: 'Group Search' },
      { link: 'group-multiple', label: 'Group Multiple' },
      { link: 'group-boolean', label: 'Group Boolean' },
      { link: 'group-boolean-toggle', label: 'Group Boolean Toggle' },
      { link: 'designed', label: 'Designed' },
      { link: 'default-placeholder', label: 'Default Placeholder' },
      { link: 'custom-placeholder', label: 'Custom Placeholder' },
      { link: 'custom-options', label: 'Custom options' },
    ];
  }
}
