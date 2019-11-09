import Clarity from '../lib/engine';
import Map from '../lib/map';
import Block from '../lib/blocks/block';

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  };

var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var game = new Clarity({
  alertErrors: true,
  canvas,
  logInfo: true,
});

class TriggerBlock extends Block {
  constructor(game) {
    super(game);

    this.solid = false;
    this.color = '#bada55';
  }

  script(game) {
    game.currentMap.setGravity(0, -0.3);
  }
}

var Loop = function () {
  game.setViewport(canvas.width, canvas.height);
  game.update();
  game.draw();
  window.requestAnimFrame(Loop);
};

class MyMap extends Map {
  constructor() {
    super({
      backgroundColor: '#3e3e3e',
      tileSize: 29,
    });

    this.blocks = [
      Block,
      TriggerBlock
    ];

    this.mapData = [
      [],
      [],
      [],
      [, , 1],
      [0, 0, 0],
    ]
  }
}

game.loadMap(new MyMap());

Loop();
