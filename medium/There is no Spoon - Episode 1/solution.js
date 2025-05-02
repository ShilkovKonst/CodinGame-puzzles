const width = parseInt(readline()); // the number of cells on the X axis
const height = parseInt(readline()); // the number of cells on the Y axis

const grid = [];
for (let i = 0; i < height; i++) {
  grid.push(
    readline()
      .split("")
      .map((e) => e === "0")
  ); // width characters, each either 0 or .
}

getNode(grid);

function getNode(grid) {
  for (let y1 = 0; y1 < grid.length; y1++) {
    for (let x1 = 0; x1 < grid[y1].length; x1++) {
      if (grid[y1][x1]) {
        const [x2, y2] = getRight(grid, y1, x1);
        const [x3, y3] = getBottom(grid, y1, x1);
        1;
        console.log(`${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`);
      }
    }
  }
}

function getRight(grid, y, x) {
  for (let k = x + 1; k < grid[y].length; k++) {
    if (grid[y][k]) {
      return [k, y];
    }
  }
  return [-1, -1];
}

function getBottom(grid, y, x) {
  for (let k = y + 1; k < grid.length; k++) {
    if (grid[k][x]) {
      return [x, k];
    }
  }
  return [-1, -1];
}
