import { ResizeDirective } from './resize.directive';

class TestResizeDirective extends ResizeDirective {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override _onMouseMove(_e: MouseEvent): void {
    throw new Error('Method not implemented.');
  }
  // Need to implement abstract members
}

describe('ResizeDirective', () => {
  it('should create an instance', () => {
    const directive = new TestResizeDirective();
    expect(directive).toBeTruthy();
  });
});
