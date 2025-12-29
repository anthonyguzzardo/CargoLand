// STATE

const startButton = document.getElementById("start-button");

// HTML

// EVENT LISTENERS
startButton?.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    try{
      window.location.href = 'game.html';
    }catch(error: unknown){
        if(error instanceof Error){
            console.error(`Error starting game : ${error.message}\n\n${error.stack}`)
        }else{
            console.error(`Unknown error starting game : ${error}`)
        }
    }
})