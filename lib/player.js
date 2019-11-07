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
  }

  resetVelocity() {
    this.setVelocity(0, 0);
  }

  setVelocity(x, y) {
    this.velocity = { x, y };
  }

  move() {

  }

  update() {
    const keys = this.game.keys;
    const map = this.game.currentMap;
    if (keys.left) {
      if (this.player.vel.x < map.velocityLimits.x) {
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
