using System;

class Player
{
    private static bool[,] grid;
    private static int width;
    private static int height;

    static void Main(string[] args)
    {
        width = int.Parse(Console.ReadLine()); // the number of cells on the X axis
        height = int.Parse(Console.ReadLine()); // the number of cells on the Y axis
        grid = new bool[height, width];
        for (int i = 0; i < height; i++)
        {
            string line = Console.ReadLine(); // width characters, each either 0 or .
            for (int j = 0; j < width; j++)
            {
                grid[i, j] = line[j].Equals('0');
            }
        }
        initializeNode();
    }

    private static void initializeNode()
    {
        for (int i = 0; i < height; i++)
        {
            for (int j = 0; j < width; j++)
            {
                if (grid[i, j])
                {
                    int[] nR = getNext(i, j, 0, 1);
                    int[] nB = getNext(i, j, 1, 0);
                    Console.WriteLine(j + " " + i + " " + nR[1] + " " + nR[0] + " " + nB[1] + " " + nB[0]);
                }
            }
        }
    }

    private static int[] getNext(int y, int x, int dY, int dX)
    {
        int nY = y + dY;
        int nX = x + dX;

        while (nY < height && nX < width)
        {
            if (grid[nY, nX])
            {
                return new int[] { nY, nX };
            }
            nY += dY;
            nX += dX;
        }
        return new int[] { -1, -1 };
    }
}