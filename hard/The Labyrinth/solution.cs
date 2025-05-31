using System;
using System.Linq;
using System.Collections.Generic;

class Player
{
    static readonly Coord[] DIRS = { new Coord(0, -1), new Coord(0, 1), new Coord(-1, 0), new Coord(1, 0) };
    static int R, C, A;
    static char[,] maze;
    static Coord? start, finish;
    static State currentState = State.EXPLORE;

    static void Main(string[] args)
    {
        string[] inputs;
        inputs = Console.ReadLine().Split(' ');
        R = int.Parse(inputs[0]); // number of rows.
        C = int.Parse(inputs[1]); // number of columns.
        A = int.Parse(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.
        maze = new char[R, C];
        // game loop
        while (true)
        {
            inputs = Console.ReadLine().Split(' ');
            Coord current = new Coord(int.Parse(inputs[0]), int.Parse(inputs[1])); // row where Rick is located, column where Rick is located.

            for (int i = 0; i < R; i++)
            {
                char[] ROW = Console.ReadLine().ToCharArray(); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
                for (int j = 0; j < C; j++)
                {
                    maze[i, j] = ROW[j];
                    if (maze[i, j] == 'T')
                        start = new Coord(i, j);
                    if (maze[i, j] == 'C')
                        finish = new Coord(i, j);
                }
            }

            List<Coord> bestRoute = GetBestRoute(current);
            Console.WriteLine(ChooseDirection(bestRoute)); // Rick's next move (UP DOWN LEFT or RIGHT).

        }
    }

    static String ChooseDirection(List<Coord> path)
    {
        if (!path.Equals(null))
        {
            Coord from = path[0], to = path[1];
            if (to.Y - from.Y == -1) return "UP";
            if (to.Y - from.Y == 1) return "DOWN";
            if (to.X - from.X == -1) return "LEFT";
            if (to.X - from.X == 1) return "RIGHT";
        }
        return "ERROR";
    }

    static List<Coord> GetBestRoute(Coord current)
    {
        checkEscapeRoute();

        if (currentState == State.EXPLORE)
        {
            return calculateRoute(current, (Coord?)null);
        }

        if (haveToEscape(current))
            currentState = State.ESCAPE;

        return calculateRoute(current, currentState == State.ESCAPE ? start : finish);
    }

    static void checkEscapeRoute()
    {
        if (currentState != State.EXPLORE || finish == null)
            return;

        List<Coord> finalRoute = calculateRoute((Coord)finish, start);
        if (finalRoute != null && finalRoute.Count() <= A + 1)
        {
            currentState = State.TO_FINISH;
        }
    }

    static List<Coord> calculateRoute(Coord from, Coord? to)
    {
        Coord[] queue = new Coord[R * C];
        Coord?[] parents = new Coord?[R * C];
        bool[] visited = new bool[R * C];

        int head = 0, tail = 0;

        queue[tail++] = from;
        visited[from.Key()] = true;

        return routeToTarget(from, to, head, tail, queue, parents, visited);
    }

    static List<Coord> routeToTarget(Coord from, Coord? to, int head, int tail, Coord[] queue, Coord?[] parents, bool[] visited)
    {
        while (head < tail)
        {
            Coord current = queue[head++];
            int cy = current.Y, cx = current.X;

            if (to != null && current.Equals(to))
            {
                return buildPath(parents, from, (Coord)to);
            }

            foreach (Coord d in DIRS)
            {
                int ny = cy + d.Y, nx = cx + d.X;
                Coord next = new Coord(ny, nx);
                int nextKey = next.Key();

                if (!isInBounds(ny, nx) || visited[nextKey])
                    continue;

                char cell = maze[ny, nx];
                if (!isValidCell(cell) && !isGoingToFinish(cell))
                    continue;

                visited[nextKey] = true;
                parents[nextKey] = current;
                queue[tail++] = next;

                if (to == null && isValidCandidate(ny, nx))
                {
                    return buildPath(parents, (Coord)from, next);
                }
            }
        }
        return null;
    }

    static List<Coord> buildPath(Coord?[] parents, Coord from, Coord to)
    {
        List<Coord> path = new List<Coord>();
        Coord? current = to;
        while (current.HasValue)
        {
            path.Insert(0, current.Value);
            current = parents[current.Value.Key()];
        }
        return path[0].Equals(from) ? path : null;
    }

    static bool isValidCandidate(int y, int x)
    {
        foreach (Coord d in DIRS)
        {
            int ny = y + d.Y, nx = x + d.X;
            if (isInBounds(ny, nx) && maze[ny, nx] == '?')
            {
                return true;
            }
        }
        return false;
    }

    static bool isInBounds(int y, int x)
    {
        return y >= 0 && y < R && x >= 0 && x < C;
    }

    static bool haveToEscape(Coord current)
    {
        return currentState == State.TO_FINISH && current.Equals(finish);
    }

    static bool isGoingToFinish(char cell)
    {
        return currentState == State.TO_FINISH && cell == 'C';
    }

    static bool isValidCell(char cell)
    {
        return cell == '.' || cell == 'T';
    }


    enum State
    {
        EXPLORE, ESCAPE, TO_FINISH
    }

    struct Coord
    {
        public int Y { get; }
        public int X { get; }

        public Coord(int y, int x)
        {
            Y = y;
            X = x;
        }

        public int Key()
        {
            return Y * C + X;
        }

        public override string ToString()
        {
            return Y + " " + X;
        }
    }
}