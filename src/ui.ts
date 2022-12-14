import { addPositions, Position2D } from "./position";
import { Game } from "./game";

const BEVEL_OPACITY = 0.4;

const TOP_BEVEL_COLOUR = `rgba(255,255,255,${BEVEL_OPACITY})`;
const LEFT_BEVEL_COLOUR = `rgba(255,255,255,${BEVEL_OPACITY})`;
const BOTTOM_BEVEL_COLOUR = `rgba(63,63,63,${BEVEL_OPACITY})`;
const RIGHT_BEVEL_COLOUR = `rgba(63,63,63,${BEVEL_OPACITY})`;

const BEVEL_COLOURS = [
  TOP_BEVEL_COLOUR,
  LEFT_BEVEL_COLOUR,
  BOTTOM_BEVEL_COLOUR,
  RIGHT_BEVEL_COLOUR
]

const GHOST_OPACITY = .33;
const TETROMINO_OPACITY = 1;

export type CanvasWidgets = {
  field: HTMLCanvasElement,
  preview: HTMLCanvasElement,
  hold: HTMLCanvasElement,
}

export type Widgets = CanvasWidgets & {
  root: HTMLDivElement,
  score: HTMLSpanElement
}

export function draw(game: Game, elements: Widgets, cellSize: number) {
  const { field, next } = game;

  const canvases: (keyof CanvasWidgets)[] = ["field", "preview", "hold"];
  const contexts = canvases.reduce((contexts, widgetName) => {
    const element = elements[widgetName];
    const context = element.getContext("2d")!;

    context.clearRect(0, 0, element.width, element.height);

    contexts[widgetName] = context;
    return contexts;
  }, {} as Record<keyof CanvasWidgets, CanvasRenderingContext2D>);

  // TODO: these probably should be split into separate functions, but they're ok all in here at the moment because the code is still quite readable

  // draw field
  for (const [i, j, value] of field.entries(v => !!v)) {
    drawBlock(contexts.field, { i, j }, value, cellSize);
  }

  // draw ghost
  contexts.field.globalAlpha = GHOST_OPACITY;
  for (const [i, j] of next.type.shape.keys(v => !!v)) {
    drawBlock(contexts.field, addPositions(game.ghostPosition, { i, j }), next.type.colour, cellSize);
  }
  contexts.field.globalAlpha = TETROMINO_OPACITY;

  // draw next tetromino
  for (const [i, j] of next.type.shape.keys(v => !!v)) {
    drawBlock(contexts.field, addPositions(next.position, { i, j }), next.type.colour, cellSize);
  }

  // draw preview
  const preview = game.previewTetromino()
  for (const [i, j] of preview.shape.keys(v => !!v)) {
    drawBlock(contexts.preview, addPositions({ i: 0, j: 0 }, { i, j }), preview.colour, cellSize);
  }

  // draw held piece
  if (game.activeHold) {
    for (const [i, j] of game.activeHold.shape.keys(v => !!v)) {
      drawBlock(contexts.hold, addPositions({ i: 0, j: 0 }, { i, j }), game.activeHold.colour, cellSize);
    }
  }

  // update score
  elements.score.innerHTML = `${game.score.score}`;
}

export function drawBlock(context: CanvasRenderingContext2D, { i, j }: Position2D, colour: string, cellSize: number) {
  context.fillStyle = colour;

  const x0 = j * cellSize;
  const y0 = i * cellSize;

  context.fillRect(x0, y0, cellSize, cellSize);

  const x1 = x0 + cellSize;
  const y1 = y0 + cellSize;

  // TODO: should probably abstract this
  const bevelPadding = Math.floor(cellSize * .125);

  const xOuter = [x0, x1];
  const yOuter = [y0, y1];
  const xInner = [
    x0 + bevelPadding,
    x1 - bevelPadding
  ];
  const yInner = [
    y0 + bevelPadding,
    y1 - bevelPadding
  ];

  // ith left rotation from top
  // 0: top, 1: left, 2: bottom, 3: right
  for (let i = 0; i < 4; i++) {
    const msb = (i / 2) >> 0;
    const lsb = i % 2;
    const xor = msb ^ lsb;
    const xnor = 1 - xor;

    // draw ith bevel
    context.fillStyle = BEVEL_COLOURS[i];
    context.beginPath();
    context.lineTo(xOuter[msb], yOuter[xor]);
    context.lineTo(xInner[msb], yInner[xor]);
    context.lineTo(xInner[xnor], yInner[msb]);
    context.lineTo(xOuter[xnor], yOuter[msb]);
    context.lineTo(xOuter[msb], yOuter[xor]);
    context.closePath();
    context.fill();
  }
}