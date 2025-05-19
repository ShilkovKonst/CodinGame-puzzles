using System;

class Player
{
    static int W; // number of columns.
    static int H; // number of rows.
    static Room[,] maze;

    static void Main(string[] args)
    {
        string[] inputs;
        inputs = Console.ReadLine().Split(' ');
        W = int.Parse(inputs[0]); // number of columns.
        H = int.Parse(inputs[1]); // number of rows.
        maze = new Room[H, W];

        for (int i = 0; i < H; i++)
        {
            string[] LINE = Console.ReadLine().Split(' '); // represents a line in the grid and contains W integers. Each integer represents one room of a given type.
            for (int j = 0; j < W; j++)
            {
                int id = int.Parse(LINE[j]);
                maze[i, j] = Room.GetRoomTypeById(id);
            }
        }
        int EX = int.Parse(Console.ReadLine()); // the coordinate along the X axis of the exit (not useful for this first mission, but must be read).

        // game loop
        while (true)
        {
            inputs = Console.ReadLine().Split(' ');
            Console.WriteLine(CalculateRoute(inputs));
        }
    }

    static Position CalculateRoute(string[] inputs)
    {
        Position pos = new Position(int.Parse(inputs[0]), int.Parse(inputs[1]));
        string entry = inputs[2];
        Room currentRoom = maze[pos.Y, pos.X];
        Direction dir = currentRoom.GetRightExit(entry);

        return pos.Move(dir);
    }

    struct Position
    {
        public int X { get; }
        public int Y { get; }

        public Position(int x, int y)
        {
            this.X = x;
            this.Y = y;
        }

        public Position Move(Direction d)
        {
            return d switch
            {
                Direction.LEFT => new Position(X - 1, Y),
                Direction.RIGHT => new Position(X + 1, Y),
                Direction.BOTTOM => new Position(X, Y + 1),
                _ => this
            };
        }

        public override string ToString()
        {
            return X + " " + Y;
        }
    }

    class Room
    {
        string Type { get; }
        Direction FromLeft { get; }
        Direction FromTop { get; }
        Direction FromRight { get; }

        public Room(string type, Direction fromLeft, Direction fromTop, Direction fromRight)
        {
            this.Type = type;
            this.FromLeft = fromLeft;
            this.FromTop = fromTop;
            this.FromRight = fromRight;
        }

        public static Room GetRoomTypeById(int id)
        {
            return AllRooms[id];
        }

        public Direction GetRightExit(string entry)
        {
            return entry switch
            {
                "LEFT" => FromLeft,
                "TOP" => FromTop,
                "RIGHT" => FromRight,
                _ => Direction.INVALID
            };
        }

        public override string ToString()
        {
            return "Type: " + Type;
        }

        private static readonly Room[] AllRooms = new Room[]
        {
            new Room("0", Direction.INVALID, Direction.INVALID, Direction.INVALID),
            new Room("1", Direction.BOTTOM, Direction.BOTTOM, Direction.BOTTOM),
            new Room("2", Direction.RIGHT, Direction.INVALID, Direction.LEFT),
            new Room("3", Direction.INVALID, Direction.BOTTOM, Direction.INVALID),
            new Room("4", Direction.INVALID, Direction.LEFT, Direction.BOTTOM),
            new Room("5", Direction.BOTTOM, Direction.RIGHT, Direction.INVALID),
            new Room("6", Direction.RIGHT, Direction.INVALID, Direction.LEFT),
            new Room("7", Direction.INVALID, Direction.BOTTOM, Direction.BOTTOM),
            new Room("8", Direction.BOTTOM, Direction.INVALID, Direction.BOTTOM),
            new Room("9", Direction.BOTTOM, Direction.BOTTOM, Direction.INVALID),
            new Room("10", Direction.INVALID, Direction.LEFT, Direction.INVALID),
            new Room("11", Direction.INVALID, Direction.RIGHT, Direction.INVALID),
            new Room("12", Direction.INVALID, Direction.INVALID, Direction.BOTTOM),
            new Room("13", Direction.BOTTOM, Direction.INVALID, Direction.INVALID)
        };
    }

    enum Direction
    {
        LEFT,
        BOTTOM,
        RIGHT,
        INVALID
    }
}