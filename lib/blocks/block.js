class Block {
  /**
   * @param {Clarity} game Instance of the current game engine
   */
  constructor(game) {
    this.game = game;
    this.color = '#333';
    this.solid = true;
    this.jump = true;
    this.bounce = 0;
    this.gravity = null;
    this.friction = null;
    this.fore = true;
  }

  /**
   * @param {Integer} x X-Coordinate to draw the player at
   * @param {Integer} y Y-Coordinate to draw the player at
   * @param {CanvasRenderingContext2D} context Canvas context used to draw the player
   */
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
