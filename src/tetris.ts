import hotkeys from "hotkeys-js";

import { Game } from "./game";
import { Direction } from "./position";
import { draw } from "./ui";


export default function setupTetris(domId: string) {
  const cellSize = 40;;

  const createGame = () => {
    return new Game({
      rows: 20,
      columns: 10
    })
  }

  let game: Game = createGame();

  const previewSize = {
    rows: 2,
    columns: 4
  }

  const rootElement = document.getElementById(domId)!;
  const canvas = rootElement.querySelector(".field") as HTMLCanvasElement;
  const previewCanvas = rootElement.querySelector(".preview canvas") as HTMLCanvasElement;
  const holdCanvas = rootElement.querySelector(".hold canvas") as HTMLCanvasElement;

  // const canvas = document.getElementById(domId) as HTMLCanvasElement;

  canvas.width = cellSize * game.field.grid.columns;
  canvas.height = cellSize * game.field.grid.rows;

  previewCanvas.width = cellSize * previewSize.columns;
  previewCanvas.height = cellSize * previewSize.rows;

  holdCanvas.width = cellSize * previewSize.columns;
  holdCanvas.height = cellSize * previewSize.rows;

  const redraw = () => {
    draw(game, canvas, previewCanvas, holdCanvas, cellSize);
  }

  setInterval(() => {
    redraw();

    game.applyGravity();

    if (game.gameOver) {
      alert("Game over :(\nPress ok to start a new game");
      game = createGame();
    }
  }, 500);

  const keyboardActions = new Map([
    ["left", () => game.attemptMove(Direction.Left)],
    ["right", () => game.attemptMove(Direction.Right)],
    ["up", () => game.attemptRotateRight()],
    ["down", () => game.attemptMove(Direction.Down)],
    ["space", () => game.hardDrop()],
    ["shift,h", () => game.attemptHold()],
    ["n", () => { game = createGame() }],
  ]);

  for (const [shortcut, actionFn] of keyboardActions.entries()) {
    hotkeys(shortcut, event => {
      event.preventDefault();
      actionFn();
      redraw();
    });
  }

}