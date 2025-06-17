import java.util.*;

class Player {
    static Map<Integer, List<Integer>> nodeGraph = new HashMap<>();
    static Map<Integer, Integer> threats;
    static int maxThreat;
    static Set<Integer> gateways = new HashSet<>();
    static int N;

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        N = in.nextInt(); // the total number of nodes in the level, including the gateways
        int L = in.nextInt(); // the number of links
        int E = in.nextInt(); // the number of exit gateways
        for (int i = 0; i < L; i++) {
            int N1 = in.nextInt(); // N1 and N2 defines a link between these nodes
            int N2 = in.nextInt();
            if (!nodeGraph.containsKey(N1)) {
                nodeGraph.put(N1, new ArrayList<>());
            }
            if (!nodeGraph.containsKey(N2)) {
                nodeGraph.put(N2, new ArrayList<>());
            }
            nodeGraph.get(N1).add(N2);
            nodeGraph.get(N2).add(N1);
        }
        for (int i = 0; i < E; i++) {
            int EI = in.nextInt(); // the index of a gateway node
            gateways.add(EI);
        }

        // game loop
        while (true) {
            int SI = in.nextInt(); // The index of the node on which the Bobnet agent is positioned this turn
            threats = calculateNodeThreats();
            maxThreat = threats.values().stream().max(Integer::compare).get();
            System.out.println(cutLinks(SI));
        }
    }

    static String cutLinks(int SI) {
        int nodeToCut = getNodeToCut(SI);

        if (canCut(nodeToCut)) {
            removeConnection(SI, nodeToCut);
            return SI + " " + nodeToCut;
        }

        return cutMostDangerLink(SI);
    }

    private static void removeConnection(int a, int b) {
        nodeGraph.get(a).removeIf(node -> node == b);
        nodeGraph.get(b).removeIf(node -> node == a);
    }

    static String cutMostDangerLink(int SI) {
        int node = -1;
        int bestSteps = Integer.MAX_VALUE;
        int bestScore = Integer.MAX_VALUE;

        for (int n : nodeGraph.keySet()) {
            if (threats.get(n) < maxThreat || gateways.contains(n) || n == SI)
                continue;

            Path path = bfsAgentToNode(SI, n);

            if (path.score() < bestScore || (path.score() == bestScore && path.steps < bestSteps)) {
                bestScore = path.score();
                bestSteps = path.steps;
                node = n;
            }
        }

        int gateway = getNodeToCut(node);

        removeConnection(gateway, node);
        return gateway + " " + node;
    }

    static Path bfsAgentToNode(int from, int to) {
        int[] queue = new int[N], parents = new int[N];
        boolean[] visited = new boolean[N];

        for (int i = 0; i < N; i++) {
            parents[i] = -1;
        }

        int head = 0, tail = 0;

        queue[tail++] = from;
        visited[from] = true;

        while (head < tail) {
            int current = queue[head++];
            if (current == to)
                return countSteps(from, to, parents);

            for (int n : nodeGraph.get(current)) {
                if (!visited[n] && parents[n] == -1 && !gateways.contains(n)) {
                    queue[tail++] = n;
                    visited[n] = true;
                    parents[n] = current;
                }
            }
        }
        return null;
    }

    static Path countSteps(int from, int to, int[] parents) {
        int steps = 0;
        int current = to;
        int gws = 0;
        while (parents[current] != -1 || current != from) {
            steps++;
            gws += threats.get(current);
            current = parents[current];
        }

        return new Path(steps, gws);
    }

    static int getNodeToCut(int node) {
        for (int n : nodeGraph.get(node)) {
            if (!gateways.contains(n))
                continue;
            return n;
        }
        return -1;
    }

    static boolean canCut(int node) {
        return gateways.contains(node);
    }

    private static Map<Integer, Integer> calculateNodeThreats() {
        Map<Integer, Integer> threats = new HashMap<>();

        for (int node : nodeGraph.keySet()) {
            int count = 0;
            for (int neib : nodeGraph.get(node)) {
                count += gateways.contains(neib) ? 1 : 0;
            }
            threats.put(node, count);
        }
        return threats;
    }

    static class Path {
        public final int steps;
        public final int gws;

        public Path(int steps, int gws) {
            this.steps = steps;
            this.gws = gws;
        }

        public int score() {
            return steps - gws;
        }
    }
}