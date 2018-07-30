import Timer from "./utils/Timer.js";
import Level from "./Level.js";
import Camera from "./Camera.js";
import setupKeyboard from "./utils/Keyboard.js";
import {buildEntity} from "./entities/Entity.js";
import {loadLevel} from "./Level.js";


export const res = {w: 160, h: 144};

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

// Replace then with load all assets needed
// Load level with all background tiles and enemies
Promise.all([loadLevel('village'), buildEntity('link')])
.then(([level, link]) => {

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
    context.beginPath();
    context.clearRect(1, 1, res.w - 2, res.h - 2);
    context.stroke();
    level.draw(context, camera);
  };

  timer.start();
});


