# [WIP] Tetris

Tetris game in vanilla TS & HTML5 canvas ✨

🚨 🚧 This project is currently a work-in-progress 🚧 🚨

## Overview

## TODO
- [x] Setup basic grid & add randomly colour cells
- [x] Structure
  - [x] Rewrite Grid.map as an iterator
  - [x] Encapsulate game logic into class
- [ ] Functionality
  - [ ] Falling tetrominoes
    - [x] One
      - [x] Randomly generate
      - [x] Collide with field boundary
    - [x] Multiple
      - [x] Randomly generate
      - [x] Collide with pieces/field boundary
    - [x] Lateral movement
      - [x] Basic functionality (with simple button)
      - [x] Redraw after moving
      - [x] Must stay within field
      - [x] Must not move over another piece
      - [x] Bind to keyboard
    - [x] Rotation
      - [x] Basic functionality
      - [x] Can't rotate out of field
      - [x] Must not rotate into another piece
      - [x] Kicks off wall/other pieces
    - [x] Always spawn in middle (deviating left if exact middle not possible)
    - [x] Drop (acceleration)
      - [x] Soft drop
      - [x] Hard drop
  - [x] Clear completed lines
      - [x] Triggered when gravity is applied and tetromino can't move down
      - [x] Clear completed lines
      - [x] Drop stack down
  - [ ] Game over check (when tetromino can't enter field)
  - [ ] Preview next tetromino
  - [ ] Levels of increasing speed
  - [ ] Scoring based upon number of lines clear & acceleration
  - [ ] Stats
- [ ] Readme
- [ ] Github pages demo
- [ ] Formatting (prettier/eslint?)