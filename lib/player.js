class Player {
  constructor(game) {
    this.game = game;

    this.location = {
      x: 0,
      y: 0,
    }

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.canJump = true;
    this.onFloor = false;
  }

  resetVelocity() {
    this.setVelocity(0, 0);
  }

  setVelocity(x, y) {
    this.velocity = { x, y };
  }

  draw() {

  }

  move() {
    const map = this.game.currentMap;
    const tileSize = map.tileSize;
    const blockX = this.location.x + this.velocity.x;
    const blockY = this.location.y + this.velocity.y;

    const offset = Math.round((tileSize / 2) - 1);
    const block = this.game.getBlock(
      Math.round(this.location.x / tileSize),
      Math.round(this.location.y / tileSize)
    );

    this.applyBlockForces(block);

    const blockUpIndex = Math.floor(blockY / tileSize);
    const blockDownIndex = Math.ceil(blockY / tileSize);
    const blockNearUpIndex = Math.round((this.location.y - offset) / tileSize);
    const blockNearDownIndex = Math.round((this.location.y + offset) / tileSize);

    const blockLeftIndex = Math.floor(blockX / tileSize);
    const blockRightIndex = Math.ceil(blockX / tileSize);
    const blockNearLeftIndex = Math.round((this.location.x - offset) / tileSize);
    const blockNearRightIndex = Math.round((this.location.x + offset) / tileSize);


  }

  /**
   * Applies gravity from the current loaded map
   */
  applyMapGravity() {
    const map = this.game.currentMap;
    this.velocity.x += map.gravity.x;
    this.velocity.y += map.gravity.y;
  }

  /**
   * Applies gravity from the current block the player is on
   */
  applyBlockForces(block) {
    if (!block) {
      this.applyMapGravity();
      return;
    }

    if (block.gravity) {
      this.velocity.x += block.gravity.x;
      this.velocity.y += block.gravity.y;
    } else {
      this.applyMapGravity();
    }

    if (block.friction) {
      this.velocity.x *= block.friction.x;
      this.velocity.y *= block.friction.y;
    }
  }

  update() {
    const keys = this.game.keys;
    const map = this.game.currentMap;
    if (keys.left) {
      if (this.velocity.x < map.velocityLimits.x) {
        this.velocity.x += map.movementSpeed.horizontal;
      }
    }

    if (keys.up) {
      if (this.canJump && this.velocity.y > -map.velocityLimits.y) {
        this.velocity -= map.movementSpeed.jump;
        this.player.canJump = false;
      }
    }

    if (keys.right) {
      if (this.velocity.x < map.velocityLimits.x) {
        this.velocity.x += map.movementSpeed.horizontal;
      }
    }

    this.move();
  }
}

export default Player;
