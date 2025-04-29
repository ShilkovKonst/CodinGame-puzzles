using System;
using System.Collections.Generic;

class Solution
{
    private static Dir[] EVEN_DIRS = { new Dir(0, -1), new Dir(-1, -1), new Dir(-1, 0), new Dir(0, 1), new Dir(1, -1), new Dir(1, 0) };
    private static Dir[] ODD_DIRS = { new Dir(0, -1), new Dir(-1, 0), new Dir(-1, 1), new Dir(0, 1), new Dir(1, 0), new Dir(1, 1) };
    private static Dictionary<int, HashSet<int>> graph = new Dictionary<int, HashSet<int>>();
    private static int start = 0;
    private static int end = 0;

    private static int w;
    private static int h;
    private static char[] maze;

    static void Main(string[] args)
    {
        string[] inputs = Console.ReadLine().Split(' ');
        w = int.Parse(inputs[0]);
        h = int.Parse(inputs[1]);
        maze = new char[h * w];

        for (int i = 0; i < h; i++)
        {
            string row = Console.ReadLine();
            for (int j = 0; j < w; j++)
            {
                int key = Key(i, j);
                maze[key] = row[j];
                if (maze[key].Equals('S')) start = key;
                if (maze[key].Equals('E')) end = key;
                if (!maze[key].Equals('#')) graph.Add(key, new HashSet<int>());
            }
        }

        foreach (int node in graph.Keys)
        {
            assignNeighbors(node);
        }
        bool[] path = getBestPath(start, end);
        for (int i = 0; i < h; i++)
        {
            for (int j = 0; j < w; j++)
            {
                int key = Key(i, j);
                if (path[key]) maze[key] = maze[key].Equals('_') ? '.' : maze[key];
            }
            Console.WriteLine(new string(maze, i * w, w));
        }
    }

    private static bool[] getBestPath(int start, int end)
    {
        int[] queue = new int[h * w], parents = new int[h * w];
        bool[] visited = new bool[h * w];
        for (int i = 0; i < h * w; i++)
        {
            parents[i] = -1;
        }

        int head = 0, tail = 0;

        queue[tail++] = start;
        visited[start] = true;

        while (head < tail)
        {
            int subject = queue[head++];

            if (subject == end) break;

            foreach (int n in graph[subject])
            {
                if (!visited[n])
                {
                    visited[n] = true;
                    queue[tail++] = n;
                    parents[n] = subject;
                }
            }
        }
        bool[] path = new bool[h * w];
        int current = end;
        while (current != -1)
        {
            path[current] = true;
            current = parents[current];
        }
        return path;
    }

    private static void assignNeighbors(int node)
    {
        int[] c = { node / w, node % w };
        Dir[] dirs = c[0] % 2 == 0 ? EVEN_DIRS : ODD_DIRS;
        foreach (Dir d in dirs)
        {
            int newNode = Key((c[0] + d.y + h) % h, (c[1] + d.x + w) % w);
            if (!maze[newNode].Equals('#'))
            {
                graph[node].Add(newNode);
            }
        }
    }

    private static int Key(int y, int x)
    {
        return y * w + x;
    }

    private class Dir
    {
        public int y { get; }
        public int x { get; }

        public Dir(int y, int x)
        {
            this.y = y;
            this.x = x;
        }
    }
}