import hotkeys from "hotkeys-js";

import { tetrominoes, Tetromino, generateRightRotation as rotateCellsRight, getKickOffsets } from "./tetromino";
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

interface GridConfig {
  rows: number,
  columns: number
}

class Field {
  readonly grid: Grid<string>

  constructor({ rows, columns }: GridConfig) {
    this.grid = new Grid(rows, columns, '');
  }

  hasTetrominoCollided(next: RealTetromino) {
    let collision = false;

    for (const [tI, tJ] of next.type.shape.keys(v => !!v)) {
      const { i, j } = next.position;

      const i2 = i + tI;
      const j2 = j + tJ;

      const validRow = 0 <= i2 && i2 < this.grid.rows;
      const validColumn = 0 <= j2 && j2 < this.grid.columns;

      // out of bounds
      if (!validRow || !validColumn) {
        collision = true;

        break;
      }

      // collides with another piece
      if (this.grid.cells[i2][j2]) {
        collision = true;
        break;
      }
    }

    return collision;
  }

  spawnTetronimo(): RealTetromino {
    const type = tetrominoes[randomInt(tetrominoes.length)];

    return {
      position: {
        i: -1,
        j: Math.floor((this.grid.columns - type.shape.columns) / 2)
      },
      rotation: 0,
      type
    }
  }

  move(next: RealTetromino, direction: Direction) {
    const delta = directionDeltas[direction];

    const potentialPosition = addPositions(next.position, delta)
    const canMove = !this.hasTetrominoCollided({
      ...next,
      position: potentialPosition
    })

    // TODO: make this return a copy somehow
    if (canMove) {
      next.position = potentialPosition;
    }

    return canMove;
  }

  rotateRight(tetromino: RealTetromino): RealTetromino {
    const { rows } = tetromino.type.shape;

    if (rows === 2) {
      return tetromino
    }

    const oldRotation = tetromino.rotation;

    const rotatedTetromino = {
      ...tetromino,
      rotation: (oldRotation + 1) % 4,
      type: {
        ...tetromino.type,
        shape: rotateCellsRight(tetromino.type)
      }
    };

    const offsetTests = getKickOffsets(rows)[oldRotation];

    for (const [dI, dJ] of offsetTests) {
      const kickedTetromino = {
        ...rotatedTetromino,
        position: addPositions(tetromino.position, { i: dI, j: dJ })
      };

      if (!this.hasTetrominoCollided(kickedTetromino)) {
        // rotation accepted
        return kickedTetromino;
      }
    }

    // rotation rejected
    return tetromino;
  }
}

class Game {
  readonly field: Field;

  constructor({ rows, columns }: GridConfig) {
    this.field = new Field({ rows, columns });
  }

}

// TODO: encapsulate UI
function draw(field: Field, canvas: HTMLCanvasElement, cellSize: number, next: RealTetromino) {
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw field
  for (const [i, j, value] of field.grid.entries(v => !!v)) {
    // draw cell
    context.fillStyle = value;
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  }

  // draw next tetromino
  context.fillStyle = next.type.colour;

  for (const [tI, tJ] of next.type.shape.keys(v => !!v)) {
    const i = next.position.i + tI;
    const j = next.position.j + tJ;

    // draw cell
    context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
  }
}


export default function setupTetris(domId: string) {
  const cellSize = 40;

  const game = new Game({
    rows: 20,
    columns: 10
  })

  const field = game.field;
  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * field.grid.columns;
  canvas.height = cellSize * field.grid.rows;

  let next = game.field.spawnTetronimo();

  const redraw = () => {
    draw(field, canvas, cellSize, next);
  }

  setInterval(() => {
    redraw();

    const moved = game.field.move(next, Direction.Down);

    if (!moved) {
      // landed

      // 1. add to field
      for (const [tI, tJ] of next.type.shape.keys(v => !!v)) {
        const i = next.position.i + tI;
        const j = next.position.j + tJ;

        field.grid.cells[i][j] = next.type.colour;
      }

      // 2. spawn new tetromino
      next = field.spawnTetronimo();
    }
  }, 500);

  hotkeys("left", event => {
    event.preventDefault();
    field.move(next, Direction.Left);
    redraw();
  });

  hotkeys("right", event => {
    event.preventDefault();
    field.move(next, Direction.Right);
    redraw();
  });

  hotkeys("up", event => {
    event.preventDefault();
    const potentialNext = field.rotateRight(next);

    if (!field.hasTetrominoCollided(potentialNext)) {
      next = potentialNext
    }
    redraw();
  });

}