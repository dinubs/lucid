class Map {
  constructor({
    backgroundColor = 'transparent',
    tileSize = 16,
    gravity = {
      x: 0,
      y: 0.3,
    },
    velocityLimits = {
      x: 6,
      y: 13
    },
    movementSpeed = {
      jump: 6,
      horizontal: 1
    },
    mapData = [],
    playerStart = {
      x: 1,
      y: 1,
    }
  }) {
    this.backgroundColor = backgroundColor;
    this.tileSize = tileSize;
    this.blocks = [];

    this.setGravity(gravity.x, gravity.y);
    this.velocityLimits = velocityLimits;
    this.movementSpeed = movementSpeed;

    this.mapData = mapData;
    this.playerStart = playerStart;

    // To be set by the loadMap function in engine
    this.width = null;
    this.height = null;
  }

  drawBlocks(game, fore) {
    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y];
      const tileY = (y * this.tileSize) - game.camera.y;

      // Continue on if haven't reached the viewport yet
      if (tileY < -this.tileSize) {
        continue;
      }
      // Break out of loop if extended past the viewport
      else if (tileY > game.viewport.y) {
        break;
      }

      for (let x = 0; x < row.length; x++) {
        const block = game.getBlock(x, y);
        const tileX = (x * this.tileSize) - game.camera.x;

        // Continue on if haven't reached the viewport yet
        if (tileX < -this.tileSize) {
          continue;
        }
        // Break row loop if extended past the viewport
        else if (tileX > game.viewport.x) {
          break;
        }

        // When the fores match each other is when we draw the block
        if ((
          !fore && !block.fore
        ) || (
            fore && block.fore
          )) {
          block.draw(tileX, tileY, game.ctx);
        }
      }
    }
  }

  draw(game) {
    game.ctx.fillStyle = this.backgroundColor;
    game.ctx.fillRect(0, 0, game.viewport.x, game.viewport.y);
    this.drawBlocks(game, false);
    this.drawBlocks(game, true);
  }

  /**
   * @returns {Integer} Total width of the map in pixels
   */
  widthInPixels() {
    return this.width * this.tileSize;
  }

  /**
   * @returns {Integer} Total height of the map in pixels
   */
  heightInPixels() {
    return this.height * this.tileSize;
  }

  /**
   * @param {Integer} x Proposed force of the horizontal gravity
   * @param {Integer} y Proposed force of the vertical gravity
   */
  setGravity(x, y) {
    this.gravity = {
      x,
      y,
    }
  }
}

export default Map;
