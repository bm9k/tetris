import Grid, { from2dArray } from "../grid"
import { rotateCoordinateRight } from "../position"

const tetrominoConfigs = [
    {
        colour: "gold",
        cells: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        colour: "green",
        cells: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    },
    {
        colour: "red",
        cells: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        colour: "orange",
        cells: [
            [1, 1, 1],
            [1, 0, 0],
            [0, 0, 0]
        ]
    },
    {
        colour: "blue",
        cells: [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]
        ]
    },
    {
        colour: "purple",
        cells: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ]
    },
    {
        colour: "teal",
        cells: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },

]

export interface Tetromino {
    colour: string,
    cells: Grid<number>
}

export const tetrominoes: Tetromino[] = tetrominoConfigs.map(({ cells, ...config }) => {
    return {
        ...config,
        cells: from2dArray(cells)
    }
})

export function generateRightRotation(tetromino: Tetromino) {
    const { rows, columns } = tetromino.cells;

    if (rows !== columns) {
        throw new Error("Tetromino geometries must be represented as a square 2d matrix")
    }

    const rotatedCells = new Grid(rows, rows, 0);

    for (const [i, j, value] of tetromino.cells.entries()) {
        const { i: i2, j: j2 } = rotateCoordinateRight({ i, j }, rows);

        rotatedCells.cells[i2][j2] = value;
    }

    return rotatedCells;
}

// Kick offsets for right rotations
// see https://tetris.fandom.com/wiki/SRS#Wall_Kicks

// t3KickOffsets[i] contains the 5 tests for the ith right rotation (i * 90 deg right)
// each test is [x,y] offset to try
// TODO: make this wording clearer

const size3KickOffsets = [
    [
        [0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]
    ],
    [
        [0, 0], [1, 0], [1, -1], [0, 2], [1, 2]
    ],
    [
        [0, 0], [1, 0], [1, 1], [0, -2], [1, -2]
    ],
    [
        [0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]
    ],
]

const size4KickOffsets = [
    [
        [0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]
    ],
    [
        [0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]
    ],
    [
        [0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]
    ],
    [
        [0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]
    ],
]

// TODO: restrict this type?
export function getKickOffsets(size: number) {
    switch (size) {
        case 3:
            return size3KickOffsets;
        case 4:
            return size4KickOffsets;
        default:
            throw new Error(`No offsets defined for size ${size}`)
    }
}