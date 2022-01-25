
// Left arrow
const left = 37;

// Right arrow
const right = 39;

// Up arrow
const jump = 38;

// Active key downs
const keys = [];

// Toggles active keydown of evt key
function handleKeydown(evt) {
  keys[evt.keyCode] = true;
}

// Toggles active keydown of evt key
function handleKeyup(evt) {
  keys[evt.keyCode] = false;
}

// Translation function
function keyCode(keyChar) {
  return keyChar.charCodeAt(0);
}
