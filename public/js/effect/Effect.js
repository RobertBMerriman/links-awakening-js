export class Effect {

  constructor(pos, time) {
    this.pos = pos;
    this.time = time;
    this.initialTime = time;
  }

  update(deltaTime) {
    return this.time += -deltaTime;
  }

  draw(context) {
    console.warn('Unhandled draw call in Effect');
  }

  isShowing() {
    return this.time > 0;
  }

}

export class CutEffect extends Effect {

  constructor(pos, spriteSheet) {
    super(pos, 1);
    this.spriteSheet = spriteSheet;
  }

  draw(context) {
    this.spriteSheet.drawAnim('leaves', context, 0, 0, this.time)
  }

  show(x, y) {
    this.pos.set(x, y);
    this.time = this.initialTime;
  }

}
