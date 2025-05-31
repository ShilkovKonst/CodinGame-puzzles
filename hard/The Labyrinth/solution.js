var inputs = readline().split(" ");
const R = parseInt(inputs[0]); // number of rows.
const C = parseInt(inputs[1]); // number of columns.
const A = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

const MODE = {
  EXPLORE: "EXPLORE",
  TO_FINISH: "TO_FINISH",
  ESCAPE: "ESCAPE",
};
const DIR = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

const maze = [];
let start = null,
  finish = null;
let mode = MODE.EXPLORE;

// game loop
while (true) {
  var inputs = readline().split(" ");
  const KR = parseInt(inputs[0]); // row where Rick is located.
  const KC = parseInt(inputs[1]); // column where Rick is located.
  for (let i = 0; i < R; i++) {
    const ROW = readline(); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
    maze[i] = ROW;
    for (let j = 0; j < C; j++) {
      const cell = maze[i][j];
      if (cell == "T" && !start) {
        start = key(i, j);
      }
      if (cell == "C" && !finish) {
        finish = key(i, j);
      }
    }
  }
  let bestRoute = getBestRoute(KR, KC);
  console.log(chooseDirection(bestRoute)); // Rick's next move (UP DOWN LEFT or RIGHT).
}

function chooseDirection(path) {
  if (path != null) {
    const from = path[0],
      to = path[1];
    const diffY = coord(to)[0] - coord(from)[0],
      diffX = coord(to)[1] - coord(from)[1];
    if (diffY == -1) return "UP";
    if (diffY == 1) return "DOWN";
    if (diffX == -1) return "LEFT";
    if (diffX == 1) return "RIGHT";
  }
  return "ERROR";
}

function getBestRoute(y, x) {
  checkEscapeRoute();

  const current = key(y, x);
  if (mode == MODE.EXPLORE) {
    return calculateRoute(current, null);
  }

  if (haveToEscape(current)) {
    mode = MODE.ESCAPE;
  }

  return calculateRoute(current, mode == MODE.ESCAPE ? start : finish);
}

function checkEscapeRoute() {
  if (mode != MODE.EXPLORE || finish == null) return;

  const finalRoute = calculateRoute(finish, start);
  if (finalRoute != null && finalRoute.length <= A + 1) {
    mode = MODE.TO_FINISH;
  }
}

function calculateRoute(from, to) {
  const queue = new Array(R * C);
  const parents = new Array(R * C);
  const visited = new Array(R * C).fill(false);

  let head = 0,
    tail = 0;

  queue[tail++] = from;
  visited[from] = true;

  return routeToTarget(from, to, head, tail, queue, parents, visited);
}

function routeToTarget(from, to, head, tail, queue, parents, visited) {
  while (head < tail) {
    const current = queue[head++];
    const cy = coord(current)[0],
      cx = coord(current)[1];

    if (to != null && current == to) {
      return buildPath(parents, from, to);
    }

    for (const d of DIR) {
      const ny = cy + d[0],
        nx = cx + d[1];
      const nextKey = key(ny, nx);

      if (!isInBounds(ny, nx) || visited[nextKey]) continue;

      const cell = maze[ny][nx];
      if (!isValidCell(cell) && !isGoingToFinish(cell)) continue;

      visited[nextKey] = true;
      parents[nextKey] = current;
      queue[tail++] = nextKey;

      if (to == null && isValidCandidate(ny, nx)) {
        return buildPath(parents, from, nextKey);
      }
    }
  }
  return null;
}

function buildPath(parents, from, to) {
  const path = [];
  let current = to;
  while (current != null) {
    path.unshift(current);
    current = parents[current];
  }

  return path[0] == from ? path : null;
}

function isValidCandidate(y, x) {
  for (const d of DIR) {
    const ny = y + d[0],
      nx = x + d[1];
    if (isInBounds(ny, nx) && maze[ny][nx] == "?") {
      return true;
    }
  }
  return false;
}

function isInBounds(y, x) {
  return y >= 0 && y < R && x >= 0 && x < C;
}

function haveToEscape(current) {
  return mode == MODE.TO_FINISH && current == finish;
}

function isGoingToFinish(cell) {
  return mode == MODE.TO_FINISH && cell == "C";
}

function isValidCell(cell) {
  return cell == "." || cell == "T";
}

function key(y, x) {
  return y * C + x;
}

function coord(key) {
  return [Math.floor(key / C), key % C];
}
