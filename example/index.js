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

canvas.width = 400;
canvas.height = 400;

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

  script(game, player) {
    game.currentMap.setGravity(0, -0.3);
  }
}

var Loop = function () {
  game.update();
  game.draw();
  window.requestAnimFrame(Loop);
};

class MyMap extends Map {
  constructor() {
    super({});

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
