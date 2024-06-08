import { Grid } from './grid';

fdescribe('get position', () => {
  it('shift to left', () => {
    const matrice = new Grid(9, 5);

    /**
     *
     *  ┌─────────────────┐
     *  │ ┌─────┌───────┐ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ └─────└───────┘ │
     *  └─────────────────┘
     *
     *  ┌─────────────────┐
     *  ┌───────┌───────┐ │
     *  │       │       │ │
     *  │       │       │ │
     *  │       │       │ │
     *  └───────└───────┘ │
     *  └─────────────────┘
     *
     */

    const item = matrice.add(1, 1, 4, 4);

    matrice.change({
      id: Symbol(),
      col: 4,
      row: 1,
      cols: 4,
      rows: 4,
    });

    expect(item.col).toEqual(0);
  });

  it('test', () => {
    const matrice = new Grid(14, 5);

    /**
     *
     *  ┌───────────────────────────┐
     *  │ ┌───────┌───────┌───────┐ │
     *  │ │       │       │ │     │ │
     *  │ │       │       │ │     │ │
     *  │ │       │       │ │     │ │
     *  │ └───────└───────└───────┘ │
     *  └───────────────────────────┘
     *
     *  ┌───────────────────────────┐
     *  ┌───────┌───────┌───────┐   │
     *  │       │       │       │   │
     *  │       │       │       │   │
     *  │       │       │       │   │
     *  └───────└───────└───────┘   │
     *  └───────────────────────────┘
     *
     */

    const item1 = matrice.add(1, 1, 4, 4);
    const item2 = matrice.add(5, 1, 4, 4);

    matrice.change({
      id: Symbol(),
      col: 8,
      row: 1,
      cols: 4,
      rows: 4,
    });

    expect(item1.col).toEqual(0);
    expect(item2.col).toEqual(4);
  });

  it('test', () => {
    const matrice = new Grid(9, 5);

    /**
     *
     *  ┌─────────────────┐
     *  │┌─────┌───────┐  │
     *  ││     │ │     │  │
     *  ││     │ │     │  │
     *  ││     │ │     │  │
     *  │└─────└───────┘  │
     *  └─────────────────┘
     *
     *  not possible
     *
     */

    const item = matrice.add(0, 1, 4, 4);

    matrice.change({
      id: Symbol(),
      col: 3,
      row: 1,
      cols: 4,
      rows: 4,
    });

    expect(item.col).toEqual(0);
  });

  it('test', () => {
    const matrice = new Grid(9, 5);

    /**
     *
     *  ┌─────────────────┐
     *  │ ┌───┌───────┐   │
     *  │ │   │   │   │   │
     *  │ │   │   │   │   │
     *  │ │   │   │   │   │
     *  │ └───└───────┘   │
     *  └─────────────────┘
     *
     *  not possible
     *
     */

    const item = matrice.add(1, 1, 4, 4);

    matrice.change({
      id: Symbol(),
      col: 3,
      row: 1,
      cols: 4,
      rows: 4,
    });

    expect(item.col).toEqual(1);
  });

  it('test', () => {
    const matrice = new Grid(14, 5);

    /**
     *
     *  ┌───────────────────────────┐
     *  │ ┌───────┌─────┌───────┐   │
     *  │ │       │     │   │   │   │
     *  │ │       │     │   │   │   │
     *  │ │       │     │   │   │   │
     *  │ └───────└─────└───────┘   │
     *  └───────────────────────────┘
     *
     *  not possible
     *
     */

    const item1 = matrice.add(1, 1, 4, 4);
    const item2 = matrice.add(5, 1, 4, 4);

    matrice.change({
      id: Symbol(),
      col: 7,
      row: 1,
      cols: 4,
      rows: 4,
    });

    expect(item1.col).toEqual(1);
    expect(item2.col).toEqual(5);
  });

  it('shift to right', () => {
    const matrice = new Grid(9, 5);

    /**
     *
     *  ┌─────────────────┐
     *  │ ┌───────┐─────┐ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ │     │ │     │ │
     *  │ └───────┘─────┘ │
     *  └─────────────────┘
     *
     *  ┌─────────────────┐
     *  │┌───────┐───────┐│
     *  ││       │       ││
     *  ││       │       ││
     *  ││       │       ││
     *  │└───────┘───────┘│
     *  └─────────────────┘
     *
     */

    const item = matrice.add(4, 1, 4, 4);

    matrice.change({
      id: Symbol(),
      col: 1,
      row: 1,
      cols: 4,
      rows: 4,
    });

    expect(item.col).toEqual(5);
  });
});
