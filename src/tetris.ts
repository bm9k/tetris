import hotkeys from "hotkeys-js";

import { Game } from "./game";
import { Direction } from "./position";

// TODO: encapsulate UI
function draw(game: Game, canvas: HTMLCanvasElement, cellSize: number) {
  const { field, next } = game;

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
  });

  const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * game.field.grid.columns;
  canvas.height = cellSize * game.field.grid.rows;

  const redraw = () => {
    draw(game, canvas, cellSize);
  }

  setInterval(() => {
    redraw();

    game.applyGravity();
  }, 500);

  const keyboardActions = new Map([
    ["left", () => game.attemptMove(Direction.Left)],
    ["right", () => game.attemptMove(Direction.Right)],
    ["up", () => game.attemptRotateRight()],
    ["down", () => game.attemptMove(Direction.Down)],
    ["space", () => game.hardDrop()],
  ]);

  for (const [shortcut, actionFn] of keyboardActions.entries()) {
    hotkeys(shortcut, event => {
      event.preventDefault();
      actionFn();
      redraw();
    });
  }

}