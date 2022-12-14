# [WIP] Tetris

Tetris game in vanilla TS & HTML5 canvas ✨

🚨 🚧 This project is currently a work-in-progress 🚧 🚨

## Overview

## Demo
Checkout the [live demo](https://bm9k.github.io/tetris)

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
  - [ ] Game state
    - [x] Game over alert
    - [x] New game
    - [ ] Pause game
  - [x] Ghost piece
    - [x] Same as tetromino (when landed)
    - [x] Different graphic
  - [x] Preview next tetromino
    - [x] Static preview box
    - [x] Working preview box
  - [x] Random generator
    - [x] 7 bag (see https://tetris.fandom.com/wiki/Random_Generator)
  - [x] Hold piece
      - [x] Static hold box
      - [x] Saves current tetromino
      - [x] Spawns new piece (if nothing was held)
      - [x] Resets previously held piece to top (as if newly spawned)
      - [x] Can't use hold again until piece locks
  - [x] Scoring based upon number of lines clear & acceleration
  - [ ] Load/save
  - [ ] Levels of increasing speed
  - [ ] Stats
- [ ] Readme
- [x] Github pages demo
  - [x] Deploy script
  - [ ] Favicon
  - [ ] Github banner/corner
  - [ ] Make it look nice
- [ ] Formatting (prettier/eslint?)
- [ ] Graphics
  - [x] Basic bevel
  - [ ] Layout