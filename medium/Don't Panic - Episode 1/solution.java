import java.util.*;

class Player {

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int nbFloors = in.nextInt(); // number of floors
        int width = in.nextInt(); // width of the area
        int nbRounds = in.nextInt(); // maximum number of rounds
        int exitFloor = in.nextInt(); // floor on which the exit is found
        int exitPos = in.nextInt(); // position of the exit on its floor
        int nbTotalClones = in.nextInt(); // number of generated clones
        int nbAdditionalElevators = in.nextInt(); // ignore (always zero)
        int nbElevators = in.nextInt(); // number of elevators
        Map<Integer, Integer> elevators = new HashMap<Integer, Integer>();
        elevators.put(exitFloor, exitPos);
        for (int i = 0; i < nbElevators; i++) {
            elevators.put(in.nextInt(), in.nextInt());
        }
        // game loop
        while (true) {
            Clone clone = new Clone(in.nextInt(), in.nextInt(), in.next());
            clone.makeDecision(elevators);
        }
    }

    private static class Clone {
        final int floor;
        final int pos;
        final String dir;

        private Clone(int floor, int pos, String dir) {
            this.floor = floor;
            this.pos = pos;
            this.dir = dir;
        }

        private boolean isRightDirection(Map<Integer, Integer> elevators) {
            switch (dir) {
                case "RIGHT":
                    return pos <= elevators.get(floor);
                case "LEFT":
                    return pos >= elevators.get(floor);
                case "NONE":
                    return true;
            }
            return true;
        }

        private void makeDecision(Map<Integer, Integer> elevators) {
            if (!isRightDirection(elevators)) {
                System.out.println("BLOCK");
            } else {
                System.out.println("WAIT");
            }
        }

    }
}