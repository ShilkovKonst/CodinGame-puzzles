const DIRS = {
  L: [-1, 0],
  D: [0, 1],
  R: [1, 0],
};
const TYPES = [
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
  { T: null, L: DIRS.D, R: null },
];

var inputs = readline().split(" ");
const W = parseInt(inputs[0]); // number of columns.
const H = parseInt(inputs[1]); // number of rows.
const map = [];
for (let i = 0; i < H; i++) {
  const LINE = readline(); // represents a line in the grid and contains W integers. Each integer represents one room of a given type.
  map.push(LINE.split(" "));
}
const EX = parseInt(readline()); // the coordinate along the X axis of the exit (not useful for this first mission, but must be read).

// game loop
while (true) {
  var inputs = readline().split(" ");
  const XI = parseInt(inputs[0]);
  const YI = parseInt(inputs[1]);
  const POS = inputs[2];

  console.log(getRightDirection(XI, YI, POS));
}

function getRightDirection(x, y, entry) {
  const type = TYPES[map[y][x]];
  const dir = type[entry[0]];
  return x + dir[0] + " " + (y + dir[1]);
}
