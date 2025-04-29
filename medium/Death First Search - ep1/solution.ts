interface NodeGraph {
    [index: number]: Set<number>
}
interface NumberObject {
    [index: number]: number
}
var inputs: string[] = readline().split(' ');
const N: number = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
const L: number = parseInt(inputs[1]); // the number of links
const E: number = parseInt(inputs[2]); // the number of exit gateways
const nodeGraph: NodeGraph = {};
const gateways: NumberObject = {};
for (let i = 0; i < L; i++) {
    var inputs: string[] = readline().split(' ');
    const N1: number = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    const N2: number = parseInt(inputs[1]);
    if (!exists(nodeGraph, N1)) nodeGraph[N1] = new Set();
    if (!exists(nodeGraph, N2)) nodeGraph[N2] = new Set();
    nodeGraph[N1].add(N2);
    nodeGraph[N2].add(N1);
}

for (let i = 0; i < E; i++) {
    const EI: number = parseInt(readline()); // the index of a gateway node
    gateways[EI] = EI;
}

// game loop
while (true) {
    const SI: number = parseInt(readline()); // The index of the node on which the Bobnet agent is positioned this turn
    console.log(cutLink(SI));
}


function removeLink(a: number, b: number): void {
    nodeGraph[a].delete(b);
    nodeGraph[b].delete(a);
}

function exists(object: any, property: number): boolean {
    return object[property] !== undefined;
}

function cutLink(SI: number) {
    let nodeToCut: number = -1;
    let maxThreat: number = -1;
    const threats: NumberObject = computeThreats();

    for (const neighbor of nodeGraph[SI]) {
        if (exists(gateways, neighbor)) {
            nodeToCut = neighbor;
            break;
        }

        const threat: number = threats[neighbor];
        if (
            threat > maxThreat ||
            (threat === maxThreat && neighbor < nodeToCut)
        ) {
            maxThreat = threat;
            nodeToCut = neighbor;
        }
    }

    removeLink(SI, nodeToCut);
    return `${SI} ${nodeToCut}`;
}

function computeThreats(): NumberObject {
    const initThreats: NumberObject = {};
    for (const node in nodeGraph) {
        let ownThreat: number = 0;
        for (const neighbor of nodeGraph[node]) {
            if (exists(gateways, neighbor)) {
                ownThreat = 1;
                break;
            }
        }
        initThreats[node] = ownThreat;
    }

    const finalThreats: NumberObject = {};
    for (const node in nodeGraph) {
        let threat = initThreats[node];
        for (const neighbor of nodeGraph[node]) {
            threat += initThreats[neighbor];
        }
        finalThreats[node] = threat;
    }

    return finalThreats;
}