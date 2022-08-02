import hotkeys from "hotkeys-js";

import { tetrominoes, Tetromino, generateRightRotation as rotateCellsRight, getKickOffsets } from "./data/tetromino";
import Grid from "./grid";
import { Position2D, Direction, addPositions, directionDeltas } from "./position";

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

interface RealTetromino {
  position: Position2D
  rotation: number,  // 0 <= number <= 3
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

function spawnTetronimo(field: Grid<string>): RealTetromino {
  const type = tetrominoes[randomInt(tetrominoes.length)];

  return {
    position: {
      i: -1,
      j: Math.floor((field.columns - type.cells.columns) / 2)
    },
    rotation: 0,
    type
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

function rotateRight(tetromino: RealTetromino, field: Grid<string>) {
  const { rows } = tetromino.type.cells;

  if (rows === 2) {
    return tetromino
  }

  const oldRotation = tetromino.rotation;

  const rotatedTetromino = {
    ...tetromino,
    rotation: (oldRotation + 1) % 4,
    type: {
      ...tetromino.type,
      cells: rotateCellsRight(tetromino.type)
    }
  };

  const offsetTests = getKickOffsets(rows)[oldRotation];

  for (const [dI, dJ] of offsetTests) {
    const kickedTetromino = {
      ...rotatedTetromino,
      position: addPositions(tetromino.position, { i: dI, j: dJ })
    };

    if (!hasTetrominoCollided(kickedTetromino, field)) {
      // rotation accepted
      return kickedTetromino;
    }
  }

  // rotation rejected
  return tetromino;
}

export default function setupTetris(domId: string) {
  const cellSize = 40;

  const field = new Grid(20, 10, '');
  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * field.columns;
  canvas.height = cellSize * field.rows;

  let next = spawnTetronimo(field);

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
      next = spawnTetronimo(field);
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

  hotkeys("up", event => {
    event.preventDefault();
    const potentialNext = rotateRight(next, field);

    if (!hasTetrominoCollided(potentialNext, field)) {
      next = potentialNext
    }
    redraw();
  });

}