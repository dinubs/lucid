class Block {
  constructor(game) {
    this.game = game;
    this.color = '#333';
    this.bounce = 0;
    this.gravity = null;
    this.friction = null;
  }

  draw(x, y, context) {
    const map = this.game.currentMap;
    context.fillStyle = this.color;
    context.fillRect(
        x,
        y,
        map.tileSize,
        map.tileSize
    );
  }
}

export default Block;
