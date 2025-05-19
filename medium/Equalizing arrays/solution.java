import java.util.*;

class Solution {
    final static Scanner in = new Scanner(System.in);
    final static int N = in.nextInt();
    final static int[] a = new int[N];
    final static int[] b = new int[N];

    public static void main(String args[]) {
        List<Deque<int[]>> movesVec = new ArrayList<>();

        for (int i = 0; i < N; i++) {
            a[i] = in.nextInt();
        }
        for (int i = 0; i < N; i++) {
            b[i] = in.nextInt();
        }
        int curDiff = 0, totalMoves = 0;

        for (int i = 0; i < N; i++) {
            movesVec.add(new ArrayDeque<>());
            if (curDiff != 0) {
                totalMoves++;
                if (curDiff > 0) {
                    movesVec.get(i - 1).add(new int[] { 1, curDiff });
                } else {
                    movesVec.get(i).add(new int[] { -1, -curDiff });
                }
            }
            curDiff += a[i] - b[i];
        }

        System.out.println(totalMoves);
        for (int i = 0; i < N; i++) {
            while (i >= 0 && !movesVec.get(i).isEmpty()) {
                int[] move = movesVec.get(i).peekFirst();
                int D = move[0], V = move[1];
                if (a[i] < V) {
                    break;
                }
                a[i] -= V;
                a[i + D] += V;
                movesVec.get(i).pollFirst();
                System.out.println((i + 1) + " " + D + " " + V);
                i--;
            }
        }
    }
}