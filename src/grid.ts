export default class Grid<Type> {
  readonly rows: number;
  readonly columns: number;
  cells: Type[][];

  constructor(rows: number, columns: number, initialValue: Type) {
    this.rows = rows;
    this.columns = columns;

    // 2d array
    this.cells = Array.from(new Array(rows), () => {
      return Array.from(new Array(columns), () => initialValue);
    });
  }

  // TODO: replace this with iterator?
  map(callbackFn: (row: number, column: number, value: Type) => void) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        callbackFn(i, j, this.cells[i][j]);
      }
    }
  }

}