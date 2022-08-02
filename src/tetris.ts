import { tetriminoes, Tetrimino } from "./data/tetrimino";
import Grid from "./grid";

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

interface Position2D {
  i: number,
  j: number
}

interface RealTetrimino {
  position: Position2D
  type: Tetrimino
}

function draw(grid: Grid<string>, canvas: HTMLCanvasElement, cellSize: number, next: RealTetrimino) {
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw next tetrimino    
  context.fillStyle = next.type.colour;

  map2d(next.type.cells, (tI, tJ, value) => {
    const i = next.position.i + tI;
    const j = next.position.j + tJ;

    if (!value) {
      return;
    }

    // draw cell
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  });
}

function hasTetriminoLanded(next: RealTetrimino, field: Grid<string>) {
  const lastRow = field.rows;
  const tetriminoHeight = next.type.cells.length;

  return lastRow === next.position.i + tetriminoHeight;

}

function spawnTetronimo() {
  return {
    position: {
      i: -1,
      j: 3,
    },
    type: tetriminoes[randomInt(tetriminoes.length)]
  }
}

// TODO: move this somewhere; does it belong on Grid class?
function map2d(array2d: number[][], callbackFn: (i: number, j: number, value: number) => void) {
  for (let i = 0; i < array2d.length; i++) {
    for (let j = 0; j < array2d[0].length; j++) {
      callbackFn(i, j, array2d[i][j]);
    }
  }
}

export default function setupTetris(domId: string) {
  const cellSize = 40;

  const field = new Grid(20, 10, '');
  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * field.columns;
  canvas.height = cellSize * field.rows;

  const next = spawnTetronimo();

  setInterval(() => {
    draw(field, canvas, cellSize, next);

    if (!hasTetriminoLanded(next, field)) {
      next.position.i += 1;
    }
  }, 500);

}