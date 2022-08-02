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

function draw(field: Grid<string>, canvas: HTMLCanvasElement, cellSize: number, next: RealTetrimino) {
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw field
  for (const [i, j, value] of field.entries(v => !!v)) {
    // draw cell
    context.fillStyle = value;
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  }

  // draw next tetrimino    
  context.fillStyle = next.type.colour;

  for (const [tI, tJ] of next.type.cells.keys(v => !!v)) {
    const i = next.position.i + tI;
    const j = next.position.j + tJ;

    // draw cell
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  }
}

function hasTetriminoLanded(next: RealTetrimino, field: Grid<string>) {
  let collision = false;

  for (const [tI, tJ] of next.type.cells.keys(v => !!v)) {
    const {i, j} = next.position;

    // +1 for next row
    const i2 = i + 1 + tI;
    const j2 = j + tJ;

    if (!field.cells[i2] || field.cells[i2][j2]) {
      collision = true;
      break;
    }
  }

  return collision;
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

export default function setupTetris(domId: string) {
  const cellSize = 40;

  const field = new Grid(20, 10, '');
  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * field.columns;
  canvas.height = cellSize * field.rows;

  let next = spawnTetronimo();

  setInterval(() => {
    draw(field, canvas, cellSize, next);

    if (!hasTetriminoLanded(next, field)) {
      next.position.i += 1;
    } else {
      // landed

      // 1. add to field
      for (const [tI, tJ] of next.type.cells.keys(v => !!v)) {
        const i = next.position.i + tI;
        const j = next.position.j + tJ;

        field.cells[i][j] = next.type.colour;
      }

      // 2. spawn new tetrimino
      next = spawnTetronimo();
    }
  }, 500);

}