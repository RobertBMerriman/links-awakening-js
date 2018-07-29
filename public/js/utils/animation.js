export function createAnimation(frames, frameDuration) {
  return function resolveFrame(distance) {
    const frameIndex = Math.floor(distance / frameDuration % frames.length);
    return frames[frameIndex];
  }
}
