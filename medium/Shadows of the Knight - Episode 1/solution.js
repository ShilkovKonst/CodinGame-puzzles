var inputs = readline().split(' ');
const W = parseInt(inputs[0]); // width of the building.
const H = parseInt(inputs[1]); // height of the building.
const N = parseInt(readline()); // maximum number of turns before game over.

var inputs = readline().split(' ');
let X = parseInt(inputs[0]);
let Y = parseInt(inputs[1]);

let lX = 0;
let rX = W - 1;
let lY = 0;
let rY = H - 1;

// game loop
while (true) {
   const bombDir = readline(); // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)
   rY = bombDir.includes("U") ? Y - 1 : rY
   lY = bombDir.includes("D") ? Y + 1 : lY
   rX = bombDir.includes("L") ? X - 1 : rX
   lX = bombDir.includes("R") ? X + 1 : lX
   
   X = Math.floor((lX + rX) / 2)
   Y = Math.floor((lY + rY) / 2)
   // the location of the next window Batman should jump to.
   console.log(X + ' ' + Y);
}