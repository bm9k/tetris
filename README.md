# [WIP] Tetris

Tetris game in vanilla JS & HTML5 canvas ✨

🚨 🚧 This project is currently a work-in-progress 🚧 🚨

## Overview

## TODO
- [x] Setup basic grid & add randomly colour cells
- [x] Structure
  - [x] Rewrite Grid.map as an iterator
  - [ ] Encapsulate game logic into class
- [ ] Functionality
  - [ ] Falling tetriminoes
    - [x] One
      - [x] Randomly generate
      - [x] Collide with field boundary
    - [x] Multiple
      - [x] Randomly generate
      - [x] Collide with pieces/field boundary
    - [ ] Lateral movement
      - [x] Basic functionality (with simple button)
      - [x] Redraw after moving
      - [x] Must stay within field
      - [x] Must not move over another piece
      - [ ] Bind to keyboard
    - [ ] Rotation
    - [ ] Acceleration
  - [ ] Clear completed lines
  - [ ] Game over check (when tetrimino can't enter field)
  - [ ] Preview next tetrimino
  - [ ] Levels of increasing speed
  - [ ] Scoring based upon number of lines clear & acceleration
  - [ ] Stats
- [ ] Readme
- [ ] Github pages demo
- [ ] Formatting (prettier/eslint?)