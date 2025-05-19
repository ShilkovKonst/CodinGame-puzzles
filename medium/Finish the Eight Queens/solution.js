const N = 8;

const board = new Array(N);
const rows = new Array(N).fill(false);
const cols = new Array(N).fill(false);
const leftDiagonal = new Array(2 * N - 1).fill(false);
const rightDiagonal = new Array(2 * N - 1).fill(false);

let queens = 0;

for (let i = 0; i < 8; i++) {
    const row = readline().split("");
    board[i] = row;
    for (let j = 0; j < 8; j++) {
        if (board[i][j] === "Q") {
            refreshData(i, j, 1, true);
        }
    }
}

if (placeQueens(0))
    for (let i = 0; i < 8; i++) {
        console.log(board[i].join(""));
    }

function placeQueens(row) {
    if (queens === N) return true;
    if (row >= N) return false;

    if (rows[row]) {
        return placeQueens(row + 1);
    }

    for (let col = 0; col < N; col++) {
        if (board[row][col] === "." &&
            !rows[row] &&
            !cols[col] &&
            !leftDiagonal[row - col + (N - 1)] &&
            !rightDiagonal[row + col]
        ) {
            refreshData(row, col, 1, true);
            board[row][col] = "Q";

            if (placeQueens(row + 1))
                return true;

            refreshData(row, col, -1, false);
            board[row][col] = ".";
        }
    }
    return false;
}

function refreshData(row, col, i, b) {
    queens += i;
    rows[row] = b;
    cols[col] = b;
    leftDiagonal[row - col + (N - 1)] = b;
    rightDiagonal[row + col] = b;
}
