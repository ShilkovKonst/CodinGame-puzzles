import java.util.*;

class Player {

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int W = in.nextInt(); // width of the building.
        int H = in.nextInt(); // height of the building.
        int N = in.nextInt(); // maximum number of turns before game over.
        int bX = in.nextInt();
        int bY = in.nextInt();
        int[] intervalX = { 0, W - 1 }, intervalY = { 0, H - 1 };
        // game loop
        while (true) {
            String bombDir = in.next(); // the direction of the bombs from batman's current location (U, UR, R, DR, D,
                                        // DL, L or UL)
            for (char c : bombDir.toCharArray()) {
                switch (c) {
                    case 'L':
                        intervalX[1] = bX - 1;
                        break;
                    case 'R':
                        intervalX[0] = bX + 1;
                        break;
                    case 'U':
                        intervalY[1] = bY - 1;
                        break;
                    case 'D':
                        intervalY[0] = bY + 1;
                        break;
                }
            }
            bX = (int) (intervalX[0] + intervalX[1]) / 2;
            bY = (int) (intervalY[0] + intervalY[1]) / 2;
            
            System.out.println(bX + " " + bY);
        }
    }
}