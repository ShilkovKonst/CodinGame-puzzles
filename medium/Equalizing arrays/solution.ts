interface Move {
    dir: number;
    val: number;
}

const N: number = parseInt(readline());
const a: number[] = readline().split(' ').map(Number);
const b: number[] = readline().split(' ').map(Number);

const moves: Move[][] = Array.from({ length: N }, () => []);
let diff = 0, totalMoves = 0;

for (let i = 0; i < N; i++) {
    if (diff != 0) {
        totalMoves++;
        const move: Move = { dir: (diff > 0 ? 1 : -1), val: Math.abs(diff) };
        moves[i + (diff > 0 ? -1 : 0)].push(move);
    }
    diff += a[i] - b[i];
}

console.log(totalMoves);

for (let i = 0; i < N; i++) {
    while (i >= 0 && moves[i].length != 0) {
        const { dir, val } = moves[i][0];
        if (a[i] < val) {
            break;
        }
        a[i] -= val;
        a[i + dir] += val;
        moves[i].shift();
        
        console.log(`${(i + 1)} ${dir} ${val}`);
        i--;
    }
}