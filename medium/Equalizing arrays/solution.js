const N = parseInt(readline());
const a = readline().split(" ").map(Number);
const b = readline().split(" ").map(Number);

const moves = Array.from({ length: N }, () => []);
let diff = 0,
  totalMoves = 0;

for (let i = 0; i < N; i++) {
  if (diff != 0) {
    totalMoves++;
    moves[i + (diff > 0 ? -1 : 0)].push({
      D: diff > 0 ? 1 : -1,
      V: Math.abs(diff),
    });
  }
  diff += a[i] - b[i];
}

console.log(totalMoves);

for (let i = 0; i < N; i++) {
  while (i >= 0 && moves[i].length != 0) {
    const {D, V} = moves[i][0];
    if (a[i] < V) {
      break;
    }
    a[i] -= V;
    a[i + D] += V;
    moves[i].shift();
    
    console.log(i + 1 + " " + D + " " + V);
    i--;
  }
}
