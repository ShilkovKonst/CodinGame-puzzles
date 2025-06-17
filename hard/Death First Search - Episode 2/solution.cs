using System;
using System.Linq;
using System.Collections.Generic;

class Player
{
    static Dictionary<int, HashSet<int>> nodeGraph = new Dictionary<int, HashSet<int>>();
    static readonly Dictionary<int, int> threats = new Dictionary<int, int>();
    static int maxThreat;
    static HashSet<int> gateways = new HashSet<int>();
    static int N;

    static void Main(string[] args)
    {
        string[] inputs;
        inputs = Console.ReadLine().Split(' ');
        N = int.Parse(inputs[0]); // the total number of nodes in the level, including the gateways
        int L = int.Parse(inputs[1]); // the number of links
        int E = int.Parse(inputs[2]); // the number of exit gateways
        for (int i = 0; i < L; i++)
        {
            inputs = Console.ReadLine().Split(' ');
            int N1 = int.Parse(inputs[0]); // N1 and N2 defines a link between these nodes
            int N2 = int.Parse(inputs[1]);

            nodeGraph.TryAdd(N1, new HashSet<int>());
            nodeGraph[N1].Add(N2);

            nodeGraph.TryAdd(N2, new HashSet<int>());
            nodeGraph[N2].Add(N1);
        }
        for (int i = 0; i < E; i++)
        {
            int EI = int.Parse(Console.ReadLine()); // the index of a gateway node
            gateways.Add(EI);
        }

        // game loop
        while (true)
        {
            int SI = int.Parse(Console.ReadLine()); // The index of the node on which the Bobnet agent is positioned this turn
            CalculateNodeThreats();
            Console.WriteLine(CutLink(SI));
        }
    }

    static string CutLink(int SI)
    {
        int fromNode = SI;
        int toNode = GetNodeToCut(SI);

        if (toNode == -1)
        {
            var mostDangerLink = CutMostDangerLink(SI);
            fromNode = mostDangerLink.fromNode;
            toNode = mostDangerLink.toNode;
        }

        RemoveConnection(fromNode, toNode);
        return $"{fromNode} {toNode}";
    }

    private static void RemoveConnection(int a, int b)
    {
        nodeGraph[a].Remove(b);
        nodeGraph[b].Remove(a);
    }

    static (int fromNode, int toNode) CutMostDangerLink(int SI)
    {
        int node = -1;
        int bestSteps = int.MaxValue;
        int bestScore = int.MaxValue;

        foreach (int n in nodeGraph.Keys)
        {
            if (threats[n] < maxThreat || gateways.Contains(n) || n == SI)
                continue;

            var path = AgentToNode(SI, n);
            int pathScore = path.steps - path.gws;

            if (pathScore < bestScore || (pathScore == bestScore && path.steps < bestSteps))
            {
                bestScore = pathScore;
                bestSteps = path.steps;
                node = n;
            }
        }
        int gateway = GetNodeToCut(node);

        return (gateway, node);
    }

    static (int steps, int gws) AgentToNode(int from, int to)
    {
        int[] queue = new int[N], parents = new int[N];
        bool[] visited = new bool[N];

        Array.Fill(parents, -1);
        int head = 0, tail = 0;

        queue[tail++] = from;
        visited[from] = true;

        while (head < tail)
        {
            int current = queue[head++];
            if (current == to)
                return CountSteps(from, to, parents);

            foreach (int n in nodeGraph[current])
                if (!visited[n] && parents[n] == -1 && !gateways.Contains(n))
                {
                    queue[tail++] = n;
                    visited[n] = true;
                    parents[n] = current;
                }
        }
        return (-1, -1);
    }

    static (int, int) CountSteps(int from, int to, int[] parents)
    {
        int steps = 0;
        int current = to;
        int gws = 0;
        while (current != from)
        {
            steps++;
            gws += threats[current];
            current = parents[current];
        }

        return (steps, gws);
    }

    static int GetNodeToCut(int fromNode)
    {
        foreach (int n in nodeGraph[fromNode])
            if (gateways.Contains(n))
                return n;
        return -1;
    }

    private static void CalculateNodeThreats()
    {
        threats.Clear();
        foreach (int node in nodeGraph.Keys)
        {
            int count = 0;
            foreach (int neib in nodeGraph[node])
                count += gateways.Contains(neib) ? 1 : 0;
            threats[node] = count;
        }
        maxThreat = threats.Values.Max();
    }
}