var inputs = readline().split(" ");
const N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
const L = parseInt(inputs[1]); // the number of links
const E = parseInt(inputs[2]); // the number of exit gateways

const nodeGraph = new Map();
const gateways = new Set();
const threats = new Map();
let maxThreat;

for (let i = 0; i < L; i++) {
  var inputs = readline().split(" ");
  const N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
  const N2 = parseInt(inputs[1]);
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
  const SI = parseInt(readline()); // The index of the node on which the Bobnet agent is positioned this turn
  calculateNodeThreats();
  console.log(cutLink(SI));
}

function cutLink(SI) {
  let fromNode = SI;
  let toNode = getNodeToCut(SI);

  if (toNode == -1) {
    const nodes = cutMostDangerLink(SI);
    fromNode = nodes.fromNode;
    toNode = nodes.toNode;
  }

  removeConnection(fromNode, toNode);
  return `${fromNode} ${toNode}`;
}

function removeConnection(a, b) {
  nodeGraph.get(a).delete(b);
  nodeGraph.get(b).delete(a);
}

function cutMostDangerLink(SI) {
  let toNode = -1;
  let bestSteps = Number.MAX_SAFE_INTEGER;
  let bestScore = Number.MAX_SAFE_INTEGER;

  for (const n of nodeGraph.keys()) {
    if (threats.get(n) < maxThreat || gateways.has(n) || n == SI) continue;

    const path = agentToNode(SI, n);
    const pathScore = path.steps - path.gws;

    if (
      pathScore < bestScore ||
      (pathScore == bestScore && path.steps < bestSteps)
    ) {
      bestScore = pathScore;
      bestSteps = path[0];
      toNode = n;
    }
  }
  const fromNode = getNodeToCut(toNode);
  return { fromNode, toNode };
}

function agentToNode(from, to) {
  const queue = new Array(N),
    parents = new Array(N).fill(-1),
    visited = new Array(N).fill(false);

  let head = 0,
    tail = 0;

  queue[tail++] = from;
  visited[from] = true;

  while (head < tail) {
    const current = queue[head++];
    if (current == to) return countSteps(from, to, parents);

    for (const n of nodeGraph.get(current)) {
      if (!visited[n] && parents[n] == -1 && !gateways.has(n)) {
        queue[tail++] = n;
        visited[n] = true;
        parents[n] = current;
      }
    }
  }
  return { steps: -1, gws: -1 };
}

function countSteps(from, to, parents) {
  let steps = 0;
  let current = to;
  let gws = 0;
  while (current != from) {
    steps++;
    gws += threats.get(current);
    current = parents[current];
  }

  return { steps, gws };
}

function getNodeToCut(node) {
  for (const n of nodeGraph.get(node)) if (gateways.has(n)) return n;
  return -1;
}

function calculateNodeThreats() {
  threats.clear();
  for (const t of nodeGraph.keys()) {
    let count = 0;
    for (const n of nodeGraph.get(t)) count += gateways.has(n) ? 1 : 0;
    threats.set(t, count);
  }
  maxThreat = Array.from(threats.values()).sort((a, b) => b - a)[0];
}
