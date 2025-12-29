"use strict";
// STATE
const keys = new Set();
let x = 0;
let y = 0;
const drone = document.querySelector('.drone');
// HTML
// EVENT LISTENERS
document.addEventListener('keydown', (ev) => {
    keys.add(ev.code);
});
document.addEventListener('keyup', (ev) => {
    keys.delete(ev.code);
});
// FUNCTIONS
function update() {
    if (!drone)
        return;
    // x-axis
    if (keys.has('KeyA'))
        x -= 10;
    if (keys.has('KeyD'))
        x += 10;
    // y-axis
    if (keys.has('KeyS'))
        y -= 10;
    if (keys.has('KeyW'))
        y += 10;
    console.log(`(x, y): (${x}, ${y})`);
    drone.style.transform = `translate(${x}px, ${y * -1}px)`;
    requestAnimationFrame(update);
}
update();
