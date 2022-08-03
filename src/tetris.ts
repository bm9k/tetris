import hotkeys from "hotkeys-js";

import { Game } from "./game";
import { Direction } from "./position";
import { draw } from "./ui";


export default function setupTetris(domId: string) {
  const cellSize = 40;

  const game = new Game({
    rows: 20,
    columns: 10
  });

  const previewSize = {
    rows: 2,
    columns: 4
  }

  const rootElement = document.getElementById(domId)!;
  const canvas = rootElement.querySelector(".field") as HTMLCanvasElement;
  const previewCanvas = rootElement.querySelector(".preview") as HTMLCanvasElement;

  // const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * game.field.grid.columns;
  canvas.height = cellSize * game.field.grid.rows;

  previewCanvas.width = cellSize * previewSize.columns;
  previewCanvas.height = cellSize * previewSize.rows;

  const redraw = () => {
    draw(game, canvas, previewCanvas, cellSize);
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