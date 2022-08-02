import { tetrominoes, Tetromino } from "./data/tetromino";
import Grid from "./grid";
import hotkeys from "hotkeys-js";

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

interface Position2D {
  i: number,
  j: number
}

interface RealTetromino {
  position: Position2D
  type: Tetromino
}

function draw(field: Grid<string>, canvas: HTMLCanvasElement, cellSize: number, next: RealTetromino) {
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw field
  for (const [i, j, value] of field.entries(v => !!v)) {
    // draw cell
    context.fillStyle = value;
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  }

  // draw next tetromino
  context.fillStyle = next.type.colour;

  for (const [tI, tJ] of next.type.cells.keys(v => !!v)) {
    const i = next.position.i + tI;
    const j = next.position.j + tJ;

    // draw cell
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  }
}

function hasTetrominoCollided(next: RealTetromino, field: Grid<string>) {
  let collision = false;

  for (const [tI, tJ] of next.type.cells.keys(v => !!v)) {
    const { i, j } = next.position;

    const i2 = i + tI;
    const j2 = j + tJ;

    const validRow = 0 <= i2 && i2 < field.rows;
    const validColumn = 0 <= j2 && j2 < field.columns;

    // out of bounds
    if (!validRow || !validColumn) {
      collision = true;

      break;
    }

    // collides with another piece
    if (field.cells[i2][j2]) {
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
    type: tetrominoes[randomInt(tetrominoes.length)]
  }
}

enum Direction {
  Up,
  Down,
  Left,
  Right
}

const directionDeltas = {
  [Direction.Up]: { i: -1, j: 0 },
  [Direction.Down]: { i: 1, j: 0 },
  [Direction.Left]: { i: 0, j: -1 },
  [Direction.Right]: { i: 0, j: 1 },
}

function addPositions(a: Position2D, b: Position2D) {
  return {
    i: a.i + b.i,
    j: a.j + b.j
  }
}

function move(field: Grid<string>, next: RealTetromino, direction: Direction) {
  const delta = directionDeltas[direction];

  const potentialPosition = addPositions(next.position, delta)
  const canMove = !hasTetrominoCollided({
    ...next,
    position: potentialPosition
  }, field)

  if (canMove) {
    next.position = potentialPosition;
  }

  return canMove;
}

export default function setupTetris(domId: string) {
  const cellSize = 40;

  const field = new Grid(20, 10, '');
  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * field.columns;
  canvas.height = cellSize * field.rows;

  let next = spawnTetronimo();

  const redraw = () => {
    draw(field, canvas, cellSize, next);
  }

  setInterval(() => {
    redraw();

    const moved = move(field, next, Direction.Down);

    if (!moved) {
      // landed

      // 1. add to field
      for (const [tI, tJ] of next.type.cells.keys(v => !!v)) {
        const i = next.position.i + tI;
        const j = next.position.j + tJ;

        field.cells[i][j] = next.type.colour;
      }

      // 2. spawn new tetromino
      next = spawnTetronimo();
    }
  }, 500);

  hotkeys("left", event => {
    event.preventDefault();
    move(field, next, Direction.Left);
    redraw();
  });

  hotkeys("right", event => {
    event.preventDefault();
    move(field, next, Direction.Right);
    redraw();
  });

}