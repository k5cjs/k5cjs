import { fakeAsync, tick } from '@angular/core/testing';

import { stateChangeEnter, stateChangeLeave, stateChangeToFast, stateChanged } from './state-change-fn';

describe('State change fn', () => {
  it('change from default state to false state', () => {
    void expect(stateChangeEnter('void', 'false')).toBeFalse();
    void expect(stateChangeLeave('void', 'false')).toBeFalse();
    void expect(stateChanged('void', 'false')).toBeFalse();
  });

  it('show default behavior', () => {
    void expect(stateChangeEnter('void', 'null')).toBeTrue();
  });

  it('show boolean behavior', () => {
    void expect(stateChangeEnter('false', 'true')).toBeTrue();
  });

  it('show default/boolean behavior', () => {
    void expect(stateChangeEnter('false', 'null')).toBeTrue();
    void expect(stateChangeEnter('void', 'true')).toBeTrue();
  });

  it('show unknown behavior', () => {
    void expect(stateChangeEnter('void', 'unknown')).toBeTrue();
    void expect(stateChangeEnter('false', 'unknown')).toBeTrue();
  });

  it('hide default behavior', () => {
    void expect(stateChangeLeave('null', 'void')).toBeTrue();
  });

  it('hide boolean behavior', () => {
    void expect(stateChangeLeave('true', 'false')).toBeTrue();
  });

  it('hide default/boolean behavior', () => {
    void expect(stateChangeLeave('true', 'void')).toBeTrue();
    void expect(stateChangeLeave('null', 'false')).toBeTrue();
  });

  it('hide unknown behavior', () => {
    void expect(stateChangeLeave('unknown', 'void')).toBeTrue();
    void expect(stateChangeLeave('unknown', 'false')).toBeTrue();
  });

  it('same state', () => {
    void expect(stateChangeEnter('true', 'true')).toBeFalse();
    void expect(stateChangeLeave('true', 'true')).toBeFalse();
    void expect(stateChanged('true', 'true')).toBeFalse();
  });

  it('the status has changed but remains visible', () => {
    void expect(stateChanged('unknown 1', 'unknown 2')).toBeTrue();
    void expect(stateChanged('unknown 1', 'unknown 1')).toBeFalse();
  });

  it('the status has changed but remains visible', fakeAsync(() => {
    const element = document.createElement('div');

    void expect(stateChangeToFast(100)('void', 'void', element)).toBeFalse();
    void expect(stateChangeToFast(100)('void', 'void', element)).toBeTrue();

    tick(100 / 3 + 1);

    void expect(stateChangeToFast(100)('void', 'void', element)).toBeFalse();
  }));
});
