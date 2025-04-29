const EVEN_DIRS = [
    [0, -1],
    [-1, -1],
    [-1, 0],
    [0, 1],
    [1, -1],
    [1, 0],
];
const ODD_DIRS = [
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 0],
    [1, 1],
];
const graph = {};
let start, end;

var inputs = readline().split(" ");
const w = parseInt(inputs[0]);
const h = parseInt(inputs[1]);
const maze = new Array(h);

for (let y = 0; y < h; y++) {
    maze[y] = readline();
    for (let x = 0; x < w; x++) {
        if (maze[y][x] === "S") start = key(y, x);
        if (maze[y][x] === "E") end = key(y, x);
        if (maze[y][x] !== "#") graph[key(y, x)] = new Set();
    }
}

for (const nodeKey in graph) {
    assignNeighbors(nodeKey);
}

const path = getBestPath(start, end);
for (let i = 0; i < h; i++) {
    const arr = maze[i].split("");
    for (let j = 0; j < w; j++) {
        if (path[key(i, j)]) {
            arr[j] = arr[j] === "_" ? "." : arr[j];
        }
    }
    console.log(arr.join(""));
}

function getBestPath(start, end) {
    const queue = new Array(w * h);
    const visited = new Array(w * h).fill(false);
    const parents = new Array(w * h).fill(-1);

    let head = 0, tail = 0;

    queue[tail++] = start;
    visited[start] = true;

    while (head < tail) {
        const current = queue[head++];

        if (current === end) break;

        for (const n of graph[current]) {
            if (!visited[n]) {
                visited[n] = true;
                parents[n] = current;
                queue[tail++] = n;
            }
        }
    }

    const path = new Array(w * h).fill(false);
    let current = parents[end];
    while (parents[current] !== -1) {
        path[current] = true;
        current = parents[current];
    }

    return path;
}

function assignNeighbors(nodeKey) {
    const coord = coords(nodeKey);
    const dir = coord[0] % 2 === 0 ? EVEN_DIRS : ODD_DIRS;
    for (const d of dir) {
        const newY = (coord[0] + d[0] + h) % h;
        const newX = (coord[1] + d[1] + w) % w;

        if (maze[newY][newX] !== "#") {
            graph[nodeKey].add(key(newY, newX));
        }
    }
}

function coords(key) {
    return [Math.floor(key / w), key % w];
}

function key(y, x) {
    return y * w + x;
}
