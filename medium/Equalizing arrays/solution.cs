using System;
using System.Linq;
using System.Collections.Generic;

class Solution
{
    static void Main(string[] args)
    {
        int N = int.Parse(Console.ReadLine());
        int[] a = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int[] b = Console.ReadLine().Split().Select(int.Parse).ToArray();

        List<LinkedList<int[]>> moves = new List<LinkedList<int[]>>();
        int diff = 0, totalMoves = 0;

        for (int i = 0; i < N; i++)
        {
            moves.Add(new LinkedList<int[]>());
            if (diff != 0)
            {
                totalMoves++;
                if (diff > 0)
                {
                    moves[i - 1].AddLast(new int[] { 1, diff });
                }
                else
                {
                    moves[i].AddLast(new int[] { -1, -diff });
                }
            }
            diff += a[i] - b[i];
        }

        Console.WriteLine(totalMoves);

        for (int i = 0; i < N; i++)
        {
            while (i >= 0 && moves[i].Count() != 0)
            {
                int[] move = moves[i].First();
                int D = move[0], V = move[1];
                if (a[i] < V) break;
                a[i] -= V;
                a[i + D] += V;
                moves[i].RemoveFirst();

                Console.WriteLine((i + 1) + " " + D + " " + V);
                i--;
            }
        }
    }
}