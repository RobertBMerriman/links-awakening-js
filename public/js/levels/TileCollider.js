import TileResolver from './TileResolver.js'
import {Sides} from "../entities/Entity.js";

export default class TileCollider {

  constructor(tileMatrix, tileSet) {
    this.tileResolver = new TileResolver(tileMatrix);
    this.tileSet = tileSet;
  }

  checkX(entity) {
    const posX = entity.pos.x + entity.offset.x;
    const posY = entity.pos.y + entity.offset.y;

    let x;
    if (entity.vel.x > 0) {
      x = posX + entity.size.x;
    } else if (entity.vel.x < 0) {
      x = posX;
    } else return;

    const matches = this.tileResolver.searchByRange(
      x, x,
      posY, posY + entity.size.y);

    matches.forEach(match => {
      if (this.tileSet.spriteData.get(match.tile.name).walkable) {
        return;
      }

      if (entity.vel.x > 0) {
        if (posX + entity.size.x  > match.x1) {
          entity.pos.x = match.x1 - entity.size.x - entity.offset.x;
          entity.vel.x = 0;

          entity.obstruct(Sides.RIGHT);
        }
      } else if (entity.vel.x < 0) {
        if (posX < match.x2) {
          entity.pos.x = match.x2 - entity.offset.x;
          entity.vel.x = 0;

          entity.obstruct(Sides.LEFT);
        }
      }
    });
  }

  checkY(entity) {
    const posX = entity.pos.x + entity.offset.x;
    const posY = entity.pos.y + entity.offset.y;

    let y;
    if (entity.vel.y > 0) {
      y = posY + entity.size.y;
    } else if (entity.vel.y < 0) {
      y = posY;
    } else return;

    const matches = this.tileResolver.searchByRange(
      posX, posX + entity.size.x,
      y, y);

    matches.forEach(match => {
      if (this.tileSet.spriteData.get(match.tile.name).walkable) {
        return;
      }

      if (entity.vel.y > 0) {
        if (posY + entity.size.y  > match.y1) {
          entity.pos.y = match.y1 - entity.size.y - entity.offset.y;
          entity.vel.y = 0;

          entity.obstruct(Sides.BOTTOM);
        }
      } else if (entity.vel.y < 0) {
        if (posY < match.y2) {
          entity.pos.y = match.y2 - entity.offset.y;
          entity.vel.y = 0;

          entity.obstruct(Sides.TOP);
        }
      }
    });
  }

}
