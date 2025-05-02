var inputs = readline().split(' ');
const N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
const L = parseInt(inputs[1]); // the number of links
const E = parseInt(inputs[2]); // the number of exit gateways
const nodeGraph = {};
for (let i = 0; i < L; i++) {
    const inputs = readline().split(' ');
    const N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    const N2 = parseInt(inputs[1]);
    if (!nodeGraph[N1]) nodeGraph[N1] = {};
    if (!nodeGraph[N2]) nodeGraph[N2] = {};
    nodeGraph[N1][N2] = N2;
    nodeGraph[N2][N1] = N1;
}

const gateways = {
    exists: function (property) {
        return gateways[property] !== undefined;
    }
};

for (let i = 0; i < E; i++) {
    const EI = parseInt(readline());
    gateways[EI] = EI;
}

while (true) {
    const SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
    const threatMap = computeThreats();
    console.log(cutLink(SI, threatMap));
}

function cutLink(SI, threatMap) {
    let maxThreat = -1;
    let nodeToCut = -1;

    for (const neighbor in nodeGraph[SI]) {
        if (gateways.exists(neighbor)) {
            nodeToCut = neighbor;
            break;
        }

        const threat = threatMap[neighbor];
        if (
            threat > maxThreat ||
            (threat === maxThreat && parseInt(neighbor) < parseInt(nodeToCut))
        ) {
            maxThreat = threat;
            nodeToCut = neighbor;
        }
    }

    removeLink(SI, nodeToCut);
    return `${SI} ${nodeToCut}`;
}

function computeThreats() {
    const initThreats = {};
    for (const node in nodeGraph) {
        let ownThreat = 0;
        for (const neighbor in nodeGraph[node]) {
            if (gateways.exists(neighbor)) {
                ownThreat = 1;
                break;
            }
        }
        initThreats[node] = ownThreat;
    }

    const finalThreats = {};
    for (const node in nodeGraph) {
        let threat = initThreats[node];
        for (const neighbor in nodeGraph[node]) {
            threat += initThreats[neighbor];
        }
        finalThreats[node] = threat;
    }
    return finalThreats;
}

function removeLink(a, b) {
    delete nodeGraph[a][b];
    delete nodeGraph[b][a];
}