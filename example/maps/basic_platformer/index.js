import Block from "../../../lib/blocks/block";
import Map from "../../../lib/map";

class JumpBlock extends Block {
  constructor(game) {
    super(game);
    this.solid = false;
    this.jump = true;
    this.color = "#5a5a5a";
  }
}

class AchievementBlock extends Block {
  constructor(game) {
    super(game);
    this.solid = false;
    this.color = "#eeff00";
    this.stroke = "#ccaa00";
  }

  draw(tx, ty, context) {
    const cx = tx + (this.game.currentMap.tileSize / 2);
    const cy = ty + (this.game.currentMap.tileSize / 2) + 2;
    const spikes = 5;
    const step = Math.PI / spikes;
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;

    const outerRadius = (this.game.currentMap.tileSize / 2) * .8;
    const innerRadius = (this.game.currentMap.tileSize / 2) * .4;

    context.beginPath();
    context.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      context.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      context.lineTo(x, y);
      rot += step;
    }
    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.lineWidth = 2;
    context.strokeStyle = this.stroke;
    context.stroke();
    context.fillStyle = this.color;
    context.fill();
  }

  script() {
    alert('Congratulations! You did it!');
    this.game.resetMap();
  }
}

class BasicPlatformerMap extends Map {
  constructor() {
    super({
      backgroundColor: "#4e4e4e",
      tileSize: 29,
      playerStart: {
        x: 1,
        y: 8
      },
      movementSpeed: {
        jump: 8,
        horizontal: 1
      }
    });

    this.blocks = [Block, JumpBlock, AchievementBlock];

    this.mapData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, , , , , , , , , , , 0, , , , , , 0],
      [0, 0, 0, , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , 0, 0, 1, 0],
      [0, , , , , , , 1, 0, 0, 0, , , , , 0, , , 0],
      [0, , , , , , , , , , , , , , 0, 0, , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , 0, 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , 0, 0, 0, , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }
}

export default BasicPlatformerMap;
