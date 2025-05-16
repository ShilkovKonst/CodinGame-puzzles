using System;

class Player
{
    static int W;
    static int H;
    static int N;
    static int X;
    static int Y;
    static int[] intervalX, intervalY;

    static void Main(string[] args)
    {
        string[] inputs;
        inputs = Console.ReadLine().Split(' ');
        W = int.Parse(inputs[0]); // width of the building.
        H = int.Parse(inputs[1]); // height of the building.
        N = int.Parse(Console.ReadLine()); // maximum number of turns before game over.
        inputs = Console.ReadLine().Split(' ');
        X = int.Parse(inputs[0]);
        Y = int.Parse(inputs[1]);
        intervalX = new int[] { 0, W - 1 };
        intervalY = new int[] { 0, H - 1 };

        // game loop
        while (true)
        {
            string bDir = Console.ReadLine(); // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)

            // the location of the next window Batman should jump to.
            Console.WriteLine(SearchBomb(bDir));
        }
    }

    private static string SearchBomb(string bDir)
    {
        foreach (char c in bDir)
        {
            if (c == 'U')
                intervalY[1] = Y - 1;
            if (c == 'D')
                intervalY[0] = Y + 1;
            if (c == 'L')
                intervalX[1] = X - 1;
            if (c == 'R')
                intervalX[0] = X + 1;
        }
        Y = (intervalY[0] + intervalY[1]) / 2;
        X = (intervalX[0] + intervalX[1]) / 2;
        return X + " " + Y;
    }
}
