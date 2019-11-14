// This map shows off the killer custom rendering styles
// you can achieve with Lucid.

// Import Block and Map, in yours this would be
// import { Block, Map } from 'lucid-game-engine';
import { Block, Map } from '../../../lib';

// Create a basic block that will kill you when you enter it
class KillerBlock extends Block {
  constructor(game) {
    super(game);

    // For scripts to work the block must not be a solid block
    this.solid = false;
  }

  // This can be as complex as you want, but in this case
  // it's just going to reset the map, and put the player at the start
  script() {
    this.game.resetMap();
  }
}

// SpikeBlock has a custom draw function, makes it look like a spike
class SpikeBlock extends KillerBlock {
  constructor(game) {
    super(game);
    // Change the color to make things easier.
    this.color = "#6d6d6d";
  }

  // The draw functions accept a pixel x-coordinate, pixel y-coordinate and
  // the canvas context.
  draw(x, y, context) {
    // We want the tileSize to know how tall and wide to make the spike
    const tileSize = this.game.currentMap.tileSize;
    context.fillStyle = this.color;

    // This is a basic triangle function, but it can be as complex as you want.
    context.beginPath();
    context.moveTo(x + tileSize, y + tileSize);
    context.lineTo(x, y + tileSize);
    context.lineTo(x + (tileSize / 2), y + (tileSize / 4));
    context.fill();
  }
}

// Lava block is a normal KillerBlock but it's color is red instead of the default
class LavaBlock extends KillerBlock {
  constructor(game) {
    super(game);
    this.solid = false;
    this.color = '#ad0000';
  }
}

// RainbowBlock extends a normal block and does something fancy when
// the player goes inside it.
class RainbowBlock extends Block {
  constructor(game) {
    super(game);

    this.solid = false;
    this.jump = false;
  }

  // Draw a rainbow in the tile, hate to say, but I copied this
  // from a stack overflow answer. Thanks user1693593!
  // https://stackoverflow.com/questions/37700784/drawing-a-rainbow-with-canvas-and-javascript
  draw(x, y, context) {
    const tileSize = this.game.currentMap.tileSize;
    const halfTileSize = tileSize / 2;
    const bars = 4;
    let radius = halfTileSize;
    context.lineWidth = 3;

    for (let i = 0; i < bars; i++ , radius -= context.lineWidth - 1) { // increase bar, reduce radius
      context.beginPath();
      context.arc(x + halfTileSize, y + tileSize, radius, 0, Math.PI, true); // half circle
      context.strokeStyle = `hsl(${i / bars * 300},90%,50%)`;  // set color using HSL
      context.stroke();
    }
  }

  // Change the current map background color to random color :D
  script() {
    this.game.currentMap.backgroundColor = `hsl(${(Math.random() * 360)},30%,60%)`;
  }
}


class KillerBlocksMap extends Map {
  constructor() {
    super({
      backgroundColor: "#4e4e4e",
      tileSize: 29,
      playerStart: {
        x: 1,
        y: 3
      },
      movementSpeed: {
        jump: 8,
        horizontal: 0.5
      }
    });

    this.blocks = [Block, SpikeBlock, LavaBlock, RainbowBlock];

    this.mapData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , 1, , , 0, 2, 2, 2, 0, , , , 3, , 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }
}

export default KillerBlocksMap;
