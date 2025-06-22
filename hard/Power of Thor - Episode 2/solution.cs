using System;
using System.Linq;
using System.Collections.Generic;

class Player
{
    const int HEIGHT = 18;
    const int WIDTH = 40;
    static readonly (int, int)[] DIRS = new (int dy, int dx)[] { (-1, -1), (-1, 0), (-1, 1), (1, -1), (1, 0), (1, 1), (0, -1), (0, 1) };

    static int TY;
    static int TX;
    static int H;              // the remaining number of hammer strikes.
    static int N;              // the number of giants which are still present on the map.

    static int giantsInArea;
    static bool inDanger;
    static bool surrounded;
    static (int, int)? target;

    static bool[,] forbiddenCells = new bool[HEIGHT, WIDTH];

    static void Main(string[] args)
    {
        string[] inputs;
        inputs = Console.ReadLine().Split(' ');

        TX = int.Parse(inputs[0]);
        TY = int.Parse(inputs[1]);
        (int ly, int lx) lastPos = (TY, TX);

        while (true)
        {
            ClearStates();

            inputs = Console.ReadLine().Split(' ');
            H = int.Parse(inputs[0]);
            N = int.Parse(inputs[1]);

            var gCoords = ReadGiantCoordinates();
            var barycenter = GetBarycenter(gCoords);

            var env = CheckEnv();
            inDanger = env.inDanger;
            surrounded = env.surrounded;

            target = FindNextStep(barycenter, lastPos);

            lastPos = (TY, TX);
            // The movement or action to be carried out: WAIT STRIKE N NE E SE S SW W or N
            Console.WriteLine(MakeDecision());
        }
    }

    static string MakeDecision() => CanStrike() ? "STRIKE" : GoToTarget(target.Value.Item1, target.Value.Item2);

    static string GoToTarget(int ty, int tx)
    {
        if (TY == ty && TX == tx) return "WAIT";

        string direction = "";
        direction += TY < ty ? "S" : TY > ty ? "N" : "";
        direction += TX < tx ? "E" : TX > tx ? "W" : "";

        ApplyNewPos(ty, tx);

        return direction;
    }

    static void ApplyNewPos(int targetY, int targetX)
    {
        TY += TY < targetY ? 1 : TY > targetY ? -1 : 0;
        TX += TX < targetX ? 1 : TX > targetX ? -1 : 0;
    }

    static bool CanStrike() => giantsInArea >= ((N + H - 1) / H) || surrounded;

    static (int, int)? FindNextStep((int, int) barycenter, (int, int) lastPos)
    {
        return inDanger ? GetClosestCandidate(GetNeighbors((TY, TX)), barycenter, lastPos) : barycenter;
    }

    static (int, int)? GetClosestCandidate(List<(int, int)> candidates, (int y, int x) target, (int, int) lastPos)
    {
        double bestDist = Double.MaxValue;
        (int, int)? bestC = null;

        foreach ((int cy, int cx) in candidates)
        {
            if (forbiddenCells[cy, cx]) continue;

            double dist = Math.Pow(target.y - cy, 2) + Math.Pow(target.x - cx, 2);
            if (dist < bestDist && (cy, cx) != lastPos)
            {
                bestDist = dist;
                bestC = (cy, cx);
            }
        }
        return bestC.HasValue ? bestC.Value : null;
    }

    static (bool inDanger, bool surrounded) CheckEnv()
    {
        bool inDanger = false, surrounded = true;
        foreach (var (ny, nx) in GetNeighbors((TY, TX)))
        {
            if (forbiddenCells[ny, nx] && !inDanger)
                inDanger = true;
            if (!forbiddenCells[ny, nx] && surrounded)
                surrounded = false;
        }
        return (inDanger, surrounded);
    }

    static (int, int) GetBarycenter((int[] ys, int[] xs) gCoords)
    {
        int y = gCoords.ys.Sum() / N;
        int x = gCoords.xs.Sum() / N;

        return (y, x);
    }

    static (int[] ys, int[] xs) ReadGiantCoordinates()
    {
        (int[] ys, int[] xs) coords = (new int[N], new int[N]);

        for (int i = 0; i < N; i++)
        {
            string[] inputs = Console.ReadLine().Split(' ');
            int X = int.Parse(inputs[0]);
            int Y = int.Parse(inputs[1]);

            coords.ys[i] = Y;
            coords.xs[i] = X;

            PopulateForbiddenCells(Y, X);

            if (IsInStrikeArea(Y, X)) giantsInArea++;
        }

        return coords;
    }

    static bool IsInStrikeArea(int gy, int gx) => Math.Abs(gy - TY) <= 5 && Math.Abs(gx - TX) <= 5;

    static void PopulateForbiddenCells(int y, int x)
    {
        forbiddenCells[y, x] = true;
        foreach ((int ny, int nx) in GetNeighbors((y, x)))
        {
            forbiddenCells[ny, nx] = true;
        }
    }

    static List<(int, int)> GetNeighbors((int, int) center)
    {
        (int y, int x) = center;
        List<(int, int)> neighbors = new List<(int, int)>();

        foreach (var (dy, dx) in DIRS)
        {
            int ny = y + dy;
            int nx = x + dx;
            if (IsInBounds(ny, nx))
                neighbors.Add((ny, nx));
        }
        return neighbors;
    }

    static bool IsInBounds(int y, int x) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;

    static void ClearStates()
    {
        giantsInArea = 0;
        inDanger = false;
        Array.Clear(forbiddenCells, 0, forbiddenCells.Length);
    }
}