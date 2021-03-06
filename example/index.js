import { Lucid } from '../lib';
import maps from './maps';

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

var game = new Lucid({
  alertErrors: true,
  canvas,
  logInfo: true,
});

var Loop = function () {
  game.setViewport(canvas.width, canvas.height);
  game.update();
  game.draw();
  window.requestAnimFrame(Loop);
};

game.loadMap(new maps[0].map());

Loop();

const mapDropdown = document.getElementById('map-selector');

function setupMapDropdown() {
  const mapItems = maps.map(({ map, title }) => {
    const mapItem = document.createElement('button');
    mapItem.innerText = title;
    mapItem.onclick = function () {
      game.loadMap(new map());
    }
    return mapItem;
  });

  mapItems.forEach((item) => mapDropdown.appendChild(item));
}

setupMapDropdown();

const closeModal = document.getElementById('close-modal');
const openModal = document.getElementById('info-button');
const infoModal = document.getElementById('info-modal')

closeModal.onclick = function () {
  infoModal.classList.remove('active');
}

openModal.onclick = function () {
  infoModal.classList.add('active');
}
