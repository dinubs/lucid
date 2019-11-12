import Block from '../../../lib/blocks/block';
import Map from '../../../lib/map';

class BasicPlatformerMap extends Map {
  constructor() {
    super({
      backgroundColor: '#4e4e4e',
      tileSize: 29,
      playerStart: {
        x: 1,
        y: 3,
      }
    });

    this.blocks = [
      Block,
    ];

    this.mapData = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, , , , , , 0],
      [0, , , , , , 0],
      [0, , , , , , 0],
      [0, , , , , , 0],
      [0, , , , , , 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
  }
}

export default BasicPlatformerMap;
