import Clarity from '../engine';

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
  window.requestAnimFrame(Loop);
};

game.update();

Loop();
