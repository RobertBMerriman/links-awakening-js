
export default class Sword {

  constructor() {
    this.name = 'sword';

    this.keyDown = 0;
    this.buttonReleased = true;

    this.swordSlashTime = 0;
  }

  update(entity, deltaTime) {
    if (this.keyDown === 1 && this.buttonReleased) {
      this.buttonReleased = false;
      this.sword(entity);
      this.swordSlashTime = 0.15;
    } else if (this.keyDown === 0 && !this.buttonReleased) {
      this.buttonReleased = true;
    }

    if (this.swordSlashTime > 0) {
      entity.vel.set(0, 0);
      this.swordSlashTime += -deltaTime;
    }
  }

  sword(entity) {
    // console.log(entity.level);
    let xAdjust = 0;
    let yAdjust = 0;

    const tileSize = entity.level.tileCollider.tileResolver.tileSize;

    if (entity.walk.heading.x === 1) {
      xAdjust = tileSize;
    } else if (entity.walk.heading.x === -1) {
      xAdjust = -tileSize;
    } else if (entity.walk.heading.y === -1) {
      yAdjust = -tileSize;
    } else if (entity.walk.heading.y === 1) {
      yAdjust = tileSize;
    }

    const tileToCut = entity.level.tileCollider.tileResolver.searchByPosition(entity.centerpoint().x + xAdjust, entity.centerpoint().y + yAdjust);

    if (tileToCut) {
      const tileData = entity.level.tileSet.spriteData.get(tileToCut.tile.name);

      if (tileData) {
        if (tileData.cuttable) {

          // TODO Shouldn't have to divide by tile size 😡😡😡
          const tileX = tileToCut.x1 / tileSize;
          const tileY = tileToCut.y1 / tileSize;

          if (tileData.cuttable.replaceWith) {
            entity.level.tiles.set(tileX, tileY, {
              name: tileData.cuttable.replaceWith,
            })
          }

          // TODO Centerpoint function pls
          // Effect is being shown in the right place based on knowing the size of the tile and effect, centerpoints should solve that issue
          if (tileData.cuttable.effect) {
            entity.level.showEffect(tileToCut.x1 - tileSize / 2, tileToCut.y1 - tileSize / 2, tileData.cuttable.effect)
          }

        }
      }
    }
  }
}
