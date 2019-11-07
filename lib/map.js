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
      horizontal = 0.3
    },
    mapData = [];
  }) {
    this.tileSize = tileSize;
    this.blocks = [];

    this.gravity = gravity;
    this.velocityLimits = velocityLimits;
    this.movementSpeed = movementSpeed;

    this.mapData = mapData;
  }
}

export default Map;
