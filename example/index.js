import Clarity from '../lib/engine';
import Map from '../lib/map';
import Block from '../lib/block';

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
  canvas,
  limitViewport: true,
  logInfo: true,
});

var Loop = function () {
  game.draw();
  window.requestAnimFrame(Loop);
};

class MyMap extends Map {
  constructor() {
    super({ });

    this.blocks = [
      Block
    ];

    this.mapData = [
      [],
      [0, 0, 0],
    ]
  }
}

game.loadMap(new MyMap());

Loop();
