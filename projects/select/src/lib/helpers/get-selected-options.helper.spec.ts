import { KcGroup, KcOption } from '../types';

import { getSelectedOptions } from './get-selected-options.helper';
import { MapEmitSelect } from './map-emit-select.helpers';

describe('get selected options', () => {
  it('get simple selected options: multiple', () => {
    const options: KcOption<string>[] = [{ value: '1' }, { value: '2' }, { value: '3' }];

    const value = ['1', '2'];

    const expected: [string, KcOption<string>][] = [
      ['1', { value: '1' }],
      ['2', { value: '2' }],
    ];

    expect(getSelectedOptions(options, value)).toEqual(expected);
  });

  it('get simple selected options: single', () => {
    const options: KcOption<string>[] = [{ value: '1' }, { value: '2' }, { value: '3' }];

    const value = '1';

    const expected: [string, KcOption<string>][] = [['1', { value: '1' }]];

    expect(getSelectedOptions(options, value)).toEqual(expected);
  });

  it('get simple selected options: key', () => {
    const options: KcOption<string, number>[] = [
      { value: '1', key: 1 },
      { value: '2', key: 2 },
      { value: '3', key: 3 },
    ];

    const value = [1, 2];

    const expected: [number, KcOption<string, number>][] = [
      [1, { value: '1', key: 1 }],
      [2, { value: '2', key: 2 }],
    ];

    // TODO: fix this type
    expect(getSelectedOptions(options, value as unknown as string[])).toEqual(expected);
  });

  it('get simple selected options: key, single', () => {
    const options: KcOption<string, number>[] = [
      { value: '1', key: 1 },
      { value: '2', key: 2 },
      { value: '3', key: 3 },
    ];

    const value = 1;

    const expected: [number, KcOption<string, number>][] = [[1, { value: '1', key: 1 }]];

    // TODO: fix this type
    expect(getSelectedOptions(options, value as unknown as string[])).toEqual(expected);
  });

  it('get simple selected options with labels', () => {
    const options: KcOption<string, string>[] = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ];

    const value = ['1', '2'];

    const expected: [string, KcOption<string, string>][] = [
      ['1', { value: '1', label: '1' }],
      ['2', { value: '2', label: '2' }],
    ];

    expect(getSelectedOptions(options, value)).toEqual(expected);
  });

  it('get chunk selected options, multiple', () => {
    const options: KcOption<string>[][] = [[{ value: '1' }, { value: '2' }], [{ value: '3' }]];

    const value = ['1', '2'];

    const expected: [string, KcOption<string>][] = [
      ['1', { value: '1' }],
      ['2', { value: '2' }],
    ];

    // TODO: fix this type
    expect(getSelectedOptions(options, value)).toEqual(expected);
  });

  it('get chunk selected options: multiple, key', () => {
    const options: KcOption<string, number>[][] = [
      [
        { value: '1', key: 1 },
        { value: '2', key: 2 },
      ],
      [{ value: '3', key: 3 }],
    ];

    const value = [1, 2];

    const expected: [number, KcOption<string, number>][] = [
      [1, { value: '1', key: 1 }],
      [2, { value: '2', key: 2 }],
    ];

    // TODO: fix this type
    expect(getSelectedOptions(options, value as unknown as string[])).toEqual(expected);
  });

  it('get chunk selected options, single', () => {
    const options: KcOption<string>[][] = [[{ value: '1' }, { value: '2' }], [{ value: '3' }]];

    const value = '1';

    const expected: [string, KcOption<string>][] = [['1', { value: '1' }]];

    // TODO: fix this type
    expect(getSelectedOptions(options, value)).toEqual(expected);
  });

  it('get chunk selected options: single, key', () => {
    const options: KcOption<string, number>[][] = [
      [
        { value: '1', key: 1 },
        { value: '2', key: 2 },
      ],
      [{ value: '3', key: 3 }],
    ];

    const value = 1;

    const expected: [number, KcOption<string, number>][] = [[1, { value: '1', key: 1 }]];

    const result = getSelectedOptions(options, value as unknown as string);

    expect(result).toEqual(expected);
  });

  it('get chunk selected options: single, key', () => {
    const options: KcOption<string, number>[][] = [
      [
        { value: '1', key: 1 },
        { value: '2', key: 2 },
      ],
      [{ value: '3', key: 3 }],
    ];

    const value = 1;

    const expected: [number, KcOption<string, number>][] = [[1, { value: '1', key: 1 }]];

    const result = getSelectedOptions(options, value as unknown as string);

    expect(result).toEqual(expected);
  });

  it('get group selected options: single', () => {
    const options: KcGroup<string> = {
      users: {
        value: [{ value: '1' }, { value: '2' }, { value: '3' }],
      },
    };

    const value = { users: '1' };

    const expected: [string, KcOption<string>][] = [
      ['users', new MapEmitSelect(false, ['1', { value: '1' }]) as unknown as KcOption<string>],
    ];

    const test = getSelectedOptions(options, value);

    expect(test).toEqual(expected);
  });
});
