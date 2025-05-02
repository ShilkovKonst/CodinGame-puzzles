import java.util.*;

class Player {
    private static Map<Integer, List<Integer>> nodeGraph = new HashMap<>();
    private static Map<Integer, Integer> gateways = new HashMap<>();

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int N = in.nextInt(); // the total number of nodes in the level, including the gateways
        int L = in.nextInt(); // the number of links
        int E = in.nextInt(); // the number of exit gateways
        for (int i = 0; i < L; i++) {
            int N1 = in.nextInt(); // N1 and N2 defines a link between these nodes
            int N2 = in.nextInt();
            if (!nodeGraph.containsKey(N1))
                nodeGraph.put(N1, new ArrayList<>());
            if (!nodeGraph.containsKey(N2))
                nodeGraph.put(N2, new ArrayList<>());
            nodeGraph.get(N1).add(N2);
            nodeGraph.get(N2).add(N1);
        }
        for (int i = 0; i < E; i++) {
            int EI = in.nextInt(); // the index of a gateway node
            gateways.put(EI, EI);
        }

        // game loop
        while (true) {
            int SI = in.nextInt(); // The index of the node on which the Bobnet agent is positioned this turn
            System.out.println(cutLinks(SI));
        }
    }

    private static String cutLinks(int SI) {
        int nodeToCut = -1;
        int maxThreat = -1;
        Map<Integer, Integer> threats = calculateNodeThreats();

        for (int neighbor : nodeGraph.get(SI)) {
            if (gateways.containsKey(neighbor)) {
                nodeToCut = neighbor;
                break;
            }

            if (maxThreat < threats.get(neighbor) || (maxThreat == threats.get(neighbor) && neighbor < nodeToCut)) {
                maxThreat = threats.get(neighbor);
                nodeToCut = neighbor;
            }
        }

        removeConnection(SI, nodeToCut);
        return SI + " " + nodeToCut;
    }

    private static void removeConnection(int a, int b) {
        nodeGraph.get(a).removeIf(node -> node == b);
        nodeGraph.get(b).removeIf(node -> node == a);
    }

    private static Map<Integer, Integer> calculateNodeThreats() {
        Map<Integer, Integer> initThreats = new HashMap<>();
        Map<Integer, Integer> finalThreats = new HashMap<>();

        for (int node : nodeGraph.keySet()) {
            int ownThreat = 0;
            for (int neighbor : nodeGraph.get(node)) {
                if (gateways.containsKey(neighbor)) {
                    ownThreat = 1;
                    break;
                }
            }
            initThreats.put(node, ownThreat);
        }
        for (int node : nodeGraph.keySet()) {
            int updThreat = initThreats.get(node);
            for (int neighbor : nodeGraph.get(node)) {
                updThreat += initThreats.get(neighbor);

            }
            finalThreats.put(node, updThreat);
        }
        return finalThreats;
    }
}