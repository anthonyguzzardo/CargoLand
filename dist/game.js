"use strict";
// CONSTRAINTS
const VIEWPORT_HEIGHT = window.innerHeight;
const VIEWPORT_WIDTH = window.innerWidth;
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 3000;
const DRONE_SIZE = 80;
const TREE_COUNT = 150;
// Drop zone location (based on CSS: bottom: 350px, right: 350px, size 400x300)
const DROP_ZONE = {
    x: WORLD_WIDTH - 350 - 400,
    y: WORLD_HEIGHT - 350 - 300,
    width: 400,
    height: 300
};
// STATE
let ignition = false;
let hasCargo = true;
let pumpActive = false;
let waterLevel = 1; // 1 = full, 0 = drained
const keys = new Set();
const trees = [];
// Drone position in world coordinates
let droneX = 100;
let droneY = 100;
// Camera offset (top-left corner of viewport in world coords)
let cameraX = 0;
let cameraY = 0;
// HTML
const drone = document.querySelector('.drone');
const world = document.querySelector('.world');
const dropZone = document.querySelector('.drop-zone');
// Generate trees
function generateTrees() {
    if (!world)
        return;
    const clumpTypes = ['', 'light', 'dark', 'mid'];
    for (let i = 0; i < TREE_COUNT; i++) {
        const baseSize = 60 + Math.random() * 80; // 60-140px base
        let x, y;
        // Keep generating until we find a valid spot
        do {
            x = Math.random() * (WORLD_WIDTH - baseSize);
            y = Math.random() * (WORLD_HEIGHT - baseSize);
        } while (
        // Avoid spawn area (top-left)
        (x < 300 && y < 300) ||
            // Avoid drop zone area (bottom-right)
            (x > WORLD_WIDTH - 800 && y > WORLD_HEIGHT - 700));
        trees.push({ x, y, size: baseSize });
        // Create tree container
        const treeEl = document.createElement('div');
        treeEl.className = 'tree';
        treeEl.style.left = `${x}px`;
        treeEl.style.top = `${y}px`;
        treeEl.style.width = `${baseSize}px`;
        treeEl.style.height = `${baseSize}px`;
        // Add shadow first (underneath)
        const shadow = document.createElement('div');
        shadow.className = 'tree-shadow';
        shadow.style.width = `${baseSize * 1.2}px`;
        shadow.style.height = `${baseSize * 0.8}px`;
        shadow.style.left = `${baseSize * 0.1}px`;
        shadow.style.top = `${baseSize * 0.3}px`;
        treeEl.appendChild(shadow);
        // Create 5-8 overlapping branch clumps
        const clumpCount = 5 + Math.floor(Math.random() * 4);
        for (let j = 0; j < clumpCount; j++) {
            const clump = document.createElement('div');
            const clumpType = clumpTypes[Math.floor(Math.random() * clumpTypes.length)];
            clump.className = `branch-clump ${clumpType}`;
            // Vary size and position for organic look
            const clumpSize = baseSize * (0.4 + Math.random() * 0.4);
            const offsetX = (Math.random() - 0.5) * baseSize * 0.5;
            const offsetY = (Math.random() - 0.5) * baseSize * 0.5;
            clump.style.width = `${clumpSize}px`;
            clump.style.height = `${clumpSize * (0.8 + Math.random() * 0.4)}px`; // Slight oval
            clump.style.left = `${(baseSize - clumpSize) / 2 + offsetX}px`;
            clump.style.top = `${(baseSize - clumpSize) / 2 + offsetY}px`;
            clump.style.zIndex = `${Math.floor(Math.random() * 3)}`;
            treeEl.appendChild(clump);
        }
        world.appendChild(treeEl);
    }
}
// Check collision with trees (circle collision)
function checkTreeCollision(newX, newY) {
    const droneCenterX = newX + DRONE_SIZE / 2;
    const droneCenterY = newY + DRONE_SIZE / 2;
    const droneRadius = DRONE_SIZE / 3; // Smaller hitbox feels better
    for (const tree of trees) {
        const treeCenterX = tree.x + tree.size / 2;
        const treeCenterY = tree.y + tree.size / 2;
        const treeRadius = tree.size / 2.5; // Slightly smaller hitbox
        const dx = droneCenterX - treeCenterX;
        const dy = droneCenterY - treeCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < droneRadius + treeRadius) {
            return true; // Collision!
        }
    }
    return false;
}
generateTrees();
// Check if position is near drop zone
function isNearDropZone(x, y) {
    const centerX = x + DRONE_SIZE / 2;
    const centerY = y + DRONE_SIZE / 2;
    const dzCenterX = DROP_ZONE.x + DROP_ZONE.width / 2;
    const dzCenterY = DROP_ZONE.y + DROP_ZONE.height / 2;
    const distance = Math.sqrt(Math.pow(centerX - dzCenterX, 2) +
        Math.pow(centerY - dzCenterY, 2));
    return distance < 300; // Within 300px of drop zone center
}
// Drop cargo and create pump
function dropCargo() {
    if (!hasCargo || !world || !drone)
        return;
    hasCargo = false;
    drone.classList.add('dropped');
    // Create pump at drone's current position
    const pump = document.createElement('div');
    pump.className = 'pump';
    pump.id = 'pump';
    pump.style.left = `${droneX + DRONE_SIZE / 2 - 20}px`;
    pump.style.top = `${droneY + DRONE_SIZE / 2 - 25}px`;
    const pumpBody = document.createElement('div');
    pumpBody.className = 'pump-body';
    pump.appendChild(pumpBody);
    const pumpLight = document.createElement('div');
    pumpLight.className = 'pump-light';
    pump.appendChild(pumpLight);
    world.appendChild(pump);
    // If near drop zone, activate pump
    if (isNearDropZone(droneX, droneY)) {
        pumpActive = true;
        pump.classList.add('active');
    }
}
// EVENT LISTENERS
document.addEventListener('keydown', (ev) => {
    if (ignition) {
        keys.add(ev.code);
    }
    // Drop cargo with E key
    if (ev.code === 'KeyE' && hasCargo && ignition) {
        dropCargo();
    }
});
document.addEventListener('keyup', (ev) => {
    keys.delete(ev.code);
    if (ev.code === 'Space') {
        if (!ignition) {
            ignition = true;
        }
        else {
            ignition = false;
        }
    }
});
// FUNCTIONS
function update() {
    if (!drone || !world)
        return;
    // Toggle moving class for blade spin
    if (ignition) {
        drone.classList.add('moving');
    }
    else {
        drone.classList.remove('moving');
    }
    // Drain water if pump is active
    if (pumpActive && waterLevel > 0 && dropZone) {
        waterLevel -= 0.002; // Slow drain
        if (waterLevel < 0)
            waterLevel = 0;
        // Shrink and fade the drop zone
        dropZone.style.transform = `scale(${waterLevel})`;
        dropZone.style.opacity = `${0.3 + waterLevel * 0.7}`;
        if (waterLevel === 0) {
            pumpActive = false;
            dropZone.style.display = 'none';
        }
    }
    // Movement in world coordinates (with collision check)
    let newX = droneX;
    let newY = droneY;
    if (keys.has('KeyA'))
        newX -= 5;
    if (keys.has('KeyD'))
        newX += 5;
    if (keys.has('KeyW'))
        newY -= 5;
    if (keys.has('KeyS'))
        newY += 5;
    // Clamp to world bounds
    newX = Math.max(0, Math.min(newX, WORLD_WIDTH - DRONE_SIZE));
    newY = Math.max(0, Math.min(newY, WORLD_HEIGHT - DRONE_SIZE));
    // Only move if no collision (check X and Y separately for sliding)
    if (!checkTreeCollision(newX, droneY)) {
        droneX = newX;
    }
    if (!checkTreeCollision(droneX, newY)) {
        droneY = newY;
    }
    // Camera follows drone (keep drone roughly centered)
    cameraX = droneX - VIEWPORT_WIDTH / 2 + DRONE_SIZE / 2;
    cameraY = droneY - VIEWPORT_HEIGHT / 2 + DRONE_SIZE / 2;
    // Clamp camera to world bounds
    cameraX = Math.max(0, Math.min(cameraX, WORLD_WIDTH - VIEWPORT_WIDTH));
    cameraY = Math.max(0, Math.min(cameraY, WORLD_HEIGHT - VIEWPORT_HEIGHT));
    // Position drone in world
    drone.style.left = `${droneX}px`;
    drone.style.top = `${droneY}px`;
    // Move world to show camera view
    world.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
    requestAnimationFrame(update);
}
update();
