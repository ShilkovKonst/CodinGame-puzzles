import java.util.*;

class Player {
    static final int HEIGHT = 18;
    static final int WIDTH = 40;
    static final int[][] DIRS = new int[][] { { -1, -1 }, { -1, 0 }, { -1, 1 }, { 1, -1 }, { 1, 0 }, { 1, 1 },
            { 0, -1 }, { 0, 1 } };

    static Scanner in = new Scanner(System.in);;

    static int TY;
    static int TX;
    static int H; // the remaining number of hammer strikes.
    static int N; // the number of giants which are still present on the map.

    static int giantsInArea;
    static boolean inDanger;
    static boolean surrounded;
    static int[] target;

    static boolean[][] forbiddenCells = new boolean[HEIGHT][WIDTH];

    public static void main(String args[]) {
        // Scanner in = new Scanner(System.in);
        TX = in.nextInt();
        TY = in.nextInt();
        int[] lastPos = new int[] { TY, TX };

        // game loop
        while (true) {
            H = in.nextInt(); // the remaining number of hammer strikes.
            N = in.nextInt(); // the number of giants which are still present on the map.

            clearStates();

            int[][] gCoords = readGiantCoordinates();
            int[] barycenter = getBarycenter(gCoords);

            var env = checkEnv();
            inDanger = env[0];
            surrounded = env[1];

            target = findNextStep(barycenter, lastPos);

            lastPos = new int[] { TY, TX };
            // The movement or action to be carried out: WAIT STRIKE N NE E SE S SW W or N
            System.out.println(makeDecision());
        }
    }

    static String makeDecision() {
        return canStrike() ? "STRIKE" : goToTarget(target);
    }

    static String goToTarget(int[] t) {
        if (TY == t[0] && TX == t[1])
            return "WAIT";

        String direction = "";
        direction += TY < t[0] ? "S" : TY > t[0] ? "N" : "";
        direction += TX < t[1] ? "E" : TX > t[1] ? "W" : "";

        applyNewPos(t);

        return direction;
    }

    static void applyNewPos(int[] target) {
        TY += TY < target[0] ? 1 : TY > target[0] ? -1 : 0;
        TX += TX < target[1] ? 1 : TX > target[1] ? -1 : 0;
    }

    static boolean canStrike() {
        return giantsInArea >= ((N + H - 1) / H) || surrounded;
    }

    static int[] findNextStep(int[] barycenter, int[] lastPos) {
        return inDanger ? getClosestCandidate(getNeighbors(TY, TX), barycenter, lastPos) : barycenter;
    }

    static int[] getClosestCandidate(List<int[]> candidates, int[] target, int[] lastPos) {
        double bestDist = Double.MAX_VALUE;
        int[] bestC = null;

        for (int[] c : candidates) {
            if (forbiddenCells[c[0]][c[1]] || (c[0] == lastPos[0] && c[1] == lastPos[1]))
                continue;

            double dist = Math.pow(target[0] - c[0], 2) + Math.pow(target[1] - c[1], 2);
            if (dist < bestDist) {
                bestDist = dist;
                bestC = c;
            }
        }
        return bestC;
    }

    static boolean[] checkEnv() {
        boolean inDanger = false, surrounded = true;
        for (int[] n : getNeighbors(TY, TX)) {
            if (forbiddenCells[n[0]][n[1]] && !inDanger)
                inDanger = true;
            if (!forbiddenCells[n[0]][n[1]] && surrounded)
                surrounded = false;
        }
        return new boolean[] { inDanger, surrounded };
    }

    static int[] getBarycenter(int[][] gCoords) {
        int y = Arrays.stream(gCoords[0]).sum() / N;
        int x = Arrays.stream(gCoords[1]).sum() / N;

        return new int[] { y, x };
    }

    static int[][] readGiantCoordinates() {
        int[][] coords = new int[2][N];

        for (int i = 0; i < N; i++) {
            int X = in.nextInt();
            int Y = in.nextInt();

            coords[0][i] = Y;
            coords[1][i] = X;

            populateForbiddenCells(Y, X);

            if (isInStrikeArea(Y, X))
                giantsInArea++;
        }

        return coords;
    }

    static boolean isInStrikeArea(int gy, int gx) {
        return Math.abs(gy - TY) <= 5 && Math.abs(gx - TX) <= 5;
    }

    static void populateForbiddenCells(int y, int x) {
        forbiddenCells[y][x] = true;
        for (int[] n : getNeighbors(y, x)) {
            forbiddenCells[n[0]][n[1]] = true;
        }
    }

    static List<int[]> getNeighbors(int y, int x) {
        List<int[]> neighbors = new ArrayList<int[]>();

        for (int[] d : DIRS) {
            int ny = y + d[0];
            int nx = x + d[1];
            if (isInBounds(ny, nx))
                neighbors.add(new int[] { ny, nx });
        }
        return neighbors;
    }

    static boolean isInBounds(int y, int x) {
        return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
    }

    static void clearStates() {
        giantsInArea = 0;
        inDanger = false;
        for (int y = 0; y < forbiddenCells.length; y++) {
            Arrays.fill(forbiddenCells[y], false);
        }
    }
}