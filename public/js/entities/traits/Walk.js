import {Vec2} from "../../utils/math.js";

export default class Walk {

  constructor() {
    this.name = 'walk';
    this.xDir = 0;
    this.yDir = 0;

    this.velocity = 3000;

    this.heading = new Vec2(0, 1);
    this.distance = 0;
  }

  update(entity, deltaTime) {

    if (this.xDir !== 0) {
      this.heading.x = this.xDir;
    } else if (this.yDir !== 0) {
      this.heading.x = 0;
      this.heading.y = this.yDir;
    }

    const xVel = this.velocity * deltaTime * this.xDir;
    const yVel = this.velocity * deltaTime * this.yDir;
    entity.vel = this.normaliseDiagonalSpeed(xVel, yVel);

    // if (this.stopped(entity.vel)) {
    //   this.distance = 0;
    // } else {
      this.distance += entity.vel.diag() * deltaTime;
    // }
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
