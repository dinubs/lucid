class Map {
  constructor({
    tileSize = 16,
    gravity = {
      x: 0,
      y: 0.3,
    },
    velocityLimits = {
      x: 2,
      y: 13
    },
    movementSpeed = {
      jump: 6,
      horizontal: 0.3
    },
    mapData = [],
    playerStart = {
      x: 1,
      y: 1,
    }
  }) {
    this.tileSize = tileSize;
    this.blocks = [];

    this.gravity = gravity;
    this.velocityLimits = velocityLimits;
    this.movementSpeed = movementSpeed;

    this.mapData = mapData;
    this.playerStart = playerStart;
  }

  draw(game, fore) {
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
        const block = row[x];
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

    if (!fore) this.draw(game, true);
  }
}

export default Map;
