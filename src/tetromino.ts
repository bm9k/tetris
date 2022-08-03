import Grid, { from2dArray } from "./grid"
import { rotateCoordinateRight } from "./position"

const tetrominoConfigs = [
    {
        key: "O",
        colour: "gold",
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        key: "S",
        colour: "green",
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    },
    {
        key: "Z",
        colour: "red",
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        key: "L",
        colour: "orange",
        shape: [
            [1, 1, 1],
            [1, 0, 0],
            [0, 0, 0]
        ]
    },
    {
        key: "J",
        colour: "blue",
        shape: [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]
        ]
    },
    {
        key: "T",
        colour: "purple",
        shape: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ]
    },
    {
        key: "I",
        colour: "teal",
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },

]

export interface Tetromino {
    colour: string,
    shape: Grid<number>
}

export const tetrominoes: Map<string, Tetromino> = new Map(tetrominoConfigs.map(({ shape, ...config }) => {
    return [config.key, {
        ...config,
        shape: from2dArray(shape)
    }]
}))

export function generateRightRotation(tetromino: Tetromino) {
    const { rows, columns } = tetromino.shape;

    if (rows !== columns) {
        throw new Error("Tetromino geometries must be represented as a square 2d matrix")
    }

    const rotatedShape = new Grid(rows, rows, 0);

    for (const [i, j, value] of tetromino.shape.entries()) {
        const { i: i2, j: j2 } = rotateCoordinateRight({ i, j }, rows);

        rotatedShape.cells[i2][j2] = value;
    }

    return rotatedShape;
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