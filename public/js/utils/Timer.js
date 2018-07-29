export default class Timer {

  constructor(deltaTime = 1/60) {
    let accumulatedTime = 0;
    let lastTime = 0;
    let skipTwo = 0;
    let totalAccum = 0;
    let accumCounter = 0;

    this.updateProxy = (time) => {
      accumulatedTime += (time - lastTime) / 1000;
      lastTime = time;

      // TODO remove hack
      if (skipTwo < 2) {
        accumulatedTime = 0;
        skipTwo += 1;
      }

      // Keep idle to 2 seconds
      if (accumulatedTime > 2) {
        accumulatedTime = 2;
      }

      // TODO decouple constant time so that if `requestAnimationFrame` is too slow the game doesn't slow down
      // Makes no sense can't figure out seems that lower fps deltatimes run more frequently wtf
      while (accumulatedTime > deltaTime) {
        this.update(deltaTime);
        accumulatedTime -= deltaTime;
      }

      this.draw();

      this.enqueueFrame();
    }
  }

  update() {
    throw new Error('Main update function not overridden');
  }

  draw() {
    throw new Error('Main draw function not overridden');
  }

  enqueueFrame() {
    requestAnimationFrame(this.updateProxy);
  }

  start() {
    this.enqueueFrame();
  }
}
