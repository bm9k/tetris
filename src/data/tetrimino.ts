export interface Tetrimino {
  colour: string,
  cells: number[][]  // 2d bitmap
}

export const tetriminoes: Tetrimino[] = [
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