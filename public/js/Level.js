import {res} from "./main.js";
import {loadTileSpriteSheet} from "./utils/SpriteSet.js";
import {loadJson} from "./utils/loadData.js";
import {Matrix} from "./utils/math.js";
import TileCollider from "./levels/TileCollider.js";

export default class Level {

  constructor(levelSpec, tileSet) {
    this.levelSpec = levelSpec;
    this.tileSet = tileSet;

    this.entities = new Set();
    this.tiles = this.createTiles(levelSpec.tiles);
    this.tileCollider = new TileCollider(this.tiles, tileSet);

    this.layers = [
      createBackgroundLayer(this, tileSet),
      createSpriteLayer(this.entities),
    ];

    this.totalTime = 0;
  }

  update(deltaTime) {
    this.totalTime += deltaTime;

    this.entities.forEach(entity => {
      entity.update(deltaTime);

      // Movement and collision checks
      entity.pos.x += entity.vel.x * deltaTime;
      this.tileCollider.checkX(entity);

      entity.pos.y += entity.vel.y * deltaTime;
      this.tileCollider.checkY(entity);
    });
  }

  draw(context, camera) {
    this.layers.forEach(drawLayer => {
      drawLayer(context, camera);
    });
  }

  createTiles(tileSpec) {
    const tiles = new Matrix();

    function applyRange(tileObj, xStart, xLength, yStart, yLength) {
      const xEnd = xStart + xLength;
      const yEnd = yStart + yLength;
      for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
          if (tileObj.pattern) {
            console.log(tileObj.pattern);
          } else {
            tiles.set(x, y, {
              name: tileObj.tile,
            });
          }
        }
      }
    }

    tileSpec.forEach((tileObj) => {
      tileObj.ranges.forEach((range) => {
        if (range.length === 4) {
          const [xStart, xLength, yStart, yLength] = range;
          applyRange(tileObj, xStart, xLength, yStart, yLength);
        } else if (range.length === 3) {
          const [xStart, xLength, yStart] = range;
          applyRange(tileObj, xStart, xLength, yStart, 1);
        } else if (range.length === 2) {
          const [xStart, yStart] = range;
          applyRange(tileObj, xStart, 1, yStart, 1);
        }
      });
    });

    return tiles;
  }

}

// Unsure about this
export function loadLevel(name) {
  return loadJson(`/levels/${name}.json`)
    .then(levelSpec => Promise.all([
      levelSpec,
      loadTileSpriteSheet(levelSpec.spriteSheet),
    ])).then(([levelSpec, levelTileSet]) => {
      const level = new Level(levelSpec, levelTileSet);
      return level;
    });
}


// Have layers seperately??????????/
function createSpriteLayer(entities, width = 64, height = 64) {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext('2d');

  return function drawSpriteLayer(context, camera) {
    entities.forEach((entity) => {
      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext);
      context.drawImage(spriteBuffer,
        entity.pos.x - camera.pos.x,
        entity.pos.y - camera.pos.y)
    });
  }
}

export function createBackgroundLayer(level, tileSet) {
  const tiles = level.tiles;

  const buffer = document.createElement('canvas');
  buffer.width = res.w;
  buffer.height = res.h;

  const context = buffer.getContext('2d');

  let startIndex, endIndex;
  function redraw(drawFrom, drawTo) {
    // if (drawFrom === startIndex && drawTo === endIndex) {
    //   return;
    // }

    startIndex = drawFrom;
    endIndex = drawTo;

    for (let x = drawFrom; x <= drawTo; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (tileSet.animations.has(tile.name)) {
            tileSet.drawTileAnim(tile.name, context, x - drawFrom, y, level.totalTime);
          } else {
            tileSet.drawTile(tile.name, context, x - drawFrom, y);
          }
        });
      }
    }
  }

  return function drawBackgroundLayer(context, camera) {
    // const drawWidth = tileResolver.toIndex(camera.size.x);
    // const drawFrom = tileResolver.toIndex(camera.pos.x);
    // const drawTo = drawFrom + drawWidth;
    // redraw(drawFrom, drawTo);
    redraw(0, res.w);
    context.drawImage(buffer, -camera.pos.x % tileSet.width, -camera.pos.y % tileSet.height);
  };
}
