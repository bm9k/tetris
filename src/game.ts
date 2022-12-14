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

export class Field extends Grid<string> {
  constructor({ rows, columns }: GridConfig) {
    super(rows, columns, "");
  }

  hasTetrominoCollided(next: RealTetromino) {
    let collision = false;

    for (const [tI, tJ] of next.type.shape.keys(v => !!v)) {
      const { i, j } = next.position;

      const i2 = i + tI;
      const j2 = j + tJ;

      const validRow = 0 <= i2 && i2 < this.rows;
      const validColumn = 0 <= j2 && j2 < this.columns;

      // out of bounds
      if (!validRow || !validColumn) {
        collision = true;

        break;
      }

      // collides with another piece
      if (this.cells[i2][j2]) {
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

      this.cells[i][j] = tetromino.type.colour;
    }
  }

  isRowCompleted(rowIndex: number) {
    for (const cell of this.cells[rowIndex]) {
      if (!cell) {
        return false;
      }
    }

    return true;
  }

  findCompletedRows() {
    const completedRows = [];

    for (let i = this.rows - 1; i >= 0; i--) {
      if (this.isRowCompleted(i)) {
        completedRows.push(i);
      }
    }

    return completedRows;
  }

  // clears completed rows & returns how many were cleared
  clearCompletedRows(): (0 | 1 | 2 | 3 | 4) {
    // identify completed rows
    const completedRows = this.findCompletedRows();

    // clear rows
    for (const i of completedRows) {
      for (let j = 0; j < this.columns; j++) {
        this.cells[i][j] = "";
      }
    }

    if (!completedRows) {
      return 0;
    }

    // drop field down
    const emptyRows = new Set(completedRows);
    const newRows = [
      // gather completed rows at the top
      ...[...completedRows.reverse()].map(i => this.cells[i]),
      // gather other rows at the bottom
      ...this.cells.filter((_, i) => !emptyRows.has(i)),
    ];

    for (const [i, row] of newRows.entries()) {
      this.cells[i] = row;
    }

    return completedRows.length as (1 | 2 | 3 | 4);
  }
}

class ScoreBoard {
  readonly SOFT_DROP_CELL = 1;
  readonly HARD_DROP_CELL = 2;
  readonly LINES_CLEARED = {
    1: 100,
    2: 300,
    3: 500,
    4: 800
  };

  private _score: number = 0;

  constructor() { }

  get score() {
    return this._score;
  }

  reset() {
    this._score = 0;
  }

  addSoftDrop() {
    this._score += this.SOFT_DROP_CELL;
  }

  addHardDrop(distance: number) {
    this._score += this.HARD_DROP_CELL * distance;
  }

  addLinesCleared(lineCount: 0 | 1 | 2 | 3 | 4) {
    if (lineCount === 0) {
      return;
    }
    this._score += this.LINES_CLEARED[lineCount];
  }
}

export class Game {
  field: Field;
  next!: RealTetromino;
  ghostPosition!: Position2D;
  activeHold: (Tetromino | undefined);
  holdAllowed: boolean = true;
  generator: SevenBagGenerator;
  gameOver: boolean = false;
  score: ScoreBoard;

  constructor({ rows, columns }: GridConfig) {
    this.field = new Field({ rows, columns });
    this.score = new ScoreBoard();

    this.generator = new SevenBagGenerator([...tetrominoes.keys()])

    this.spawnTetronimo();
  }

  previewTetromino(): Tetromino {
    const key = this.generator.peek();
    return tetrominoes.get(key)!;
  }

  spawnTetronimo(key?: string) {
    if (!key) {
      key = this.generator.take();
    }
    const type = tetrominoes.get(key)!;

    this.next = {
      position: {
        i: -1,
        j: Math.floor((this.field.columns - type.shape.columns) / 2)
      },
      rotation: 0,
      type
    }

    this.alignGhost();
  }

  attemptHold(): boolean {
    if (!this.holdAllowed) {
      return false;
    }

    const previousHold = this.activeHold;

    const key = this.next.type.key;
    this.activeHold = tetrominoes.get(key)!;
    this.holdAllowed = false;

    this.spawnTetronimo(previousHold?.key);

    return true;
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
    const moved = this.field.move(this.next, direction);
    this.alignGhost();

    if (direction === Direction.Down && moved) {
      this.score.addSoftDrop();
    }
  }

  applyGravity() {
    const moved = this.field.move(this.next, Direction.Down);

    if (!moved) {

      if (this.next.position.i === -1) {
        this.gameOver = true;
        return;
      }

      // landed
      this.field.affix(this.next);
      const cleared = this.field.clearCompletedRows();
      this.score.addLinesCleared(cleared);

      this.holdAllowed = true;
      this.spawnTetronimo();
    }
  }

  calculateLockPosition(): Position2D {
    // find closest lock position
    // start from di = 1, 2, ... until the position isn't valid, then subtract 1
    let dI;
    // +1 accounts for tetrominoes spawning at i=-1
    for (dI = 1; dI < this.field.rows + 1; dI++) {
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

    const dI = position.i - this.next.position.i;

    this.next = {
      ...this.next,
      position,
    }

    this.score.addHardDrop(dI);
  }


}