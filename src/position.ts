export interface Position2D {
  i: number,
  j: number
}

export enum Direction {
  Up,
  Down,
  Left,
  Right
}

export const directionDeltas = {
  [Direction.Up]: { i: -1, j: 0 },
  [Direction.Down]: { i: 1, j: 0 },
  [Direction.Left]: { i: 0, j: -1 },
  [Direction.Right]: { i: 0, j: 1 },
}

export function addPositions(a: Position2D, b: Position2D) {
  return {
    i: a.i + b.i,
    j: a.j + b.j
  }
}

/*

TODO: convert this to markdown & add to README (or somewhere else appropriate)
See also:
https://tetris.fandom.com/wiki/SRS

Rotate MxN matrix around centre
M = rows; N = columns

---

Rotate 90 degrees right
Value is (i',j')

\ j |       |       |       |       |
 \  |       |       |       |       |
i \ |   0   |   1   |   2   |   3   |
----+-------+-------+-------+-------|
  0 | (0,2) | (1,2) | (1,2) | (1,2) |
----+-------+-------+-------+-------|
  1 | (0,1) | (1,1) | (1,1) | (1,1) |
----+-------+-------+-------+-------|
  2 | (0,0) | (1,0) | (1,0) | (1,0) |
----+-------+-------+-------+-------|

i' = j
j' = M - 1 - i

---

Rotate 90 degrees left
Value is (i',j')

\ j |       |       |       |       |
 \  |       |       |       |       |
i \ |   0   |   1   |   2   |   3   |
----+-------+-------+-------+-------|
  0 | (3,1) | (2,1) | (1,0) | (0,0) |
----+-------+-------+-------+-------|
  1 | (3,1) | (2,1) | (1,1) | (0,1) |
----+-------+-------+-------+-------|
  2 | (3,2) | (2,2) | (1,2) | (0,2) |
----+-------+-------+-------+-------|

i' = N - 1 - j
j' = i

*/

export function rotateCoordinateRight(coord: Position2D, size: number) {
  const {i, j} = coord
  return {
    i: j,
    j: size - 1 - i
  }
}