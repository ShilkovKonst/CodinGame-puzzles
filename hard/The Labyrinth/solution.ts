interface Mode {
  EXPLORE: string;
  TO_FINISH: string;
  ESCAPE: string;
}

var inputs: string[] = readline().split(" ");
const R: number = parseInt(inputs[0]); // number of rows.
const C: number = parseInt(inputs[1]); // number of columns.
const A: number = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

const MODE: Mode = {
  EXPLORE: "EXPLORE",
  TO_FINISH: "TO_FINISH",
  ESCAPE: "ESCAPE",
};
const DIR: number[][] = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

const maze: string[] = [];
let start: number | null = null,
  finish: number | null = null;
let mode: string = MODE.EXPLORE;

// game loop
while (true) {
  var inputs: string[] = readline().split(" ");
  const KR: number = parseInt(inputs[0]); // row where Rick is located.
  const KC: number = parseInt(inputs[1]); // column where Rick is located.
  for (let i = 0; i < R; i++) {
    const ROW: string = readline(); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
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
  let bestRoute: number[] | null = getBestRoute(KR, KC);
  console.log(chooseDirection(bestRoute)); // Rick's next move (UP DOWN LEFT or RIGHT).
}

function chooseDirection(path: number[] | null): string {
  if (path != null) {
    const from: number = path[0],
      to: number = path[1];
    const diffY: number = coord(to)[0] - coord(from)[0],
      diffX: number = coord(to)[1] - coord(from)[1];
    if (diffY == -1) return "UP";
    if (diffY == 1) return "DOWN";
    if (diffX == -1) return "LEFT";
    if (diffX == 1) return "RIGHT";
  }
  return "ERROR";
}

function getBestRoute(y: number, x: number): number[] | null {
  checkEscapeRoute();

  const current: number = key(y, x);
  if (mode == MODE.EXPLORE) {
    return calculateRoute(current, null);
  }

  if (haveToEscape(current)) {
    mode = MODE.ESCAPE;
  }

  return calculateRoute(current, mode == MODE.ESCAPE ? start : finish);
}

function checkEscapeRoute(): void {
  if (mode != MODE.EXPLORE || finish == null) return;

  const finalRoute: number[] | null = calculateRoute(finish, start);
  if (finalRoute != null && finalRoute.length <= A + 1) {
    mode = MODE.TO_FINISH;
  }
}

function calculateRoute(from: number, to: number | null): number[] | null {
  const queue: number[] = new Array(R * C);
  const parents: number[] = new Array(R * C);
  const visited: boolean[] = new Array(R * C).fill(false);

  let head: number = 0,
    tail: number = 0;

  queue[tail++] = from;
  visited[from] = true;

  return routeToTarget(from, to, head, tail, queue, parents, visited);
}

function routeToTarget(
  from: number,
  to: number | null,
  head: number,
  tail: number,
  queue: number[],
  parents: number[],
  visited: boolean[]
) {
  while (head < tail) {
    const current: number = queue[head++];
    const cy: number = coord(current)[0],
      cx: number = coord(current)[1];

    if (to != null && current == to) {
      return buildPath(parents, from, to);
    }

    for (const d of DIR) {
      const ny: number = cy + d[0],
        nx: number = cx + d[1];
      const nextKey: number = key(ny, nx);

      if (!isInBounds(ny, nx) || visited[nextKey]) continue;

      const cell: string = maze[ny][nx];
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

function buildPath(
  parents: number[],
  from: number,
  to: number
): number[] | null {
  const path: number[] = [];
  let current: number = to;
  while (current != null) {
    path.unshift(current);
    current = parents[current];
  }

  return path[0] == from ? path : null;
}

function isValidCandidate(y: number, x: number): boolean {
  for (const d of DIR) {
    const ny: number = y + d[0],
      nx: number = x + d[1];
    if (isInBounds(ny, nx) && maze[ny][nx] == "?") {
      return true;
    }
  }
  return false;
}

function isInBounds(y: number, x: number): boolean {
  return y >= 0 && y < R && x >= 0 && x < C;
}

function haveToEscape(current: number): boolean {
  return mode == MODE.TO_FINISH && current == finish;
}

function isGoingToFinish(cell: string): boolean {
  return mode == MODE.TO_FINISH && cell == "C";
}

function isValidCell(cell: string): boolean {
  return cell == "." || cell == "T";
}

function key(y: number, x: number): number {
  return y * C + x;
}

function coord(key: number): number[] {
  return [Math.floor(key / C), key % C];
}
