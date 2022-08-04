import hotkeys from "hotkeys-js";

import { Game } from "./game";
import { Direction } from "./position";
import { draw, CanvasWidgets, Widgets } from "./ui";

export default function setupTetris(domId: string) {
  const cellSize = 40;

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

  const elements: Widgets = {
    root: rootElement as HTMLDivElement,
    field: rootElement.querySelector(".field")!,
    preview: rootElement.querySelector(".preview canvas")!,
    hold: rootElement.querySelector(".hold canvas")!,
    score: rootElement.querySelector(".score-value")!
  }
  
  const canvasSizes: Record<keyof CanvasWidgets, {rows: number, columns: number}> = {
    field: game.field,
    preview: previewSize,
    hold: previewSize
  }

  for (const [widgetName, size] of Object.entries(canvasSizes)) {
    const element = elements[widgetName as keyof CanvasWidgets];
    element.width = cellSize * size.columns;
    element.height = cellSize * size.rows;
  }

  const redraw = () => {
    draw(game, elements, cellSize);
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