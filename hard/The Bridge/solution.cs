using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;

class Player
{
    static readonly string[] COMMANDS = ["SPEED", "WAIT", "JUMP", "UP", "DOWN", "SLOW"];
    static int M; // the amount of motorbikes to control
    static int V; // the minimum amount of motorbikes that must survive

    static readonly string[] roadMap = new string[4];
    static Bike[] bikes;

    static Path bestPath = null;
    static HashSet<string> visited = new();

    static void Main(string[] args)
    {
        M = int.Parse(Console.ReadLine()); // the amount of motorbikes to control
        V = int.Parse(Console.ReadLine()); // the minimum amount of motorbikes that must survive
        bikes = new Bike[M];
        for (int i = 0; i < M; i++)
        {
            bikes[i] = new Bike();
        }
        for (int i = 0; i < 4; i++)
        {
            roadMap[i] = Console.ReadLine(); // L0 to L3 are lanes of the road. A dot character . represents a safe space, a zero 0 represents a hole in the road.
        }
        int count = 0;
        // game loop
        while (true)
        {
            int S = int.Parse(Console.ReadLine()); // the motorbikes' speed
            for (int i = 0; i < M; i++)
            {
                string[] inputs = Console.ReadLine().Split(' ');
                bikes[i].X = int.Parse(inputs[0]); // x coordinate of the motorbike
                bikes[i].Y = int.Parse(inputs[1]); // y coordinate of the motorbike
                bikes[i].A = int.Parse(inputs[2]) == 1; // indicates whether the motorbike is activated "1" or detroyed "0"
            }

            if (count == 0)
            {
                State state = new(bikes, S, new List<string>());
                DFS(state);
            }

            Console.WriteLine(bestPath.Commands[count]);
            count++;
        }
    }

    static void DFS(State state)
    {
        if (state.Finished)
        {
            var candidate = new Path(state.Commands, state.AliveCount);
            if (candidate.IsBetterThan(bestPath))
                bestPath = candidate;
            return;
        }

        if (state.Failed || state.AliveCount < V)
            return;

        string key = state.GetKey();
        if (visited.Contains(key))
            return;

        visited.Add(key);

        foreach (string cmd in COMMANDS)
        {
            if ((cmd.Equals("UP") || cmd.Equals("DOWN")) && !state.Bikes.All((Bike b) => b.CanChangeLane(cmd)))
                continue;

            State next = state.ApplyCommand(cmd);
            if (next.AliveCount >= V)
                DFS(next);
        }
    }

    class State(Bike[] bikes, int speed, List<string> commands)
    {
        public int Speed = speed;
        public Bike[] Bikes = bikes.Select((Bike b) => b.Clone()).ToArray();
        public List<string> Commands = new List<string>(commands);

        public int AliveCount => Bikes.Count(b => b.A);

        public bool Finished => Bikes.Count(b => b.A && b.X > roadMap[0].Length) >= V;

        public bool Failed => Commands.Count() > 50;

        public State ApplyCommand(string cmd)
        {
            var nextBikes = Bikes.Select((Bike b) => b.Clone()).ToArray();
            int nextSpeed = Speed;

            if (cmd == "SPEED") nextSpeed++;
            else if (cmd == "SLOW") nextSpeed = Math.Max(0, Speed - 1);

            foreach (Bike b in nextBikes)
            {
                if (!b.A) continue;

                switch (cmd)
                {
                    case "JUMP":
                        b.Jump(nextSpeed);
                        break;
                    case "UP":
                        b.ChangeLane(nextSpeed, cmd);
                        break;
                    case "DOWN":
                        b.ChangeLane(nextSpeed, cmd);
                        break;
                    default:
                        b.Move(nextSpeed);
                        break;
                }
            }

            return new State(nextBikes, nextSpeed, Commands.Concat(new[] { cmd }).ToList());
        }

        public string GetKey()
        {
            var sb = new StringBuilder();
            sb.Append(Speed);
            foreach (var b in Bikes)
            {
                if (!b.A)
                    sb.Append("|X");
                else
                    sb.AppendFormat("|{0}:{1}", b.X, b.Y);
            }
            return sb.ToString();
        }
    }

    class Path(List<string> commands, int activeBikes)
    {
        public List<string> Commands = new List<string>(commands);
        public int ActiveBikes = activeBikes;

        public bool IsBetterThan(Path other) => other == null || (
            ActiveBikes > other.ActiveBikes && Commands.Count <= 50) ||
            Commands.Count < other.Commands.Count;
    }

    class Bike
    {
        public int X, Y;
        public bool A;

        public Bike() { }

        public Bike(int x, int y, bool a)
        {
            X = x; Y = y; A = a;
        }

        public Bike Clone()
        {
            return new Bike(X, Y, A);
        }

        public void Move(int speed)
        {
            A = IsGoodRoad(speed);
            X += speed;
        }

        public void Jump(int speed)
        {
            A = IsGoodSpot(X + speed) || roadMap[Y][X + speed] != '0';
            X += speed;
        }

        public bool CanChangeLane(string cmd) => !A || (cmd.Equals("UP") && Y > 0) || (cmd.Equals("DOWN") && Y < 3);

        public void ChangeLane(int speed, string cmd)
        {
            int dir = cmd.Equals("UP") ? -1 : cmd.Equals("DOWN") ? 1 : 0;
            int targetY = Y + dir;
            A = IsGoodToChangeLane(speed, targetY);
            X += speed;
            Y = targetY;
        }

        bool IsGoodRoad(int speed)
        {
            for (int i = X + 1; i <= X + speed; i++)
            {
                if (i < roadMap[Y].Count())
                {
                    if (roadMap[Y][i] == '0') return false;
                }
            }
            return true;
        }

        bool IsGoodToChangeLane(int speed, int targetY)
        {
            for (int dx = 1; dx < speed; dx++)
            {
                int x = X + dx;
                if (x < roadMap[Y].Count() && (roadMap[Y][x] == '0' || roadMap[targetY][x] == '0'))
                    return false;

            }
            return IsGoodSpot(X + speed) || roadMap[targetY][X + speed] != '0';
        }

        bool IsGoodSpot(int pos) => pos >= roadMap[Y].Count();
    }
}