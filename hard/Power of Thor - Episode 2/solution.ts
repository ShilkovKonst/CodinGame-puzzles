const HEIGHT: number = 18;
const WIDTH: number = 40;
const DIRS: number[][] = [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1], [0, -1], [0, 1]];

var inputs: string[] = readline().split(' ');
let TX: number = parseInt(inputs[0]);
let TY: number = parseInt(inputs[1]);

let H: number; // the remaining number of hammer strikes.
let N: number; // the number of giants which are still present on the map.

let giantsInArea: number;
let inDanger: boolean;
let surrounded: boolean;
let target: number[] | undefined = undefined;

const forbiddenCells: boolean[][] = new Array(HEIGHT);
for (let i = 0; i < HEIGHT; i++) {
    forbiddenCells[i] = new Array(WIDTH).fill(false);
}

let lastPos: number[] = [TY, TX];

// game loop
while (true) {
    clearStates();

    var inputs: string[] = readline().split(' ');
    H = parseInt(inputs[0]);
    N = parseInt(inputs[1]);

    const gCoords: number[][] = readGiantCoordinates();
    const barycenter: number[] = getBarycenter(gCoords);

    const env: boolean[] = checkEnv();
    inDanger = env[0];
    surrounded = env[1];

    target = findNextStep(barycenter, lastPos);
    lastPos = [TY, TX];

    console.log(makeDecision());
}

function makeDecision(): string {
    // Fallback to current position if target is undefined
    return canStrike() ? "STRIKE" : goToTarget(target ?? [TY, TX]);
}

function goToTarget(target: number[]): string {
    if (TY == target[0] && TX == target[1])
        return "WAIT";

    let direction: string = "";
    direction += TY < target[0] ? "S" : TY > target[0] ? "N" : "";
    direction += TX < target[1] ? "E" : TX > target[1] ? "W" : "";

    applyNewPos(target);

    return direction;
}

function applyNewPos(target: number[]) {
    TY += TY < target[0] ? 1 : TY > target[0] ? -1 : 0;
    TX += TX < target[1] ? 1 : TX > target[1] ? -1 : 0;
}

function canStrike(): boolean {
    return giantsInArea >= ((N + H - 1) / H) || surrounded;
}

function findNextStep(barycenter: number[], lastPos: number[]): number[] | undefined {
    return inDanger ? getClosestCandidate(getNeighbors(TY, TX), barycenter, lastPos) : barycenter;
}

function getClosestCandidate(candidates: Set<number[]>, target: number[], lastPos: number[]): number[] | undefined {
    let bestDist: number = Number.MAX_SAFE_INTEGER;
    let bestC: number[] | undefined = undefined;

    for (const c of candidates) {
        if (forbiddenCells[c[0]][c[1]] || (c[0] == lastPos[0] && c[1] == lastPos[1]))
            continue;

        let dist: number = Math.pow(target[0] - c[0], 2) + Math.pow(target[1] - c[1], 2);
        if (dist < bestDist) {
            bestDist = dist;
            bestC = c;
        }
    }
    return bestC;
}

function checkEnv(): boolean[] {
    let inDanger: boolean = false, surrounded: boolean = true;
    for (const n of getNeighbors(TY, TX)) {
        if (forbiddenCells[n[0]][n[1]] && !inDanger)
            inDanger = true;
        if (!forbiddenCells[n[0]][n[1]] && surrounded)
            surrounded = false;
    }
    return [inDanger, surrounded];
}

function getBarycenter(gCoords: number[][]): number[] {
    const y: number = Math.floor(gCoords[0].reduce((p, c) => p += c, 0) / N);
    const x: number = Math.floor(gCoords[1].reduce((p, c) => p += c, 0) / N);
    return [y, x];
}

function readGiantCoordinates(): number[][] {
    const coords: number[][] = new Array(2);
    for (let i = 0; i < 2; i++)
        coords[i] = new Array();

    for (let i = 0; i < N; i++) {
        var inputs: string[] = readline().split(' ');
        const X: number = parseInt(inputs[0]);
        const Y: number = parseInt(inputs[1]);

        coords[0][i] = Y;
        coords[1][i] = X;

        populateForbiddenCells(Y, X);

        if (isInStrikeArea(Y, X))
            giantsInArea++;
    }
    return coords;
}

function isInStrikeArea(gy: number, gx: number): boolean {
    return Math.abs(gy - TY) <= 5 && Math.abs(gx - TX) <= 5;
}

function populateForbiddenCells(y: number, x: number): void {
    forbiddenCells[y][x] = true;
    for (const n of getNeighbors(y, x)) {
        forbiddenCells[n[0]][n[1]] = true;
    }
}

function getNeighbors(y: number, x: number): Set<number[]> {
    const neighbors: Set<number[]> = new Set();

    for (const d of DIRS) {
        const ny: number = y + d[0];
        const nx: number = x + d[1];
        if (isInBounds(ny, nx))
            neighbors.add([ny, nx]);
    }
    return neighbors;
}

function isInBounds(y: number, x: number): boolean {
    return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
}

function clearStates(): void {
    giantsInArea = 0;
    inDanger = false;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++)
            forbiddenCells[y][x] = false;
    }
}