import { Block, Map } from '../../../lib';

class TriggerBlock extends Block {
  constructor(game) {
    super(game);

    this.solid = false;
    this.color = '#bada55';
  }

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
