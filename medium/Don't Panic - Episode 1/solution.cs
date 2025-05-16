using System;
using System.Collections.Generic;

class Player
{
    static void Main(string[] args)
    {
        string[] inputs;
        inputs = Console.ReadLine().Split(' ');
        int nbFloors = int.Parse(inputs[0]); // number of floors
        int width = int.Parse(inputs[1]); // width of the area
        int nbRounds = int.Parse(inputs[2]); // maximum number of rounds
        int exitFloor = int.Parse(inputs[3]); // floor on which the exit is found
        int exitPos = int.Parse(inputs[4]); // position of the exit on its floor
        int nbTotalClones = int.Parse(inputs[5]); // number of generated clones
        int nbAdditionalElevators = int.Parse(inputs[6]); // ignore (always zero)
        int nbElevators = int.Parse(inputs[7]); // number of elevators

        int[] elevFloor = new int[nbElevators];
        int[] elevPos = new int[nbElevators];

        Dictionary<int, int> elevators = new Dictionary<int, int>();
        elevators.Add(exitFloor, exitPos);
        for (int i = 0; i < nbElevators; i++)
        {
            inputs = Console.ReadLine().Split(' ');
            int elevatorFloor = int.Parse(inputs[0]); // floor on which this elevator is found
            int elevatorPos = int.Parse(inputs[1]); // position of the elevator on its floor

            elevFloor[i] = elevatorFloor;
            elevPos[i] = elevatorPos;

            elevators.Add(elevatorFloor, elevatorPos);
        }

        // game loop
        while (true)
        {
            inputs = Console.ReadLine().Split(' ');
            int cloneFloor = int.Parse(inputs[0]); // floor of the leading clone
            int clonePos = int.Parse(inputs[1]); // position of the leading clone on its floor
            string direction = inputs[2]; // direction of the leading clone: LEFT or RIGHT
            Clone clone = new Clone(clonePos, cloneFloor, direction);
            Console.WriteLine(clone.MakeDecision(elevators));
        }
    }
}

class Clone
{
    int pos;
    int floor;
    string dir;

    public Clone(int pos, int floor, string dir)
    {
        this.pos = pos;
        this.floor = floor;
        this.dir = dir;
    }

    private bool IsRightDirection(Dictionary<int, int> elevators)
    {
        switch (dir)
        {
            case "RIGHT":
                return pos <= elevators[floor];
            case "LEFT":
                return pos >= elevators[floor];
            case "NONE":
                return true;
        }
        return true;
    }

    public string MakeDecision(Dictionary<int, int> elevators)
    {
        return IsRightDirection(elevators) ? "WAIT" : "BLOCK";
    }
}