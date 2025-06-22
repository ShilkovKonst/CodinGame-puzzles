const HEIGHT = 18;
const WIDTH = 40;
const DIRS = [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1], [0, -1], [0, 1]];

var inputs = readline().split(' ');
let TX = parseInt(inputs[0]);
let TY = parseInt(inputs[1]);

let H; // the remaining number of hammer strikes.
let N; // the number of giants which are still present on the map.

let giantsInArea;
let inDanger;
let surrounded;
let target = null;

const forbiddenCells = new Array(HEIGHT);
for (let i = 0; i < HEIGHT; i++) {
    forbiddenCells[i] = new Array(WIDTH).fill(false);
}

let lastPos = [TY, TX];

// game loop
while (true) {
    clearStates();

    var inputs = readline().split(' ');
    H = parseInt(inputs[0]);
    N = parseInt(inputs[1]);

    const gCoords = readGiantCoordinates();
    const barycenter = getBarycenter(gCoords);

    var env = checkEnv();
    inDanger = env[0];
    surrounded = env[1];

    target = findNextStep(barycenter, lastPos);
    lastPos = [TY, TX];
    
    console.log(makeDecision());
}

function makeDecision() {
    return canStrike() ? "STRIKE" : goToTarget(target);
}

function goToTarget(target) {
    if (TY == target[0] && TX == target[1])
        return "WAIT";

    let direction = "";
    direction += TY < target[0] ? "S" : TY > target[0] ? "N" : "";
    direction += TX < target[1] ? "E" : TX > target[1] ? "W" : "";

    applyNewPos(target);

    return direction;
}

function applyNewPos(target) {
    TY += TY < target[0] ? 1 : TY > target[0] ? -1 : 0;
    TX += TX < target[1] ? 1 : TX > target[1] ? -1 : 0;
}

function canStrike() {
    return giantsInArea >= ((N + H - 1) / H) || surrounded;
}

function findNextStep(barycenter, lastPos) {
    return inDanger ? getClosestCandidate(getNeighbors(TY, TX), barycenter, lastPos) : barycenter;
}

function getClosestCandidate(candidates, target, lastPos) {
    let bestDist = Number.MAX_SAFE_INTEGER;
    let bestC = null;

    for (const c of candidates) {
        if (forbiddenCells[c[0]][c[1]] || (c[0] == lastPos[0] && c[1] == lastPos[1]))
            continue;

        let dist = Math.pow(target[0] - c[0], 2) + Math.pow(target[1] - c[1], 2);
        if (dist < bestDist) {
            bestDist = dist;
            bestC = c;
        }
    }
    return bestC;
}

function checkEnv() {
    let inDanger = false, surrounded = true;
    for (const n of getNeighbors(TY, TX)) {
        if (forbiddenCells[n[0]][n[1]] && !inDanger)
            inDanger = true;
        if (!forbiddenCells[n[0]][n[1]] && surrounded)
            surrounded = false;
    }
    return [inDanger, surrounded];
}

function getBarycenter(gCoords) {
    const y = Math.floor(gCoords[0].reduce((p, c) => p += c, 0) / N);
    const x = Math.floor(gCoords[1].reduce((p, c) => p += c, 0) / N);
    return [y, x];
}

function readGiantCoordinates() {
    const coords = new Array(2);
    for (let i = 0; i < 2; i++) coords[i] = new Array();

    for (let i = 0; i < N; i++) {
        var inputs = readline().split(' ');
        const X = parseInt(inputs[0]);
        const Y = parseInt(inputs[1]);

        coords[0][i] = Y;
        coords[1][i] = X;

        populateForbiddenCells(Y, X);

        if (isInStrikeArea(Y, X))
            giantsInArea++;
    }
    return coords;
}

function isInStrikeArea(gy, gx) {
    return Math.abs(gy - TY) <= 5 && Math.abs(gx - TX) <= 5;
}

function populateForbiddenCells(y, x) {
    forbiddenCells[y][x] = true;
    for (const n of getNeighbors(y, x)) {
        forbiddenCells[n[0]][n[1]] = true;
    }
}

function getNeighbors(y, x) {
    const neighbors = new Set();

    for (const d of DIRS) {
        const ny = y + d[0];
        const nx = x + d[1];
        if (isInBounds(ny, nx))
            neighbors.add([ny, nx]);
    }
    return neighbors;
}

function isInBounds(y, x) {
    return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
}

function clearStates() {
    giantsInArea = 0;
    inDanger = false;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++)
            forbiddenCells[y][x] = false;
    }
}