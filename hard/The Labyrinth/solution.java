import java.util.*;

class Player {
    static int R, C, A;
    static char[][] maze;
    static Coord start, end;
    static State currentState = State.EXPLORE;

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        R = in.nextInt(); // number of rows.
        C = in.nextInt(); // number of columns.
        A = in.nextInt(); // number of rounds between the time the alarm countdown is activated and the
                          // time the alarm goes off.
        maze = new char[R][C];

        // game loop
        while (true) {
            Coord current = new Coord(in.nextInt(), in.nextInt()); // row and col where Rick is located.
            for (int i = 0; i < R; i++) {
                String ROW = in.next(); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
                maze[i] = ROW.toCharArray();
                for (int j = 0; j < C; j++) {
                    if (maze[i][j] == 'T')
                        start = new Coord(i, j);
                    if (maze[i][j] == 'C')
                        end = new Coord(i, j);
                }
            }

            LinkedList<Coord> bestRoute = getBestRoute(current);
            System.out.println(chooseDirection(bestRoute));
        }
    }

    static String chooseDirection(LinkedList<Coord> path) {
        if (path.size() >= 2) {
            Coord from = path.getFirst(), to = path.get(1);
            for (Dir d : Dir.values()) {
                if (from.move(d).equals(to))
                    return d.name();
            }
        }
        return "ERROR";
    }

    static LinkedList<Coord> getBestRoute(Coord current) {
        checkEscapeRoute();

        if (currentState == State.EXPLORE) {
            return calculateRoute(current, null);
        }

        if (haveToEscape(current))
            currentState = State.ESCAPE;

        return calculateRoute(current, currentState == State.ESCAPE ? start : end);
    }

    static LinkedList<Coord> calculateRoute(Coord from, Coord to) {
        Coord[] queue = new Coord[R * C];
        Coord[] parents = new Coord[R * C];
        boolean[] visited = new boolean[R * C];

        int head = 0, tail = 0;

        queue[tail++] = from;
        visited[from.key()] = true;

        return routeToTarget(from, to, head, tail, queue, parents, visited);
    }

    static LinkedList<Coord> routeToTarget(Coord from, Coord to, int head, int tail, Coord[] queue, Coord[] parents,
            boolean[] visited) {
        while (head < tail) {
            Coord current = queue[head++];
            int cy = current.y, cx = current.x;

            if (to != null && current.equals(to)) {
                return buildPath(parents, from, to);
            }

            for (Dir d : Dir.values()) {
                int ny = cy + d.y, nx = cx + d.x;
                Coord next = current.move(d);
                int nextKey = next.key();

                if (!isInBounds(ny, nx) || visited[nextKey])
                    continue;

                char cell = maze[next.y][next.x];
                if (!isValidCell(cell) && !isGoingToFinish(cell))
                    continue;

                visited[nextKey] = true;
                parents[nextKey] = current;
                queue[tail++] = next;

                if (to == null && isValidCandidate(ny, nx)) {
                    return buildPath(parents, from, next);
                }
            }
        }
        return new LinkedList<>();
    }

    static LinkedList<Coord> buildPath(Coord[] parents, Coord from, Coord to) {
        LinkedList<Coord> path = new LinkedList<>();
        Coord current = to;
        while (current != null) {
            path.addFirst(current);
            current = parents[current.key()];
        }
        return path.getFirst().equals(from) ? path : new LinkedList<>();
    }

    static void checkEscapeRoute() {
        if (currentState != State.EXPLORE || end == null)
            return;

        List<Coord> finalRoute = calculateRoute(end, start);
        if (!finalRoute.isEmpty() && finalRoute.size() <= A + 1) {
            currentState = State.TO_FINISH;
        }
    }

    static boolean isValidCandidate(int y, int x) {
        for (Dir d : Dir.values()) {
            int ny = y + d.y, nx = x + d.x;
            if (isInBounds(ny, nx) && maze[ny][nx] == '?') {
                return true;
            }
        }
        return false;
    }

    static boolean isInBounds(int y, int x) {
        return y >= 0 && y < R && x >= 0 && x < C;
    }

    static boolean haveToEscape(Coord current) {
        return currentState == State.TO_FINISH && current.equals(end);
    }

    static boolean isGoingToFinish(char cell) {
        return currentState == State.TO_FINISH && cell == 'C';
    }

    static boolean isValidCell(char cell) {
        return cell == '.' || cell == 'T';
    }

    static record Coord(int y, int x) {
        Coord move(Dir d) {
            return new Coord(y + d.y, x + d.x);
        }

        int key() {
            return y * C + x;
        }
    }

    static enum State {
        EXPLORE, ESCAPE, TO_FINISH
    }

    static enum Dir {
        UP(-1, 0), RIGHT(0, 1), DOWN(1, 0), LEFT(0, -1);

        final int y, x;

        Dir(int y, int x) {
            this.y = y;
            this.x = x;
        }
    }
}