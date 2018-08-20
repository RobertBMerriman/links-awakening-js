import Timer from "./utils/Timer.js";
import Camera from "./Camera.js";
import setupKeyboard from "./utils/Keyboard.js";
import {buildEntity} from "./entities/Entity.js";
import {loadLevel} from "./Level.js";


export const res = {w: 160, h: 144}; // 10 x 9 tile size (technically 10 x 8 for world cos last 'tile' is the menu bar)

// Setup
const canvas = document.getElementById('screen');
const scale = canvas.clientWidth / res.h; // 🤔 Doesn't given exact html-css scale - note worthy
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;



// To show outline
context.beginPath();
context.strokeStyle = 'blue';
context.lineWidth = 1;
context.rect(0, 0, res.w, res.h);
context.stroke();

// To show menu box
context.beginPath();
context.fillStyle = '#FFFF8B';
context.fillRect(0, Math.round(res.h / 9 * 8), res.w, res.h / 9);
context.stroke();

// Replace then with load all assets needed
// Load level with all background tiles and enemies
Promise.all([loadLevel('village'), buildEntity('link')])
.then(([level, levellessLink]) => {
  // TODO Handling level scope?????????
  const link = levellessLink(level);

  const keyManager = setupKeyboard(window, link);

  // Start game
  const deltaTime = 1/60;
  const timer = new Timer(deltaTime);

  const camera = new Camera(res);

  level.entities.add(link);

  console.log(link);

  timer.update = function update(deltaTime) {
    level.update(deltaTime);
  };

  timer.draw = function draw() {
    level.draw(context, camera);
  };

  timer.start();
});


