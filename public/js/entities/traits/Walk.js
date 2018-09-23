import {Vec2} from "../../utils/math.js";
import {Sides} from "../Entity.js";

export default class Walk {

  constructor() {
    this.name = 'walk';
    this.xDir = 0;
    this.yDir = 0;

    this.velocity = 4000;

    this.heading = new Vec2(0, 1);
    this.colliding = new Vec2(0, 0);
    this.distance = 0;
  }

  update(entity, deltaTime) {
    // TODO BUGGO If Up and Right held then Up released and Down pressed, Up animation still shows
    if (this.xDir !== 0 && this.yDir === 0) {
      this.heading.x = this.xDir;
      this.heading.y = 0;
    } else if (this.yDir !== 0 && this.xDir === 0) {
      this.heading.y = this.yDir;
      this.heading.x = 0;
    }

    const xVel = this.velocity * deltaTime * this.xDir;
    const yVel = this.velocity * deltaTime * this.yDir;
    entity.vel = this.normaliseDiagonalSpeed(xVel, yVel);

    if (this.stopped(entity.vel)) {
      this.distance = 22;
    } else {
      this.distance += entity.vel.diag() * deltaTime;
    }

    this.colliding.set(0, 0);
  }

  obstruct(entity, side) {
    // Make sides into a better structure so I can map it
    // (or change everything so 1 and -1 aren't the values I rely on)
    if (side === Sides.BOTTOM) {
      this.colliding.y = 1;
    } else if (side === Sides.TOP) {
      this.colliding.y = -1;
    }
    if (side === Sides.RIGHT) {
      this.colliding.x = 1;
    } else if (side === Sides.LEFT) {
      this.colliding.x = -1;
    }
  }


  normaliseDiagonalSpeed(xVel, yVel) {
    if (xVel !== 0 && yVel !== 0) {
      const diag = new Vec2(xVel, yVel).diag();
      return new Vec2(this.xDir * xVel * xVel / diag, this.yDir * yVel * yVel / diag);
    } else {
      return new Vec2(xVel, yVel);
    }
  }

  stopped(entityVel) {
    return entityVel.x === 0 && entityVel.y === 0;
  }

}
