// This map shows off a very basic platforming level
// that also has a final block that shows a
// congratulations message.

// Import Block and Map, in yours this would be
// import { Block, Map } from 'lucid-game-engine';
import { Block, Map } from '../../../lib';

// JumpBlock is a non-solid block that allows
// the player to jump while they are inside of it.
// Think of it as a jump-reset block.
class JumpBlock extends Block {
  constructor(game) {
    super(game);
    this.solid = false; // Make the block non-solid
    this.jump = true; // This allows the player to jump while inside it.
    this.color = "#5a5a5a"; // Change the color to differentiate it from the background of the map
  }
}

// AchievementBlock is a block that shows a
// message and then resets the game when 
// the player goes inside of it.
class AchievementBlock extends Block {
  constructor(game) {
    super(game);
    this.solid = false;
    this.color = "#eeff00";
    this.stroke = "#ccaa00";
  }

  // Draw a star to signify where the end of
  // the level is. Copied this from a stack overflow
  // answer. Thanks markE and Andrei Volgin :D
  // https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
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

  // Alert the player that they did well, and reset the map
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

    // Load the blocks so the engine knows which one to render
    // based on the map data.
    this.blocks = [Block, JumpBlock, AchievementBlock];

    // mapData signifies to the engine what blocks to render where.
    // An empty space will render an EmptyBlock.
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
