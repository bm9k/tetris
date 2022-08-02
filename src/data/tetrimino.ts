import Grid, { from2dArray } from "../grid"

const tetriminoConfigs = [
    {
        colour: "gold",
        cells: [
            [1,1],
            [1,1]
        ]
    },
    {
        colour: "green",
        cells: [
            [0,1,1],
            [1,1,0]
        ]
    },
    {
        colour: "red",
        cells: [
            [1,1,0],
            [0,1,1]
        ]
    },
    {
        colour: "orange",
        cells: [
            [1,1,1],
            [1,0,0]
        ]
    },
    {
        colour: "blue",
        cells: [
            [1,1,1],
            [0,0,1]
        ]
    },
    {
        colour: "purple",
        cells: [
            [1,1,1],
            [0,1,0]
        ]
    },
    {
        colour: "teal",
        cells: [
            [1,1,1,1]
        ]
    },
    
  ]

export interface Tetrimino {
  colour: string,
  cells: Grid<number>
}

export const tetriminoes: Tetrimino[] = tetriminoConfigs.map(({cells, ...config}) => {
    return {
        ...config,
        cells: from2dArray(cells)
    }
})