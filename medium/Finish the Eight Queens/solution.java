import java.util.*;

class Solution {
    final static int N = 8;
    static char[][] board = new char[N][N];

    static int queens = 0;
    static boolean[] rows = new boolean[N];
    static boolean[] cols = new boolean[N];
    static boolean[] leftDiag = new boolean[2 * N - 1];
    static boolean[] rightDiag = new boolean[2 * N - 1];

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        for (int i = 0; i < N; i++) {
            String row = in.next();
            board[i] = row.toCharArray();
            for (int j = 0; j < N; j++) {
                if (board[i][j] == 'Q') {
                    refreshData(i, j, 1, true);
                }
            }
        }
        if (placeQueens(0))
            for (int i = 0; i < N; i++) {
                System.out.println(board[i]);
            }
    }

    static boolean placeQueens(int row) {
        if (queens == N)
            return true;
        if (row >= N)
            return false;

        if (rows[row])
            return placeQueens(row + 1);

        for (int col = 0; col < N; col++) {
            if (board[row][col] == '.' && !cols[col] && !leftDiag[row - col + (N - 1)] && !rightDiag[row + col]) {
                refreshData(row, col, 1, true);
                board[row][col] = 'Q';

                if (placeQueens(row + 1))
                    return true;

                refreshData(row, col, -1, false);
                board[row][col] = '.';
            }
        }

        return false;
    }

    static void refreshData(int row, int col, int i, boolean b) {
        queens += i;
        rows[row] = b;
        cols[col] = b;
        leftDiag[row - col + (N - 1)] = b;
        rightDiag[row + col] = b;
    }
}