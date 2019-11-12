// Constants
import {
  LEFT,
  UP,
  RIGHT,
  LEFT_LETTER,
  UP_LETTER,
  RIGHT_LETTER,
  LEFT_ARROW,
  UP_ARROW,
  RIGHT_ARROW
} from './constants/keys';

// Models
import Player from './player.js';
import EmptyBlock from './blocks/empty_block';

class Circular {
  constructor({
    alertErrors = false,
    canvas,
    customPlayerClass,
    jumpSwitch = 0,
    limitViewport = false,
    logInfo = false,
    tileSize = 16,
    viewport = {
      x: 200,
      y: 200,
    }
  }) {
    if (!canvas) {
      this.error('Canvas must be passed in');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.alertErrors = alertErrors;
    this.logInfo = logInfo;
    this.tileSize = tileSize;
    this.limitViewport = limitViewport;
    this.jumpSwitch = jumpSwitch
    this.currentMap = null;

    this.viewport = viewport;

    this.camera = {
      x: 0,
      y: 0,
    };

    this.key = {
      left: false,
      right: false,
      up: false,
    };

    this.player = new (customPlayerClass || Player)(this);

    window.onkeydown = this.keydown.bind(this);
    window.onkeyup = this.keyup.bind(this);
  }

  error(message) {
    if (this.alertErrors) {
      alert(message);
    }
    if (this.logInfo) {
      console.error(message);
    }
  }

  log(message) {
    if (this.logInfo) {
      console.log(message);
    }
  }

  setViewport(x, y) {
    this.viewport = {
      x,
      y,
    };
  }

  keydown(e) {
    switch (e.keyCode) {
      case LEFT_ARROW:
      case LEFT_LETTER:
        this.key.left = true;
        break;
      case UP_ARROW:
      case UP_LETTER:
        this.key.up = true;
        break;
      case RIGHT_ARROW:
      case RIGHT_LETTER:
        this.key.right = true;
    }
  }

  keyup(e) {
    switch (e.keyCode) {
      case LEFT_ARROW:
      case LEFT_LETTER:
        this.key.left = false;
        break;
      case UP_ARROW:
      case UP_LETTER:
        this.key.up = false;
        break;
      case RIGHT_ARROW:
      case RIGHT_LETTER:
        this.key.right = false;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.viewport.x, this.viewport.y);
    this.currentMap.draw(this);
    this.player.draw();
  }

  loadMap(map) {
    if (typeof map === 'undefined' || typeof map.mapData === 'undefined' || typeof map.blocks === 'undefined') {
      this.error('Invalid map data');
      return false;
    }

    this.currentMap = map;

    let proposedWidth = 0;

    map.data = map.mapData.map((row) => {
      proposedWidth = Math.max(proposedWidth, row.length);

      return row.map((blockIndex) => {
        return new map.blocks[blockIndex](this);
      });
    });

    this.currentMap.height = map.data.length;
    this.currentMap.width = proposedWidth;

    this.resetKeys();
    this.resetCamera();
    this.player.setLocation(map.playerStart.x * map.tileSize, map.playerStart.y * map.tileSize);
    this.player.setVelocity(0, 0);

    return true;
  }

  resetCamera() {
    this.setCamera(0, 0);
  }

  setCamera(x, y) {
    this.camera = { x, y };
  }

  resetKeys() {
    this.key.left = false;
    this.key.up = false;
    this.key.down = false;
  }

  setJumpSwitch(jumpSwitch) {
    this.jumpSwitch = jumpSwitch;
  }

  /**
   * @param {Integer} x
   * @param {Integer} y
   * @returns {Block|undefined}
   */
  getBlock(x, y) {
    const map = this.currentMap;
    const row = map.data[y];
    if (row && row[x]) {
      return row[x];
    }

    return new EmptyBlock(this);
  }

  /**
   * Only update the player and camera for now, that's all that's necessary.
   * TODO: Determine if need to loop through all entities and update them
   */
  update() {
    if (!this.currentMap) {
      this.error('Cannot call update without a map set.');
      return false;
    }

    this.player.update();
    this.updateCamera();
    return true;
  }

  updateCamera() {
    const cameraX = Math.round(this.player.location.x - this.viewport.x / 2);
    const cameraY = Math.round(this.player.location.y - this.viewport.y / 2);
    const cameraDiffX = Math.abs(cameraX - this.camera.x);
    const cameraDiffY = Math.abs(cameraY - this.camera.y);

    if (cameraDiffX > 5) {
      const magnitude = Math.round(Math.max(1, cameraDiffX * 0.3));
      if (cameraDiffX != this.camera.x) {
        this.camera.x += cameraX > this.camera.x ? magnitude : -magnitude;

        if (this.limitViewport) {
          this.camera.x = Math.min(this.currentMap.widthInPixels() - this.viewport.x + this.currentMap.tileSize, this.camera.x);
          this.camera.x = Math.max(0, this.camera.x);
        }
      }
    }

    if (cameraDiffY > 5) {
      const magnitude = Math.round(Math.max(1, cameraDiffY * 0.3));
      if (cameraDiffY != this.camera.y) {
        this.camera.y += cameraY > this.camera.y ? magnitude : -magnitude;

        if (this.limitViewport) {
          this.camera.y = Math.min(this.currentMap.heightInPixels() - this.viewport.y + this.currentMap.tileSize, this.camera.y);
          this.camera.y = Math.max(0, this.camera.y);
        }
      }
    }
  }
}

export default Circular;
