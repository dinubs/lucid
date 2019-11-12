import Block from '../../../lib/blocks/block';
import Map from '../../../lib/map';
import TriggerBlock from './trigger_block';

class BlockScriptingMap extends Map {
  constructor() {
    super({
      backgroundColor: '#4e4e4e',
      tileSize: 29,
      playerStart: {
        x: 1,
        y: 3,
      },
      movementSpeed: {
        jump: 6,
        horizontal: 10
      }
    });

    this.blocks = [
      Block,
      TriggerBlock
    ];

    this.mapData = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, , , , , 0],
      [0, , , , , , 0],
      [0, , , , , , 0],
      [0, , , , , , 0],
      [0, , , , , 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
  }
}

export default BlockScriptingMap;
