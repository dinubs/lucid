import Block from "../../../lib/blocks/block";
import Map from "../../../lib/map";

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

    this.blocks = [Block, SpikeBlock, LavaBlock];

    this.mapData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , 1, , , 0, 2, 2, 2, 0, , , , , , 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }
}

export default KillerBlocksMap;
