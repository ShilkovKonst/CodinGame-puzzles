const width: number = parseInt(readline()); // the number of cells on the X axis
const height: number = parseInt(readline()); // the number of cells on the Y axis
const grid: boolean[][] = [];
for (let i = 0; i < height; i++) {
    // const line: string = readline(); // width characters, each either 0 or .
    grid.push(readline().split("").map((e: string) => e === "0"));
}
initializeNode();

function initializeNode(): void {
    for (let y1 = 0; y1 < grid.length; y1++) {
        for (let x1 = 0; x1 < grid[y1].length; x1++) {
            if (grid[y1][x1]) {
                const [y2, x2] = getNext(y1, x1, 0, 1);
                const [y3, x3] = getNext(y1, x1, 1, 0);
                console.log(`${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`);
            }
        }
    }
}

function getNext(y: number, x: number, dB: number, dR: number): number[] {
    let nY: number = y + dB;
    let nX: number = x + dR;
    while (nY < height && nX < width) {
        if (grid[nY][nX]) {
            return [nY, nX];
        }
        nY += dB;
        nX += dR;
    }
    return [-1, -1];
}
