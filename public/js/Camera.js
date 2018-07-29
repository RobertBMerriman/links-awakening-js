import {Vec2} from "./utils/math.js";

export default class Camera {

  constructor(res) {
    this.pos = new Vec2(0, 0);
    this.size = new Vec2(res.h, res.w);
  }

}
