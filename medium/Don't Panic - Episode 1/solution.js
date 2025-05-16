var inputs = readline().split(' ');
const nbFloors = parseInt(inputs[0]); // number of floors
const width = parseInt(inputs[1]); // width of the area
const nbRounds = parseInt(inputs[2]); // maximum number of rounds
const exitFloor = parseInt(inputs[3]); // floor on which the exit is found
const exitPos = parseInt(inputs[4]); // position of the exit on its floor
const nbTotalClones = parseInt(inputs[5]); // number of generated clones
const nbAdditionalElevators = parseInt(inputs[6]); // ignore (always zero)
const nbElevators = parseInt(inputs[7]); // number of elevators
const elevators = {};
elevators[exitFloor] = exitPos;
for (let i = 0; i < nbElevators; i++) {
    var inputs = readline().split(' ');
    // const elevatorFloor = parseInt(inputs[0]); // floor on which this elevator is found
    // const elevatorPos = parseInt(inputs[1]); // position of the elevator on its floor
    elevators[parseInt(inputs[0])] = parseInt(inputs[1]);
}
let cloneFloor;
let clonePos;
let direction;

// game loop
while (true) {
    var inputs = readline().split(' ');
    cloneFloor = parseInt(inputs[0]); // floor of the leading clone
    clonePos = parseInt(inputs[1]); // position of the leading clone on its floor
    direction = inputs[2]; // direction of the leading clone: LEFT or RIGHT

    makeDecision();     // action: WAIT or BLOCK

}

function isRightDirection() {
    switch (direction) {
        case "RIGHT":
            return clonePos <= elevators[cloneFloor];
        case "LEFT":
            return clonePos >= elevators[cloneFloor];
        case "NONE":
            return true;
    }
    return true;
}

function makeDecision() {
    if (!isRightDirection()) {
        console.log("BLOCK");
    } else {
        console.log("WAIT");
    }
}