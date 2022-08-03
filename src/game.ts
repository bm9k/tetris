import { tetrominoes, Tetromino, generateRightRotation as rotateCellsRight, getKickOffsets } from "./tetromino";
import Grid from "./grid";
import { Position2D, Direction, addPositions, directionDeltas } from "./position";

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

export interface RealTetromino {
  position: Position2D
  rotation: number,  // 0 <= number <= 3
  type: Tetromino
}

export interface GridConfig {
  rows: number,
  columns: number
}

export class Field {
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

    // TODO: make this return a copy?
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

  affixTetromino(tetromino: RealTetromino) {
    for (const [tI, tJ] of tetromino.type.shape.keys(v => !!v)) {
      const i = tetromino.position.i + tI;
      const j = tetromino.position.j + tJ;

      this.grid.cells[i][j] = tetromino.type.colour;
    }
  }

  isRowCompleted(rowIndex: number) {
    for (const cell of this.grid.cells[rowIndex]) {
      if (!cell) {
        return false;
      }
    }

    return true;
  }

  findCompletedRows() {
    const completedRows = [];

    for (let i = this.grid.rows - 1; i >= 0; i--) {
      if (this.isRowCompleted(i)) {
        completedRows.push(i);
      }
    }

    return completedRows;
  }

  clearCompletedRows(): boolean {
    // identify completed rows
    const completedRows = this.findCompletedRows();

    // clear rows
    for (const i of completedRows) {
      for (let j = 0; j < this.grid.columns; j++) {
        this.grid.cells[i][j] = "";
      }
    }

    if (!completedRows) {
      return false;
    }

    // drop field down
    const emptyRows = new Set(completedRows);
    const newRows = [
      // gather completed rows at the top
      ...[...completedRows.reverse()].map(i => this.grid.cells[i]),
      // gather other rows at the bottom
      ...this.grid.cells.filter((_, i) => !emptyRows.has(i)),
    ];

    for (const [i, row] of newRows.entries()) {
      this.grid.cells[i] = row;
    }

    return true;
  }
}

export class Game {
  readonly field: Field;
  next: RealTetromino;

  constructor({ rows, columns }: GridConfig) {
    this.field = new Field({ rows, columns });
    this.next = this.field.spawnTetronimo();
  }

  attemptRotateRight() {
    const potentialNext = this.field.rotateRight(this.next);

    if (!this.field.hasTetrominoCollided(potentialNext)) {
      this.next = potentialNext
    }
  }

  attemptMove(direction: Direction) {
    this.field.move(this.next, direction);
  }

  applyGravity() {
    const moved = this.field.move(this.next, Direction.Down);

    if (!moved) {
      // landed
      this.field.affixTetromino(this.next);
      this.field.clearCompletedRows();
      this.next = this.field.spawnTetronimo();
    }
  }

  hardDrop() {
    // 1. find closest lock position
    // start from di = 1, 2, ... until the position isn't valid, then subtract 1
    let dI;
    for (dI = 1; dI < this.field.grid.rows; dI++) {
      const potential = {
        ...this.next,
        position: addPositions(this.next.position, { i: dI, j: 0 })
      }

      const collided = this.field.hasTetrominoCollided(potential);

      if (collided) {
        dI--;
        break;
      }
    }

    if (dI === 0) {
      return;
    }

    // 2. move the tetromino there
    this.next = {
      ...this.next,
      position: addPositions(this.next.position, { i: dI, j: 0 })
    }
  }


}