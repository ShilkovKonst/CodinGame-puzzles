type Bike = {
    x: number,
    y: number,
    a: boolean

};

type State = {
    speed: number,
    bikes: Bike[],
    commands: string[]
};

type Result = {
    commands: string[],
    aliveCount: number
};

const COMMANDS = ["SPEED", "WAIT", "JUMP", "UP", "DOWN", "SLOW"];

const M: number = parseInt(readline()); // the amount of motorbikes to control
const V: number = parseInt(readline()); // the minimum amount of motorbikes that must survive
const bikes: Bike[] = Array.from({ length: M }, () => ({ x: null, y: null, a: false }));

const roadMap: string[] = new Array(4);
for (let i = 0; i < 4; i++)
    roadMap[i] = readline(); // L0 to L3 are lanes of the road. A dot character . represents a safe space, a zero 0 represents a hole in the road.

let bestPath = null;
const visited: Set<string> = new Set();

let count: number = 0;
// game loop
while (true) {
    const S: number = parseInt(readline()); // the motorbikes' speed
    for (let i = 0; i < M; i++) {
        var inputs: string[] = readline().split(' ');
        bikes[i]["x"] = parseInt(inputs[0]); // x coordinate of the motorbike
        bikes[i]["y"] = parseInt(inputs[1]); // y coordinate of the motorbike
        bikes[i]["a"] = parseInt(inputs[2]) == 1;  // indicates whether the motorbike is activated "1" or detroyed "0"
    }
    if (count === 0) {
        const state: State = { speed: S, bikes: bikes, commands: [] };
        dfs(state);
    }

    console.log(bestPath.commands[count]);
    count++;
}

function dfs(state: State): void {
    if (isFinished(state)) {
        const candidate: Result = { commands: state.commands, aliveCount: aliveCount(state) };
        if (isBetterThan(candidate, bestPath)) {
            bestPath = candidate;
        }
        return;
    }

    if (isFailed(state) || aliveCount(state) < V)
        return;

    const key: string = getKey(state);
    if (visited.has(key))
        return;
    visited.add(key);

    for (const cmd of COMMANDS) {
        if ((cmd === "UP" || cmd === "DOWN") && !state.bikes.every((b) => canChangeLane(b, cmd)))
            continue;

        const next = applyCommand(state, cmd);
        if (aliveCount(next) >= V)
            dfs(next);
    }
}

function applyCommand(state: State, cmd: string): State {
    var nextBikes: Bike[] = state.bikes.map((b) => clone(b));
    let nextSpeed: number = state.speed;

    if (cmd == "SPEED") nextSpeed++;
    else if (cmd == "SLOW") nextSpeed = Math.max(0, state.speed - 1);

    for (const b of nextBikes) {
        if (!b.a) continue;

        switch (cmd) {
            case "JUMP":
                jump(b, nextSpeed);
                break;
            case "UP":
                changeLane(b, nextSpeed, cmd);
                break;
            case "DOWN":
                changeLane(b, nextSpeed, cmd);
                break;
            default:
                move(b, nextSpeed);
                break;
        }
    }
    const nextCommands: string[] = state.commands.slice();
    nextCommands.push(cmd);
    return { speed: nextSpeed, bikes: nextBikes, commands: nextCommands };
}

function move(bike: Bike, speed: number): void {
    bike.a = isGoodRoad(bike, speed);
    bike.x += speed;
}

function isGoodRoad(bike: Bike, speed: number): boolean {
    for (let i = bike.x + 1; i <= bike.x + speed; i++) {
        if (i < roadMap[bike.y].length && roadMap[bike.y][i] == "0") return false;
    }
    return true;
}

function changeLane(bike: Bike, speed: number, cmd: string): void {
    const dir: number = cmd === "UP" ? -1 : cmd === "DOWN" ? 1 : 0;
    const targetY: number = bike.y + dir;
    bike.a = isGoodToChangeLane(bike, speed, targetY);
    bike.x += speed;
    bike.y = targetY;
}

function isGoodToChangeLane(bike: Bike, speed: number, targetY: number): boolean {
    for (let i = bike.x + 1; i < bike.x + speed; i++) {
        if (
            i < roadMap[bike.y].length &&
            (roadMap[bike.y][i] == "0" || roadMap[targetY][i] == "0")
        )
            return false;
    }
    return isGoodSpot(bike.x + speed) || roadMap[targetY][bike.x + speed] != "0";
}

function jump(bike: Bike, speed: number): void {
    bike.a = isGoodSpot(bike.x + speed) || roadMap[bike.y][bike.x + speed] != "0";
    bike.x += speed;
}

function isGoodSpot(x: number): boolean {
    return x >= roadMap[0].length;
}

function clone(bike: Bike): Bike {
    return { x: bike.x, y: bike.y, a: bike.a };
}

function canChangeLane(bike: Bike, cmd: string): boolean {
    return (
        !bike.a || (cmd === "UP" && bike.y > 0) || (cmd === "DOWN" && bike.y < 3)
    );
}

function getKey(state: State): string {
    let key: string = "" + state.speed;
    for (const b of state.bikes) {
        if (!b.a) key += "|X";
        else key += "|{" + b.x + "}:{" + b.y + "}";
    }
    return key;
}

function aliveCount(state: State): number {
    return state.bikes.filter((b) => b.a).length;
}

function isFailed(state: State): boolean {
    return state.commands.length > 50;
}

function isBetterThan(a: Result, b: Result): boolean {
    return (
        b == null ||
        (a.aliveCount > b.aliveCount && a.commands.length <= 50) ||
        a.commands.length < b.commands.length
    );
}

function isFinished(state: State): boolean {
    return state.bikes.filter((b) => b.a && b.x > roadMap[0].length).length >= V;
}
