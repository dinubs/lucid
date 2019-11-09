class Player {
  /**
   * Constructs a player that you can move around that map
   * @param {Clarity} game Instance of the game engine
   */
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

    this.velocityDampening = 0.9;

    this.canJump = true;
    this.onFloor = false;
    this.color = '#cc3700';
  }

  /**
   * @private
   * Updates the player's velocity
   * @param {Integer} x Horizontal velocity to be set
   * @param {Integer} y Vertical velocity to be set
   */
  setVelocity(x, y) {
    this.velocity = { x, y };
  }

  /**
   * Draws the player onto the map
   */
  draw() {
    const map = this.game.currentMap;
    const context = this.game.ctx;
    const { x, y } = this.location;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(
      x + map.tileSize / 2 - this.game.camera.x,
      y + map.tileSize / 2 - this.game.camera.y,
      map.tileSize / 2 - 1,
      0,
      Math.PI * 2
    );

    context.fill();
  }

  /**
   * Determines where to move the player to, and constrains the player
   * outside of blocks they aren't supposed to be able to move inside of.
   */
  move() {
    const game = this.game;
    const map = game.currentMap;
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

    const leftUpBlock = game.getBlock(blockLeftIndex, blockNearUpIndex);
    const leftDownBlock = game.getBlock(blockLeftIndex, blockNearDownIndex);
    const rightUpBlock = game.getBlock(blockRightIndex, blockNearUpIndex);
    const rightDownBlock = game.getBlock(blockRightIndex, blockNearDownIndex);

    const upLeftBlock = game.getBlock(blockNearLeftIndex, blockUpIndex);
    const upRightBlock = game.getBlock(blockNearRightIndex, blockUpIndex);
    const downLeftBlock = game.getBlock(blockNearLeftIndex, blockDownIndex);
    const downRightBlock = game.getBlock(blockNearRightIndex, blockDownIndex);

    if (block.jump && game.jumpSwitch > 15) {
      this.canJump = true;
      game.setJumpSwitch(0);
    } else {
      game.setJumpSwitch(game.jumpSwitch + 1);
    }

    this.velocity.x = Math.min(Math.max(this.velocity.x, -map.velocityLimits.x), map.velocityLimits.x);
    this.velocity.y = Math.min(Math.max(this.velocity.y, -map.velocityLimits.y), map.velocityLimits.y);

    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;

    this.velocity.x *= this.velocityDampening;

    // Check if horizontal blocks are solid
    if (leftUpBlock.solid || leftDownBlock.solid || rightUpBlock.solid || rightDownBlock.solid) {
      // Fix right overlap
      while (game.getBlock(Math.floor(this.location.x / tileSize), blockNearUpIndex).solid ||
        game.getBlock(Math.floor(this.location.x / tileSize), blockNearDownIndex).solid) {
        this.location.x += 0.1;
      }

      while (game.getBlock(Math.ceil(this.location.x / tileSize), blockNearUpIndex).solid ||
        game.getBlock(Math.ceil(this.location.x / tileSize), blockNearDownIndex).solid) {
        this.location.x -= 0.1;
      }

      let bounce = 0;
      [leftUpBlock, leftDownBlock, rightUpBlock, rightDownBlock].forEach((block) => {
        if (block.solid && block.bounce > bounce) {
          bounce = block.bounce;
        }
      });

      this.velocity.x *= -bounce;
    }

    // Check if vertical blocks are solid
    if (upLeftBlock.solid || upRightBlock.solid || downLeftBlock.solid || downRightBlock.solid) {
      while (game.getBlock(blockNearLeftIndex, Math.floor(this.location.y / tileSize)).solid ||
        game.getBlock(blockNearRightIndex, Math.floor(this.location.y / tileSize)).solid) {
        this.location.y += 0.1;
      }

      while (game.getBlock(blockNearLeftIndex, Math.ceil(this.location.y / tileSize)).solid ||
        game.getBlock(blockNearRightIndex, Math.ceil(this.location.y / tileSize)).solid) {
        this.location.y -= 0.1;
      }

      let bounce = 0;
      [upLeftBlock, upRightBlock, downLeftBlock, downRightBlock].forEach((block) => {
        if (block.solid && block.bounce > bounce) {
          bounce = block.bounce;
        }
      });

      this.velocity.y *= -bounce;

      if (downLeftBlock.solid || downRightBlock.solid) {
        this.onFloor = true;
        this.canJump = true;
      }
    }

    if (this.lastBlock != block && block.script) {
      block.script(game, this);
    }

    this.lastBlock = block;
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
   * @param {Block} block The current block to apply forces from
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

  /**
   * Updates the players velocity and gravity based on currently 
   * pressed keys, then calls move().
   */
  update() {
    const key = this.game.key;
    const map = this.game.currentMap;
    if (key.left) {
      if (this.velocity.x < map.velocityLimits.x) {
        this.velocity.x -= map.movementSpeed.horizontal;
      }
    }

    if (key.up) {
      if (this.canJump && this.velocity.y > -map.velocityLimits.y) {
        this.velocity.y -= map.movementSpeed.jump;
        this.canJump = false;
      }
    }

    if (key.right) {
      if (this.velocity.x < map.velocityLimits.x) {
        this.velocity.x += map.movementSpeed.horizontal;
      }
    }

    this.move();
  }
}

export default Player;
