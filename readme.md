# Lucid

Lucid is a 2D Javascript game-engine, primarily for the platforming genre. Heavily based on the game-engine Dissimulate posted on both [GitHub](https://github.com/dissimulate/Clarity) and [CodePen](https://codepen.io/dissimulate/pen/CqIxk). It's quite evolved from that engine though, as things are much more broken apart now, and easier to extend onto.

There are a handful of [code examples](https://github.com/dinubs/lucid) and examples you can [play](https://lucid.dinubs.now.sh).

# Install and Use

You can install the engine with `npm install lucid-game-engine`. Then you can use the package like the below.

```
import { Lucid, Map, Block } from 'lucid-game-engine';

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

class MyCustomMap extends Map {
  constructor() {
    super({
      backgroundColor: "#4e4e4e",
      tileSize: 29,
      playerStart: {
        x: 1,
        y: 2
      },
      movementSpeed: {
        jump: 8,
        horizontal: 1
      }
    });

    // Load the blocks so the engine knows which one to render
    // based on the map data.
    this.blocks = [Block];

    // mapData signifies to the engine what blocks to render where.
    // An empty space will render an EmptyBlock.
    this.mapData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, , , , , , , , , , , , , , , , , , 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }
}

game.loadMap(new MyCustomMap());

Loop();
```

I personally suggest using [Parcel](https://parceljs.org/) to get things up and running, it's very straight forward. You can also find more examples in the examples directory, and run them using `npm run example` when you clone the repo (it uses Parcel to run).


# TODO

- [ ] Rename Map to something else, realized a little late that Map is a reserved keyword in JS
- [ ] Particle engine
- [ ] Entities (Think NPCs and enemies that the player can interact with).
- [ ] Allow adding a custom player class to the game, will be easy to do, but forgot to integrate it.
- [ ] Allow setting a custom EmptyBlock per map, that way you can do any custom rendering on the block you want.
- [ ] Add more information to the readme.

If you want to tackle any of the above TODO items, please open a pull request, I'd gladly review it :D
