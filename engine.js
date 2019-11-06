// Constants
import {
  LEFT,
  UP,
  RIGHT
} from './constants/keys';

// Models
import Player from './player.js';

// TODO: Make Map class
// TODO: Make Player class
// TODO: Make Block class

class Circular {
  constructor({
    tileSize = 16,
    limitViewport = false,
    jumpSwitch = 0,
  }) {
    this.logInfo = true;
    this.tileSize = tileSize;
    this.limitViewport = limitViewport;
    this.jumpSwitch = jumpSwitch
    this.currentMap = null;

    this.viewport = {
      x: 200,
      y: 200,
    };

    this.camera = {
      x: 0,
      y: 0,
    };

    this.key = {
      left: false,
      right: false,
      up: false,
    };

    this.player = new Player();

    window.onkeydown = this.keydown.bind(this);
    window.onkeyup = this.keyup.bind(this);
  }

  error(message) {
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
      case LEFT:
        this.key.left = true;
        break;
      case UP:
        this.key.up = true;
        break;
      case RIGHT:
        this.key.right = true;
    }
  }

  keyup(e) {
    switch (e.keyCode) {
      case LEFT:
        this.key.left = false;
        break;
      case UP:
        this.key.up = false;
        break;
      case RIGHT:
        this.key.right = false;
    }
  }

  loadMap(map) {
    if (typeof map === 'undefined' || typeof map.data === 'undefined' || typeof map.keys === 'undefined') {
      this.error('Error: Invalid map data');
      return false;
    }

    this.currentMap = map;

    const blockHash = map.keys.reduce((hash, key) => {
      hash[key.id] = key;
      return hash
    }, {});

    let proposedWidth = 0;

    map.data = map.data.map((row) => {
      proposedWidth = Math.max(proposedWidth, row.length);

      return row.map((tile) => {
        return blockHash[tile.id];
      });
    });

    this.currentMap.height = map.data.length;
    this.currentMap.width = proposedWidth;
  }
}

export default Circular;
