import Grid from "./grid";

const colours = [
  "gold",
  "green",
  "red",
  "orange",
  "blue",
  "purple",
  "teal"
]

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

function draw(grid: Grid<string>, canvas: HTMLCanvasElement, cellSize: number) {
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  const i = randomInt(grid.rows);
  const j = randomInt(grid.columns);

  grid.cells[i][j] = colours[randomInt(colours.length)]

  grid.map((i, j, value) => {
    if (!value) {
      return
    }

    context.fillStyle = value;
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  });
}

export default function setupTetris(domId: string) {
  const cellSize = 40;

  const grid = new Grid(20, 10, '');
  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * grid.columns;
  canvas.height = cellSize * grid.rows;

  setInterval(() => {
    draw(grid, canvas, cellSize);
  }, 500);

}