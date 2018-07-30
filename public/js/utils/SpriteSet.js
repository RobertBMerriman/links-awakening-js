import {loadImage, loadJson} from "./loadData.js";
import {createAnimation} from "./animation.js";

// TODO Save collision data to sprite???
// TODO Different sprite set class for tile and entities?
class SpriteSet {
  constructor(image, tileWidth, tileHeight, tileGap = 0, startPos = [0, 0]) {
    this.image = image;
    this.width = tileWidth;
    this.height = tileHeight;
    this.tileGap = tileGap;
    this.startPos = startPos;

    this.sprites = new Map();
    this.animations = new Map();
  }

  defineAnim(name, animation) {
    this.animations.set(name, animation);
  }

  define(name, x, y, width, height) {
    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    buffer.getContext('2d')
      .drawImage(
        this.image,
        x, y, width, height, // Position and dimensions on the source image to take sub image from - (Sub rectangle)
        0, 0, width, height, // Position and dimensions to draw sub image onto the canvas          - (Dimension rectangle)
      );
    this.sprites.set(name, buffer);
  }

  defineTile(name, x, y) {
    const xAdjust = x * this.tileGap + this.startPos[0];
    const yAdjust = y * this.tileGap + this.startPos[1];
    this.define(name, x * this.width + xAdjust, y * this.height + yAdjust, this.width, this.height);
  }

  draw(name, context, x, y) {
    const buffer = this.sprites.get(name);
    context.drawImage(buffer, x, y);
  }

  drawAnim(name, context, x, y, distance) {
    const animation = this.animations.get(name);
    this.draw(animation(distance), context, x, y);
  }

  drawTile(name, context, x, y) {
    this.draw(name, context, x * this.width, y * this.height);
  }

  drawTileAnim(name, context, x, y, distance) {
    const animation = this.animations.get(name);
    this.drawTile(animation(distance), context, x, y);
  }
}

export function loadTileSpriteSheet(name) {
  return loadJson(`/sprites/tiles/${name}.json`)
    .then(sheetSpec => Promise.all([
      sheetSpec,
      loadImage(sheetSpec.imageUrl),
    ]))
    .then(([sheetSpec, image]) => {
      const spriteSet = new SpriteSet(image, sheetSpec.tileWidth, sheetSpec.tileHeight, sheetSpec.tileGap, sheetSpec.startPos);

      if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach(tileSpec => {
          spriteSet.defineTile(tileSpec.name, tileSpec.pos[0], tileSpec.pos[1]);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach(animSpec => {
          const animation = createAnimation(animSpec.frames, animSpec.frameDuration);
          spriteSet.defineAnim(animSpec.name, animation);
        });
      }

      return spriteSet;
    });
}


export function loadEntitySpriteSet(spriteSpec) {
  return loadImage(spriteSpec.imageUrl)
    .then((image) => {
      const spriteSet = new SpriteSet(image);

      if (spriteSpec.frames) {
        spriteSpec.frames.forEach(frameSpec => {
          spriteSet.define(frameSpec.name, ...frameSpec.pos, ...frameSpec.size);
        });
      }

      if (spriteSpec.animations) {
        spriteSpec.animations.forEach(animSpec => {
          const animation = createAnimation(animSpec.frames, animSpec.frameDuration);
          spriteSet.defineAnim(animSpec.name, animation);
        });
      }

      return spriteSet;
    });
}



