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

    this.spriteData = new Map();
  }


  define(spriteSpec, width, height) {
    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    buffer.getContext('2d')
      .drawImage(
        this.image,
        spriteSpec.pos[0], spriteSpec.pos[1], width, height, // Position and dimensions on the source image to take sub image from - (Sub rectangle)
        0, 0, width, height, // Position and dimensions to draw sub image onto the canvas          - (Dimension rectangle)
      );
    this.sprites.set(spriteSpec.name, buffer);

    const {name, ...data} = spriteSpec;
    this.spriteData.set(name, data);
  }

  defineAnim(animSpec, animation) {
    this.animations.set(animSpec.name, animation);

    const {name, ...data} = animSpec;
    this.spriteData.set(name, data);
  }

  defineTile(tileSpec) {
    const x = tileSpec.pos[0];
    const y = tileSpec.pos[1];
    const xAdjust = x * this.tileGap + this.startPos[0];
    const yAdjust = y * this.tileGap + this.startPos[1];
    const newSpec = {...tileSpec};
    newSpec.pos = [x * this.width + xAdjust, y * this.height + yAdjust];
    this.define(newSpec, this.width, this.height);
  }

  defineTileAnim(animSpec, animation) {
    this.animations.set(animSpec.name, animation);

    const {name, ...data} = animSpec;
    this.spriteData.set(name, data);
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
          spriteSet.defineTile(tileSpec);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach(animSpec => {
          const animation = createAnimation(animSpec.frames, animSpec.frameDuration);
          spriteSet.defineTileAnim(animSpec, animation);
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
          spriteSet.define(frameSpec, ...frameSpec.size);
        });
      }

      if (spriteSpec.animations) {
        spriteSpec.animations.forEach(animSpec => {
          const animation = createAnimation(animSpec.frames, animSpec.frameDuration);
          spriteSet.defineAnim(animSpec, animation);
        });
      }

      return spriteSet;
    });
}



