import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-magnification',
  templateUrl: './magnification.component.html',
  styleUrl: './magnification.component.scss',
})
export class MagnificationComponent {
  @Input({ required: true }) scale!: FormControl<number>;

  zoomOut(): void {
    if (this.scale.value <= 0.1) return;

    const value = Number((this.scale.value - 0.1).toFixed(2));

    this.scale.setValue(value);
  }

  zoomIn(): void {
    if (this.scale.value >= 1.5) return;

    const value = Number((this.scale.value + 0.1).toFixed(2));

    this.scale.setValue(value);
  }

  reset(): void {
    this.scale.setValue(1);
  }
}
