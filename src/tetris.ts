const colours = [
  "gold",
  "green",
  "red",
  "orange",
  "blue",
  "purple",
  "teal"
]

interface Grid {
  rows: number,
  columns: number,
  cells: (string | undefined)[][]
}

function createGrid(rows: number, columns: number): Grid {
  const cells = Array.from(new Array(rows), () => {
    return Array.from(new Array(columns), () => undefined);
  });

  return {
    rows,
    columns,
    cells
  }
}

function mapGrid(grid: Grid, callbackFn: (row: number, column: number, value: string | undefined) => void) {
  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.columns; j++) {
      callbackFn(i, j, grid.cells[i][j]);
    }
  }
}

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

function draw(grid: Grid, canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  const i = randomInt(gridRows);
  const j = randomInt(gridColumns);

  grid.cells[i][j] = colours[randomInt(colours.length)]

  mapGrid(grid, (i, j, value) => {
    if (!value) {
      return
    }

    context.fillStyle = value;
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  })
}


const gridRows = 20;
const gridColumns = 10;

const cellSize = 40;

export default function setupTetris(domId: string) {
  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * gridColumns;
  canvas.height = cellSize * gridRows;

  const grid = createGrid(gridRows, gridColumns);

  setInterval(() => {
    draw(grid, canvas);
  }, 500);

}