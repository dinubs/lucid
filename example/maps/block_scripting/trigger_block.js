import Block from '../../../lib/blocks/block';

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

export default TriggerBlock;
