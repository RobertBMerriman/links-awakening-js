import {Vec2} from "../utils/math.js";
import {loadEntitySpriteSet} from "../utils/SpriteSet.js";
import {loadJson} from "../utils/loadData.js";
import Walk from "./traits/Walk.js";

// TODO Unsure about this Trait pattern

export class Trait {

  constructor(name) {
    this.name = name;
  }

  update() {
    console.warn('Unhandled update call in Trait: ' + this.name);
  }

}

export class Entity {

  constructor(name, sheetSpec) {
    this.name = name;
    //this.sheetSpec = sheetSpec;
    this.pos = sheetSpec.pos ? new Vec2(sheetSpec.pos[0], sheetSpec.pos[1]) : new Vec2(0, 0);;
    this.vel = sheetSpec.vel ? new Vec2(sheetSpec.vel[0], sheetSpec.vel[1]) : new Vec2(0, 0);
    this.size = sheetSpec.size ? new Vec2(sheetSpec.size[0], sheetSpec.size[1]) : new Vec2(0, 0);

    this.traits = [];
    sheetSpec.traits.forEach(trait => {
      this.addTrait(traitClassMap[trait]());
    });
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
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

const traitClassMap = {
  Walk: () => new Walk(),
};



export function buildEntity(name) {
  return loadJson(`/sprites/entities/${name}.json`)
    .then(sheetSpec => Promise.all([
      sheetSpec,
      loadEntitySpriteSet(sheetSpec.sprite)
    ])).then(([sheetSpec, spriteSet]) => {
      const entity = new Entity(name, sheetSpec);

      entity.draw = function drawEntity(context) {

        // Route walking down animation
        // ✔️Create animation sets in json
        // Connect logic to animation sets

        if (entity.walk.heading.x === 1) {
          spriteSet.drawAnim('walk-right', context, 0, 0, entity.walk.distance);
        } else if (entity.walk.heading.x === -1) {
          spriteSet.drawAnim('walk-left', context, 0, 0, entity.walk.distance);
        } else if (entity.walk.heading.y === -1) {
          spriteSet.drawAnim('walk-up', context, 0, 0, entity.walk.distance);
        } else if (entity.walk.heading.y === 1) {
          spriteSet.drawAnim('walk-down', context, 0, 0, entity.walk.distance);
        }

      };

      return entity;
    });
}


