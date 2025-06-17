interface Link {
  fromNode: number;
  toNode: number;
}
interface Path {
  steps: number;
  gateways: number;
}

var inputs: string[] = readline().split(" ");
const N: number = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
const L: number = parseInt(inputs[1]); // the number of links
const E: number = parseInt(inputs[2]); // the number of exit gateways

const nodeGraph: Map<number, Set<number>> = new Map();
const gateways: Set<number> = new Set();
const threats: Map<number, number> = new Map();
let maxThreat: number;

for (let i = 0; i < L; i++) {
  var inputs: string[] = readline().split(" ");
  const N1: number = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
  const N2: number = parseInt(inputs[1]);
  if (!nodeGraph.has(N1)) nodeGraph.set(N1, new Set());
  if (!nodeGraph.has(N2)) nodeGraph.set(N2, new Set());

  nodeGraph.get(N1).add(N2);
  nodeGraph.get(N2).add(N1);
}
for (let i = 0; i < E; i++) {
  gateways.add(parseInt(readline())); // the index of a gateway node
}

// game loop
while (true) {
  const SI: number = parseInt(readline()); // The index of the node on which the Bobnet agent is positioned this turn
  calculateNodeThreats();
  console.log(cutLink(SI));
}

function cutLink(SI: number): string {
  let fromNode: number = SI;
  let toNode: number = getNodeToCut(SI);

  if (toNode == -1) {
    const nodes = cutMostDangerLink(SI);
    fromNode = nodes.fromNode;
    toNode = nodes.toNode;
  }

  removeConnection(fromNode, toNode);
  return `${fromNode} ${toNode}`;
}

function removeConnection(a: number, b: number): void {
  nodeGraph.get(a).delete(b);
  nodeGraph.get(b).delete(a);
}

function cutMostDangerLink(SI: number): Link {
  let toNode: number = -1;
  let bestSteps: number = Number.MAX_SAFE_INTEGER;
  let bestScore: number = Number.MAX_SAFE_INTEGER;

  for (const n of nodeGraph.keys()) {
    if (threats.get(n) < maxThreat || gateways.has(n) || n == SI) continue;

    const path = agentToNode(SI, n);
    const pathScore = path.steps - path.gateways;

    if (
      pathScore < bestScore ||
      (pathScore == bestScore && path.steps < bestSteps)
    ) {
      bestScore = pathScore;
      bestSteps = path[0];
      toNode = n;
    }
  }
  const fromNode: number = getNodeToCut(toNode);
  return { fromNode, toNode };
}

function agentToNode(from: number, to: number): Path {
  const queue: number[] = new Array(N),
    parents: number[] = new Array(N).fill(-1),
    visited: boolean[] = new Array(N).fill(false);

  let head: number = 0,
    tail: number = 0;

  queue[tail++] = from;
  visited[from] = true;

  while (head < tail) {
    const current: number = queue[head++];
    if (current == to) return countSteps(from, to, parents);

    for (const n of nodeGraph.get(current)) {
      if (!visited[n] && parents[n] == -1 && !gateways.has(n)) {
        queue[tail++] = n;
        visited[n] = true;
        parents[n] = current;
      }
    }
  }
  return { steps: -1, gateways: -1 };
}

function countSteps(from: number, to: number, parents: number[]): Path {
  let steps: number = 0;
  let current: number = to;
  let gateways: number = 0;
  while (current != from) {
    steps++;
    gateways += threats.get(current);
    current = parents[current];
  }

  return { steps, gateways };
}

function getNodeToCut(node: number) {
  for (const n of nodeGraph.get(node)) if (gateways.has(n)) return n;
  return -1;
}

function calculateNodeThreats() {
  threats.clear();
  for (const t of nodeGraph.keys()) {
    let count: number = 0;
    for (const n of nodeGraph.get(t)) count += gateways.has(n) ? 1 : 0;
    threats.set(t, count);
  }
  maxThreat = Array.from(threats.values()).sort((a, b) => b - a)[0];
}
