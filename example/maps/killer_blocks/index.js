import { Block, Map } from '../../../lib';

class KillerBlock extends Block {
  constructor(game) {
    super(game);
    this.solid = false;
  }

  script() {
    this.game.resetMap();
  }
}

class SpikeBlock extends KillerBlock {
  constructor(game) {
    super(game);
    this.color = "#6d6d6d";
  }

  draw(x, y, context) {
    const tileSize = this.game.currentMap.tileSize;
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(x + tileSize, y + tileSize);
    context.lineTo(x, y + tileSize);
    context.lineTo(x + (tileSize / 2), y + (tileSize / 4));
    context.fill();
  }
}

class LavaBlock extends KillerBlock {
  constructor(game) {
    super(game);
    this.solid = false;
    this.color = '#ad0000';
  }
}

class RainbowBlock extends Block {
  constructor(game) {
    super(game);

    this.solid = false;
    this.jump = false;
  }

  draw(x, y, context) {
    const tileSize = this.game.currentMap.tileSize;
    const halfTileSize = tileSize / 2;
    const bars = 4;
    let radius = halfTileSize;
    context.lineWidth = 3;

    for (let i = 0; i < bars; i++ , radius -= context.lineWidth - 1) {      // increase bar, reduce radius
      context.beginPath();
      context.arc(x + halfTileSize, y + tileSize, radius, 0, Math.PI, true); // half circle
      context.strokeStyle = `hsl(${i / bars * 300},90%,50%)`;  // set color using HSL
      context.stroke();
    }
  }

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
