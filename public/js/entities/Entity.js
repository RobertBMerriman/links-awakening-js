import {Vec2} from "../utils/math.js";
import {loadEntitySpriteSet} from "../utils/SpriteSet.js";
import {loadJson} from "../utils/loadData.js";
import Walk from "./traits/Walk.js";
import Sword from "./traits/Sword.js";

export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left'),
  RIGHT: Symbol('right')
};

export class Entity {

  constructor(name, sheetSpec) {
    this.name = name;
    //this.sheetSpec = sheetSpec;
    this.pos = sheetSpec.pos ? new Vec2(sheetSpec.pos[0], sheetSpec.pos[1]) : new Vec2(0, 0);
    this.vel = sheetSpec.vel ? new Vec2(sheetSpec.vel[0], sheetSpec.vel[1]) : new Vec2(0, 0);
    this.size = sheetSpec.size ? new Vec2(sheetSpec.size[0], sheetSpec.size[1]) : new Vec2(0, 0);
    this.offset = sheetSpec.offset ? new Vec2(sheetSpec.offset[0], sheetSpec.offset[1]) : new Vec2(0, 0);

    this.traits = [];
    sheetSpec.traits.forEach(trait => {
      this.addTrait(traitClassMap[trait]());
    });
  }

  // TODO COMPUTED VALUE
  centerpoint() {
    return new Vec2(this.pos.x + this.offset.x + this.size.x / 2, this.pos.y + this.offset.y + this.size.y / 2)
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  obstruct(side) {
    if (this.walk) {
      this.walk.obstruct(this, side);
    }
  }



  update(deltaTime) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime);
    });
  }

  draw(context) {
    console.warn('Unhandled draw call in Entity: ' + this.name);
  }

}

// TODO Need to read these in a better way
const traitClassMap = {
  Walk: () => new Walk(),
  Sword: () => new Sword(),
};



export function buildEntity(name) {
  return loadJson(`/sprites/entities/${name}.json`)
    .then(sheetSpec => Promise.all([
      sheetSpec,
      loadEntitySpriteSet(sheetSpec.sprite)
    ])).then(([sheetSpec, spriteSet]) => {
      const entity = new Entity(name, sheetSpec);

      entity.draw = function drawEntity(context) {

        // TODO When pushing stay on that direction????????
        // Also keep to same direction when moving (should solve pushing thing too)
        if (entity.walk.heading.x === 1) {
          if (entity.walk.colliding.x === 1) {
            spriteSet.drawAnim('push-right', context, 0, 0, entity.level.totalTime)
          } else {
            spriteSet.drawAnim('walk-right', context, 0, 0, entity.walk.distance);
          }
        } else if (entity.walk.heading.x === -1) {
          if (entity.walk.colliding.x === -1) {
            spriteSet.drawAnim('push-left', context, 0, 0, entity.level.totalTime)
          } else {
            spriteSet.drawAnim('walk-left', context, 0, 0, entity.walk.distance);
          }
        } else if (entity.walk.heading.y === -1) {
          if (entity.walk.colliding.y === -1) {
            spriteSet.drawAnim('push-up', context, 0, 0, entity.level.totalTime)
          } else {
            spriteSet.drawAnim('walk-up', context, 0, 0, entity.walk.distance);
          }
        } else if (entity.walk.heading.y === 1) {
          if (entity.walk.colliding.y === 1) {
            spriteSet.drawAnim('push-down', context, 0, 0, entity.level.totalTime)
          } else {
            spriteSet.drawAnim('walk-down', context, 0, 0, entity.walk.distance);
          }
        }

      };

      // TODO 🚨 HACK ALERT 🚨
      return (level) => {
        entity.level = level;
        return entity;
      }
    });
}


