import java.util.*;

class Solution {
    private static final int[][] EVEN_DIRS = {
            { 0, -1 }, { -1, -1 }, { -1, 0 }, { 0, 1 }, { 1, -1 }, { 1, 0 }
    };

    private static final int[][] ODD_DIRS = {
            { 0, -1 }, { -1, 0 }, { -1, 1 }, { 0, 1 }, { 1, 0 }, { 1, 1 }
    };
    private static String[][] maze;
    private static Map<Integer, Set<Integer>> graph;
    private static int start;
    private static int end;
    private static int w;
    private static int h;

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        w = in.nextInt();
        h = in.nextInt();
        maze = new String[h][w];
        graph = new HashMap<>();
        if (in.hasNextLine()) {
            in.nextLine();
        }
        for (int y = 0; y < h; y++) {
            maze[y] = in.nextLine().split("");
            for (int x = 0; x < w; x++) {
                if (!maze[y][x].equals("#"))
                    graph.put(key(y, x), new HashSet<>());
                if (maze[y][x].equals("S"))
                    start = key(y, x);
                if (maze[y][x].equals("E"))
                    end = key(y, x);
            }
        }

        for (int key : graph.keySet()) {
            assignNeighbors(key);
        }

        boolean[] path = getBestPath(start, end);
        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int key = key(y, x);
                if (path[key]) {
                    maze[y][x] = maze[y][x].equals("_") ? "." : maze[y][x];
                }
            }
            System.out.println(String.join("", maze[y]));
        }
    }

    private static boolean[] getBestPath(int start, int end) {
        int[] queue = new int[w * h], parents = new int[w * h];
        boolean[] visited = new boolean[w * h];
        Arrays.fill(parents, -1);

        int head = 0, tail = 0;

        queue[tail++] = start;
        visited[start] = true;

        while (head < tail) {
            int current = queue[head++];

            if (current == end) {
                break;
            }

            for (int n : graph.get(current)) {
                if (!visited[n]) {
                    parents[n] = current;
                    visited[n] = true;
                    queue[tail++] = n;
                }
            }
        }

        boolean[] path = new boolean[w * h];
        int current = end;
        while (current != -1) {
            path[current] = true;
            current = parents[current];
        }
        return path;
    }

    private static void assignNeighbors(int key) {
        int[] c = { (key / w), (key % w) };
        int[][] dir = c[0] % 2 == 0 ? EVEN_DIRS : ODD_DIRS;
        for (int[] d : dir) {
            int newY = (c[0] + d[0] + h) % h;
            int newX = (c[1] + d[1] + w) % w;
            if (!maze[newY][newX].equals("#")) {
                graph.get(key).add(key(newY, newX));
            }
        }
    }

    private static int key(int y, int x) {
        return y * w + x;
    }
}