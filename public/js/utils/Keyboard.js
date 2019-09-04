
// TODO all keys -> actions in JSON
// Create actions (the callbacks) and save with names
// Map the keys -> action names map to keys -> action functions
export default function setupKeyboard(listeningElement, playerEntity) {
  const keyManager = new KeyManager(listeningElement);

  // TODO Change keys to modify 'button held' property on entity so the entity can make the decisions of what to do with the input
  // Could create a wrapper that takes inputs and handles changing the properties on entities so the entities can just worry about using them
  ["ArrowLeft", "KeyA"].forEach(code => {
    keyManager.addMapping(code, (keyState) => {
      playerEntity.walk.xDir += keyState ? -1 : 1;
    });
  });

  ["ArrowRight", "KeyD"].forEach(code => {
    keyManager.addMapping(code, (keyState) => {
      playerEntity.walk.xDir += keyState ? 1 : -1;
    });
  });

  ["ArrowUp", "KeyW"].forEach(code => {
    keyManager.addMapping(code, (keyState) => {
      playerEntity.walk.yDir += keyState ? -1 : 1;
    });
  });

  ["ArrowDown", "KeyS"].forEach(code => {
    keyManager.addMapping(code, (keyState) => {
      playerEntity.walk.yDir += keyState ? 1 : -1;
    });
  });

  ["KeyX", "KeyK"].forEach(code => {
    keyManager.addMapping(code, (keyState) => {
      playerEntity.sword.keyDown += keyState ? 1 : -1;
    });
  });

  return keyManager;
}

const PRESSED = 1;
const RELEASED = 0;

export class KeyManager {

  constructor(listeningElement) {
    this.keyStates = new Map();

    this.keyCallbackMap = new Map();

    this.listenTo(listeningElement);
  }

  addMapping(code, callback) {
    this.keyCallbackMap.set(code, callback);
  }

  handleEvent(event) {
    const {code} = event; // Extracts `code` property from event object

    if (!this.keyCallbackMap.has(code)) {
      return;
    }

    event.preventDefault();

    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

    if (this.keyStates.get(code) === keyState) {
      return;
    }

    this.keyStates.set(code, keyState);
    this.keyCallbackMap.get(code)(keyState);
  }

  listenTo(listeningElement) {
    ['keydown', 'keyup'].forEach((eventName) => {
      listeningElement.addEventListener(eventName, (event) => {
        this.handleEvent(event);
      });
    });
  }

}
