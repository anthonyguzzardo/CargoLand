// STATE

const keys = new Set<string>();

let x : number = 0;
let y : number = 0;

const drone = document.querySelector<HTMLElement>('.drone');
// HTML


// EVENT LISTENERS

document.addEventListener('keydown', (ev : KeyboardEvent ) => {
    keys.add(ev.code);
});
document.addEventListener('keyup', (ev : KeyboardEvent ) => {
    keys.delete(ev.code);
});



// FUNCTIONS

function update(){
    if (!drone) return;
    // x-axis
    if(keys.has('KeyA'))x-=10;
    if(keys.has('KeyD'))x+=10;

    // y-axis
    if(keys.has('KeyS'))y-=10;
    if(keys.has('KeyW'))y+=10;
    
    console.log(`(x, y): (${x}, ${y})`);

    drone.style.transform = `translate(${x}px, ${y*-1}px)`;

    requestAnimationFrame(update);
}

update();