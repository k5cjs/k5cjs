import { KcControl } from './control';

class Test extends KcControl {}

describe('InputDirective', () => {
  it('should create an instance', () => {
    const directive = new Test();
    void expect(directive).toBeTruthy();
  });
});
