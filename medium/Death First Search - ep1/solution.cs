using System;
using System.Collections.Generic;

class Player
{
    private static Dictionary<int, HashSet<int>> nodeGraph = new Dictionary<int, HashSet<int>>();
    private static Dictionary<int, int> gateways = new Dictionary<int, int>();

    static void Main(string[] args)
    {
        string[] inputs;
        inputs = Console.ReadLine().Split(' ');
        int N = int.Parse(inputs[0]); // the total number of nodes in the level, including the gateways
        int L = int.Parse(inputs[1]); // the number of links
        int E = int.Parse(inputs[2]); // the number of exit gateways
        for (int i = 0; i < L; i++)
        {
            inputs = Console.ReadLine().Split(' ');
            int N1 = int.Parse(inputs[0]); // N1 and N2 defines a link between these nodes
            int N2 = int.Parse(inputs[1]);
            if (!nodeGraph.ContainsKey(N1))
                nodeGraph.Add(N1, new HashSet<int>());
            if (!nodeGraph.ContainsKey(N2))
                nodeGraph.Add(N2, new HashSet<int>());
            nodeGraph[N1].Add(N2);
            nodeGraph[N2].Add(N1);
        }
        for (int i = 0; i < E; i++)
        {
            int EI = int.Parse(Console.ReadLine()); // the index of a gateway node
            gateways.Add(EI, EI);
        }

        // game loop
        while (true)
        {
            int SI = int.Parse(Console.ReadLine()); // The index of the node on which the Bobnet agent is positioned this turn
            Console.WriteLine(cutLinks(SI));
        }
    }

    private static String cutLinks(int SI)
    {
        int nodeToCut = -1;
        int maxThreat = -1;
        Dictionary<int, int> threats = calculateNodeThreats();

        foreach (int neighbor in nodeGraph[SI])
        {
            if (gateways.ContainsKey(neighbor))
            {
                nodeToCut = neighbor;
                break;
            }

            if (maxThreat < threats[neighbor] || (maxThreat == threats[neighbor] && neighbor < nodeToCut))
            {
                maxThreat = threats[neighbor];
                nodeToCut = neighbor;
            }
        }

        removeConnection(SI, nodeToCut);
        return SI + " " + nodeToCut;
    }

    private static Dictionary<int, int> calculateNodeThreats()
    {
        Dictionary<int, int> baseThreats = new Dictionary<int, int>();
        foreach (int node in nodeGraph.Keys)
        {
            int threat = 0;
            foreach (int neighbor in nodeGraph[node])
            {
                if (gateways.ContainsKey(neighbor))
                {
                    threat = 1;
                    break;
                }
            }
            baseThreats.Add(node, threat);
        }

        Dictionary<int, int> finalThreats = new Dictionary<int, int>();
        foreach (int node in nodeGraph.Keys)
        {
            int threat = baseThreats[node];
            foreach (int neighbor in nodeGraph[node])
            {
                threat += baseThreats[neighbor];
            }
            finalThreats.Add(node, threat);
        }
        
        return finalThreats;
    }

    private static void removeConnection(int a, int b)
    {
        nodeGraph[a].RemoveWhere((node) => node == b);
        nodeGraph[b].RemoveWhere((node) => node == a);
    }
}