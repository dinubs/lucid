// This map shows off a basic script function that you
// can implement in your map.

// Import Block and Map, in yours this would be
// import { Block, Map } from 'lucid-game-engine';
import { Block, Map } from '../../../lib';

// TriggerBlock is a pretty generic block name, 
// but it basically has a script trigger to it
// that reverses the gravity on it.
class TriggerBlock extends Block {
  constructor(game) {
    super(game);

    this.solid = false;
    this.color = '#bada55';
  }

  // Reverse the vertical gravity that's present
  script(game) {
    game.player.setVelocity(game.currentMap.gravity.y, 0);
    game.currentMap.setGravity(0, -game.currentMap.gravity.y);
  }
}

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
