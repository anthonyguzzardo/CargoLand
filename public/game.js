// STATE
let directions = [];

let prevDirection = null;
let currDirection = null;
let x = null
let y = null;

// HTML

// EVENT LISTENERS
document.addEventListener('keydown', e =>{
    e.preventDefault();
    const direction = e.key.toLowerCase();
    switch(direction){
        case('a'):
            addDirectionToArray("Left")
            break;
        case('s'):
            addDirectionToArray("Down")
            break;
        case('d'):
            addDirectionToArray("Right")
            break;
        case('w'):
            addDirectionToArray("Up")
            break;
    }
})

document.addEventListener('keyup', e =>{
    e.preventDefault();
    console.log(`Number of Directions: ${getNumberOfDirections()}`)
    const direction = e.key.toLowerCase();
    switch(direction){
        case('a'):
            clearDirections();
            break;
        case('s'):
            clearDirections();
            break;
        case('d'):
            clearDirections();
            break;
        case('w'):
            clearDirections();
            break;
    }
})

// FUNCTIONS

function addDirectionToArray(direction){
    const numberOfDirections = getNumberOfDirections();
    if(numberOfDirections === 0){
        directions.push(direction);
        currDirection = direction;
    }else{
        if(numberOfDirections > 1){
            return;
        }
        directions.push(direction);
    }
    renderDirections();
}

function renderDirections(){
    let concatDirections = '';

    const numberOfDirections = getNumberOfDirections();

    for(let i = 0; i < numberOfDirections; i++){
        const direction = directions[i];
        if(numberOfDirections === 1){
            console.log(`Direction ${direction}`);
            return;
        }
        if(i < numberOfDirections - 1){
            concatDirections+= direction;
            concatDirections+= ", ";
        }else{
            concatDirections+= direction;
        }
    }
    console.log(`Directions: ${concatDirections}`)
}

function clearDirections(){
    directions = [];
}

function getNumberOfDirections(){
    return directions.length;
}