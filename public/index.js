// STATE

const startButton = document.getElementById("start-button");

// HTML

// EVENT LISTENERS
startButton.addEventListener('click', e =>{
    e.preventDefault();
    window.location.href = 'game.html';
})