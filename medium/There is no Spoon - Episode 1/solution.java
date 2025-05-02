import java.util.*;

class Player {
    private static boolean[][] grid;
    private static int width;
    private static int height;

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        width = in.nextInt(); // the number of cells on the X axis
        height = in.nextInt(); // the number of cells on the Y axis
        if (in.hasNextLine()) {
            in.nextLine();
        }
        grid = new boolean[height][width];
        for (int i = 0; i < height; i++) {
            String[] line = in.nextLine().split(""); // width characters, each either 0 or .
            for (int j = 0; j < width; j++) {
                grid[i][j] = line[j].equals("0");
            }
        }
        initializeNode();
    }

    private static void initializeNode() {
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                if (grid[i][j]) {
                    int[] nR = getNext(i, j, 0, 1);
                    int[] nB = getNext(i, j, 1, 0);
                    System.out.println(j + " " + i + " " + nR[1] + " " + nR[0] + " " + nB[1] + " " + nB[0]);
                }
            }
        }
    }

    private static int[] getNext(int y, int x, int dy, int dx) {
        int ny = y + dy;
        int nx = x + dx;

        while (ny < height && nx < width) {
            if (grid[ny][nx]) {
                return new int[] { ny, nx };
            }
            ny += dy;
            nx += dx;
        }
        return new int[] { -1, -1 };
    }

}