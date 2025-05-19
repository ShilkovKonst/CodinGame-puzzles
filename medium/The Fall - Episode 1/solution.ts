interface Dir {
    L: number[];
    D: number[];
    R: number[];
}
interface Type {
    T: number[];
    L: number[];
    R: number[];
}

const DIRS: Dir = {
    L: [-1, 0],
    D: [0, 1],
    R: [1, 0],
};

const TYPES: Type[] = [
    { T: null, L: null, R: null },
    { T: DIRS.D, L: DIRS.D, R: DIRS.D },
    { T: null, L: DIRS.R, R: DIRS.L },
    { T: DIRS.D, L: null, R: null },
    { T: DIRS.L, L: null, R: DIRS.D },
    { T: DIRS.R, L: DIRS.D, R: null },
    { T: null, L: DIRS.R, R: DIRS.L },
    { T: DIRS.D, L: null, R: DIRS.D },
    { T: null, L: DIRS.D, R: DIRS.D },
    { T: DIRS.D, L: DIRS.D, R: null },
    { T: DIRS.L, L: null, R: null },
    { T: DIRS.R, L: null, R: null },
    { T: null, L: null, R: DIRS.D },
    { T: null, L: DIRS.D, R: null }
];

var inputs: string[] = readline().split(' ');
const W: number = parseInt(inputs[0]); // number of columns.
const H: number = parseInt(inputs[1]); // number of rows.
const map: string[][] = new Array();
for (let i = 0; i < H; i++) {
    const LINE: string = readline(); // represents a line in the grid and contains W integers. Each integer represents one room of a given type.
    map.push(LINE.split(' '));
}
const EX: number = parseInt(readline()); // the coordinate along the X axis of the exit (not useful for this first mission, but must be read).

// game loop
while (true) {
    var inputs: string[] = readline().split(' ');
    const XI: number = parseInt(inputs[0]);
    const YI: number = parseInt(inputs[1]);
    const POS: string = inputs[2];

    // One line containing the X Y coordinates of the room in which you believe Indy will be on the next turn.
    console.log(getRightDirection(XI, YI, POS));
}

function getRightDirection(x: number, y: number, entry: string): string {
    const type = TYPES[map[y][x]];
    const dir = type[entry[0]];
    return `${x + dir[0]} ${y + dir[1]}`
}
