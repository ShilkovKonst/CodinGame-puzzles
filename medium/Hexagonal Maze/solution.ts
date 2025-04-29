interface Graph {
  [nodeKey: number]: Set<number>;
}
const EVEN_DIRS: number[][] = [
  [0, -1],
  [-1, -1],
  [-1, 0],
  [0, 1],
  [1, -1],
  [1, 0],
];
const ODD_DIRS: number[][] = [
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 0],
  [1, 1],
];

var inputs: string[] = readline().split(" ");
const w: number = parseInt(inputs[0]);
const h: number = parseInt(inputs[1]);
const maze: string[][] = new Array(h);
const graph: Graph = {};
let start: number = -1;
let end: number = -1;
for (let i = 0; i < h; i++) {
  maze[i] = readline().split("");
  for (let j = 0; j < w; j++) {
    if (maze[i][j] === "S") start = key(i, j);
    if (maze[i][j] === "E") end = key(i, j);
    if (maze[i][j] !== "#") graph[key(i, j)] = new Set();
  }
}

for (const node in graph) {
  assignNeighbors(Number(node));
}

const path: boolean[] = getBestPath(start, end);
for (let i = 0; i < h; i++) {
  for (let j = 0; j < w; j++) {
    if (path[key(i, j)]) maze[i][j] = maze[i][j] === "_" ? "." : maze[i][j];
  }
  console.log(maze[i].join(""));
}

function getBestPath(start: number, end: number): boolean[] {
  const queue: number[] = new Array(w * h);
  const visited: boolean[] = new Array(w * h).fill(false);
  const parents: number[] = new Array(w * h).fill(-1);

  let head: number = 0,
    tail: number = 0;

  queue[tail++] = start;
  visited[start] = true;

  while (head < tail) {
    const current: number = queue[head++];
    if (current === end) break;
    for (const node of graph[current]) {
      if (!visited[node]) {
        visited[node] = true;
        parents[node] = current;
        queue[tail++] = node;
      }
    }
  }

  const path: boolean[] = new Array(h * w).fill(false);
  let current: number = end;
  while (parents[current] !== -1) {
    path[current] = true;
    current = parents[current];
  }

  return path;
}

function assignNeighbors(node: number) {
  const c = coord(node);
  const dir = c[0] % 2 === 0 ? EVEN_DIRS : ODD_DIRS;
  for (const d of dir) {
    const newY: number = (c[0] + d[0] + h) % h;
    const newX: number = (c[1] + d[1] + w) % w;
    if (maze[newY][newX] !== "#") graph[node].add(key(newY, newX));
  }
}

function key(i: number, j: number): number {
  return i * w + j;
}

function coord(node: number): number[] {
  return [Math.floor(node / w), node % w];
}
