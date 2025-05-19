import java.util.*;

class Player {
    private static Scanner input;
    private static int W; // number of columns.
    private static int H; // number of rows.
    private static Room[][] maze;

    public static void main(String args[]) {
        input = new Scanner(System.in);
        W = input.nextInt(); // number of columns.
        H = input.nextInt(); // number of rows.

        if (input.hasNextLine()) {
            input.nextLine();
        }

        maze = readMaze();

        // game loop
        while (true) {
            System.out.println(calculateRoute());
        }
    }

    private static Room[][] readMaze() {
        maze = new Room[H][W];
        for (int y = 0; y < H; y++) {
            for (int x = 0; x < W; x++) {
                maze[y][x] = Room.getRoomTypeById(input.nextInt());
            }
        }
        int EX = input.nextInt(); // the coordinate along the X axis of the exit
        return maze;
    }

    private static Position calculateRoute() {
        Position position = new Position(input.nextInt(), input.nextInt());
        String pos = input.next();

        Room currentRoom = maze[position.y][position.x];
        Direction exitDirection = currentRoom.getExitWhenEnteringFrom(pos);

        return position.newPosition(exitDirection);
    }

    private static class Position {
        final int x;
        final int y;

        Position(int x, int y) {
            this.x = x;
            this.y = y;
        }

        Position newPosition(Direction d) {
            return new Position(x + d.x, y + d.y);
        }

        @Override
        public String toString() {
            return x + " " + y;
        }
    }

    private enum Direction {
        LEFT(-1, 0),
        BOTTOM(0, 1),
        RIGHT(1, 0),
        INVALID(0, 0);

        final int x;
        final int y;

        Direction(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public String toString() {
            return "x: " + x + ", y: " + y;
        }

    }

    private enum Room {
        TYPE0(Direction.INVALID, Direction.INVALID, Direction.INVALID),
        TYPE1(Direction.BOTTOM, Direction.BOTTOM, Direction.BOTTOM),
        TYPE2(Direction.RIGHT, Direction.INVALID, Direction.LEFT),
        TYPE3(Direction.INVALID, Direction.BOTTOM, Direction.INVALID),
        TYPE4(Direction.INVALID, Direction.LEFT, Direction.BOTTOM),
        TYPE5(Direction.BOTTOM, Direction.RIGHT, Direction.INVALID),
        TYPE6(Direction.RIGHT, Direction.INVALID, Direction.LEFT),
        TYPE7(Direction.INVALID, Direction.BOTTOM, Direction.BOTTOM),
        TYPE8(Direction.BOTTOM, Direction.INVALID, Direction.BOTTOM),
        TYPE9(Direction.BOTTOM, Direction.BOTTOM, Direction.INVALID),
        TYPE10(Direction.INVALID, Direction.LEFT, Direction.INVALID),
        TYPE11(Direction.INVALID, Direction.RIGHT, Direction.INVALID),
        TYPE12(Direction.INVALID, Direction.INVALID, Direction.BOTTOM),
        TYPE13(Direction.BOTTOM, Direction.INVALID, Direction.INVALID);

        final Direction fromTOP;
        final Direction fromLEFT;
        final Direction fromRIGHT;

        Room(Direction fromLEFT, Direction fromTOP, Direction fromRIGHT) {
            this.fromLEFT = fromLEFT;
            this.fromTOP = fromTOP;
            this.fromRIGHT = fromRIGHT;
        }

        static Room getRoomTypeById(int id) {
            // the enum indices correspond to the numbering used by the input format
            return Room.values()[id];
        }

        Direction getExitWhenEnteringFrom(String entry) {
            switch (entry) {
                case "LEFT":
                    return fromLEFT;
                case "TOP":
                    return fromTOP;
                case "RIGHT":
                    return fromRIGHT;
                default:
                    return Direction.INVALID;
            }
        }

        @Override
        public String toString() {
            return "fromLEFT: " + fromLEFT + ", fromTOP: " + fromTOP + ", fromRIGHT: "
                    + fromRIGHT;
        }

    }
}
