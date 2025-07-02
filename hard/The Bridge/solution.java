import java.util.*;

class Player {
    static final String[] COMMANDS = { "SPEED", "WAIT", "JUMP", "UP", "DOWN", "SLOW" };
    static int M; // the amount of motorbikes to control
    static int V; // the minimum amount of motorbikes that must survive

    static final String[] roadMap = new String[4];
    static Bike[] bikes;

    static Path bestPath = null;
    static final Set<String> visited = new HashSet<>();
    static final Set<Integer> visitedLong = new HashSet<>();

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        M = in.nextInt();
        V = in.nextInt();
        bikes = new Bike[M];
        for (int i = 0; i < M; i++) {
            bikes[i] = new Bike();
        }
        for (int i = 0; i < 4; i++) {
            roadMap[i] = in.next(); // L0 to L3 are lanes of the road. A dot character . represents a safe space, a
                                    // zero 0 represents a hole in the road.
        }
        int count = 0;
        // game loop
        while (true) {
            int S = in.nextInt(); // the motorbikes' speed
            for (int i = 0; i < M; i++) {
                bikes[i].x = in.nextInt(); // x coordinate of the motorbike
                bikes[i].y = in.nextInt(); // y coordinate of the motorbike
                bikes[i].a = in.nextInt() == 1; // indicates whether the motorbike is activated "1" or detroyed "0"
            }

            if (count == 0) {
                State state = new State(bikes, S, new ArrayList<String>());
                DFS(state);
            }

            System.out.println(bestPath.commands.get(count));
            count++;
        }
    }

    static void DFS(State state) {
        if (state.finished()) {
            var candidate = new Path(state.commands, state.aliveCount());
            if (candidate.isBetterThan(bestPath)) {
                bestPath = candidate;
            }
            return;
        }

        if (state.failed() || state.aliveCount() < V)
            return;

        String key = state.getKey();
        if (visited.contains(key))
            return;
        visited.add(key);

        for (String cmd : COMMANDS) {
            boolean allCanChangeLane = Arrays.stream(state.bikes).allMatch((b) -> b.canChangeLane(cmd));
            if ((cmd.equals("UP") || cmd.equals("DOWN")) && !allCanChangeLane)
                continue;

            State next = state.applyCommand(cmd);
            if (next.aliveCount() >= V)
                DFS(next);
        }
    }

    static class State {
        public int speed;
        public Bike[] bikes;
        public List<String> commands;

        public State(Bike[] bikes, int speed, List<String> commands) {
            this.bikes = Arrays.stream(bikes).map((b) -> b.clone()).toArray(Bike[]::new); // deep copy
            this.speed = speed;
            this.commands = new ArrayList<String>(commands);
        }

        public int aliveCount() {
            return Arrays.stream(bikes).filter((b) -> b.a).toArray().length;
        }

        public boolean finished() {
            return Arrays.stream(bikes).filter((b) -> b.a && b.x > roadMap[0].length()).count() >= V;
        }

        public boolean failed() {
            return commands.size() > 50;
        }

        public State applyCommand(String cmd) {
            var nextBikes = Arrays.stream(bikes).map((b) -> b.clone()).toArray(Bike[]::new);
            int nextSpeed = speed;

            if (cmd.equals("SPEED"))
                nextSpeed++;
            else if (cmd.equals("SLOW"))
                nextSpeed = Math.max(0, speed - 1);

            for (Bike b : nextBikes) {
                if (!b.a)
                    continue;

                switch (cmd) {
                    case "JUMP":
                        b.jump(nextSpeed);
                        break;
                    case "UP":
                        b.changeLane(nextSpeed, cmd);
                        break;
                    case "DOWN":
                        b.changeLane(nextSpeed, cmd);
                        break;
                    default:
                        b.move(nextSpeed);
                        break;
                }
            }
            List<String> nextCommands = new ArrayList<String>(commands);
            nextCommands.add(cmd);
            return new State(nextBikes, nextSpeed, nextCommands);
        }

        public String getKey() {
            String key = "" + speed;
            for (var b : bikes) {
                if (!b.a)
                    key += "|X";
                else
                    key += "|{" + b.x + "}:{" + b.y + "}";
            }
            return key;
        }
    }

    static class Path {
        public List<String> commands;
        public int aBikes;

        public Path(List<String> commands, int aBikes) {
            this.commands = new ArrayList<String>(commands);
            this.aBikes = aBikes;
        }

        public boolean isBetterThan(Path other) {
            return other == null || (aBikes > other.aBikes && commands.size() <= 50) ||
                    commands.size() < other.commands.size();
        }
    }

    static class Bike {
        public int x, y;
        public boolean a;

        public Bike() {
        }

        public Bike(int x, int y, boolean a) {
            this.x = x;
            this.y = y;
            this.a = a;
        }

        public Bike clone() {
            return new Bike(x, y, a);
        }

        public void move(int speed) {
            a = isGoodRoad(speed);
            x += speed;
        }

        public void jump(int speed) {
            a = isGoodSpot(x + speed) || roadMap[y].charAt(x + speed) != '0';
            x += speed;
        }

        public boolean canChangeLane(String cmd) {
            return !a || (cmd.equals("UP") && y > 0) || (cmd.equals("DOWN") && y < 3);
        }

        public void changeLane(int speed, String cmd) {
            int dir = cmd.equals("UP") ? -1 : cmd.equals("DOWN") ? 1 : 0;
            int targetY = y + dir;
            a = isGoodToChangeLane(speed, targetY);
            x += speed;
            y = targetY;
        }

        boolean isGoodRoad(int speed) {
            for (int i = x + 1; i <= x + speed; i++) {
                if (i < roadMap[y].length() && roadMap[y].charAt(i) == '0')
                    return false;
            }
            return true;
        }

        boolean isGoodToChangeLane(int speed, int targetY) {
            for (int i = x + 1; i < x + speed; i++) {
                if (i < roadMap[y].length() && (roadMap[y].charAt(i) == '0' || roadMap[targetY].charAt(i) == '0'))
                    return false;
            }
            return isGoodSpot(x + speed) || roadMap[targetY].charAt(x + speed) != '0';
        }

        boolean isGoodSpot(int x) {
            return x >= roadMap[y].length();
        }
    }
}