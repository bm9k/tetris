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
  map(callbackFn: (row: number, column: number, value: Type) => void, filterFn?: (value: Type) => boolean) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const value = this.cells[i][j];
        if (filterFn && !filterFn(value)) {
          continue;
        }
        callbackFn(i, j, value);
      }
    }
  }

}

export function from2dArray<Type>(array2d: Type[][]): Grid<Type> {
  // pre-condition: all elements of array2d are arrays of equal length
  const rows = array2d.length;
  const columns = array2d[0].length;
  const initialValue = array2d[0][0];

  const grid = new Grid(rows, columns, initialValue);

  grid.map((row, column) => {
    grid.cells[row][column] = array2d[row][column];
  })

  return grid;
}