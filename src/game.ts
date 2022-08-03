import { tetrominoes, Tetromino, generateRightRotation as rotateCellsRight, getKickOffsets } from "./tetromino";
import Grid from "./grid";
import { Position2D, Direction, addPositions, directionDeltas } from "./position";
import { SevenBagGenerator } from "./tetromino-generator";

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

  affix(tetromino: RealTetromino) {
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
  next!: RealTetromino;
  ghostPosition!: Position2D;
  generator: SevenBagGenerator;

  constructor({ rows, columns }: GridConfig) {
    this.field = new Field({ rows, columns });

    this.generator = new SevenBagGenerator([...tetrominoes.keys()])

    this.spawnTetronimo();
  }

  spawnTetronimo() {
    const key = this.generator.take();
    const type = tetrominoes.get(key)!;

    this.next = {
      position: {
        i: -1,
        j: Math.floor((this.field.grid.columns - type.shape.columns) / 2)
      },
      rotation: 0,
      type
    }

    this.alignGhost();
  }

  alignGhost() {
    this.ghostPosition = this.calculateLockPosition();
  }

  attemptRotateRight() {
    const potentialNext = this.field.rotateRight(this.next);

    if (!this.field.hasTetrominoCollided(potentialNext)) {
      this.next = potentialNext
      this.alignGhost();
    }
  }

  attemptMove(direction: Direction) {
    this.field.move(this.next, direction);
    this.alignGhost();
  }

  applyGravity() {
    const moved = this.field.move(this.next, Direction.Down);

    if (!moved) {
      // landed
      this.field.affix(this.next);
      this.field.clearCompletedRows();
      this.spawnTetronimo();
    }
  }

  calculateLockPosition(): Position2D {
    // find closest lock position
    // start from di = 1, 2, ... until the position isn't valid, then subtract 1
    let dI;
    // +1 accounts for tetrominoes spawning at i=-1
    for (dI = 1; dI < this.field.grid.rows + 1; dI++) {
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

    return addPositions(this.next.position, { i: dI, j: 0 })
  }

  hardDrop() {
    const position = this.calculateLockPosition();

    this.next = {
      ...this.next,
      position,
    }
  }


}