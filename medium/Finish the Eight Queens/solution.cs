using System;

class Solution
{
    const int N = 8;
    static string[] board = new string[N];

    static int queens = 0;
    static bool[] rows = new bool[N];
    static bool[] cols = new bool[N];
    static bool[] leftD = new bool[2 * N - 1];
    static bool[] rightD = new bool[2 * N - 1];

    static void Main(string[] args)
    {
        for (int i = 0; i < 8; i++)
        {
            string row = Console.ReadLine();
            board[i] = row;
            for (int j = 0; j < N; j++)
            {
                if (board[i][j] == 'Q')
                {
                    refreshData(i, j, 1, true);
                }
            }
        }
        if (placeQueens(0))
            for (int i = 0; i < 8; i++)
            {
                Console.WriteLine(board[i]);
            }
    }
    
    static bool placeQueens(int row)
    {
        if (queens == N) return true;
        if (row >= N) return false;

        if (rows[row]) return placeQueens(row + 1);

        for (int col = 0; col < N; col++)
        {
            if (board[row][col] == '.' && !cols[col] && !leftD[row - col + N - 1] && !rightD[row + col])
            {
                refreshData(row, col, 1, true);
                board[row] = replaceChar(row, col, 'Q');

                if (placeQueens(row + 1)) return true;

                refreshData(row, col, -1, false);
                board[row] = replaceChar(row, col, '.');
            }
        }

        return false;
    }

    static void refreshData(int row, int col, int i, bool b)
    {
        queens += i;
        rows[row] = b;
        cols[col] = b;
        leftD[row - col + N - 1] = b;
        rightD[row + col] = b;
    }

    static string replaceChar(int row, int col, char c)
    {
        char[] rowChars = board[row].ToCharArray();
        rowChars[col] = c;
        return new string(rowChars);
    }
}