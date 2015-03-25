CanvasWidth = 560;
CanvasHeight = 560;
BlockSize = CanvasHeight / 10;

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function mapToString(map) {
    var str = '';
    for (var i = 0;i < map.length;i++) {
        for (var j = 0;j < map[i].length;j++) {
            str += map[i][j];
        }
        str += '\n';
    }
    return str;
}

function locsToString(map) {
    for (var i = 0; i < map.length; i++) {
        console.log('====');
        console.log(map[i]);
        console.log('x: ', map[i].x);
        console.log('y: ', map[i].y);
        console.log('id: ', i);
    }
}
 

function mstToString(mst, locs) {
    for (var i = 0; i < mst.length; i++) {
        console.log('+++    ', i);
        console.log('s: ', locs[mst[i].start]);
        console.log('t: ', locs[mst[i].dest]);
        console.log('d: ', mst[i].length);
    }
}

function initArray(length) {
    var arr = [];
    for (var i = 0;i < length;i++) {
        arr.push(0);
    }
    return arr;
}

// it would be cool if this was seeded to the edges maybe
// or if there was some coefficient for how spread out the map should be
// close quarters could be fun too
function seedMap(map, n) {
    var x = 0,
        y = 0,
        locs = [];
    while (locs.length < n) {
        // assuming the map is always square for right now...
        x = getRandom(0, map.length);
        y = getRandom(0, map[0].length);
        if (map[y][x] != 0) continue;
        map[y][x] = 1;
        locs.push({"x":x, "y": y});
    }
    return locs;
}

// naive closest pairs
function createGraph(locs) {
    for (var i = 0;i < locs.length;i++) {
        for (var j = 0;j < locs.length;j++) {
            if (i == j) continue;
            var dist = Math.sqrt(Math.pow(locs[i].x - locs[j].x, 2) +
                                  Math.pow(locs[i].y - locs[j].y, 2));
            if (locs[i].edges == undefined) locs[i].edges = [];
            locs[i].edges.push({"start": i, "dest": j, "length": dist});
        }
        locs[i].edges.sort(function(a,b) { return a.length - b.length });
    }
}

function primmsMethod(locs) {
    var nodes = [ locs[0] ],
        edges = [],
        nodesUsed = [];
    // initialize false for every node except the first, since that is where we are starting
    nodesUsed.push(true); 
    for (var i = 1;i < locs.length;i++)  nodesUsed.push(false);

    while (nodes.length < locs.length) {
        console.log('------------- PASS: ', nodes.length, ' <= ', locs.length);
        console.log(nodesUsed);
        // search all nodes currently in MST for smallest edge
        var nextEdge = {"length": 999999};
        for (var i = 0; i < nodes.length;i++) {
            console.log();
            console.log('looking at node: ', nodes[i]);

            var thisNode = nodes[i];
            for (var j = 0; j < thisNode.edges.length; j++) {
                // don't repeat edges
                if (thisNode.edges[j].used) continue;
                // don't revisit nodes
                if (nodesUsed[thisNode.edges[j].dest]) continue;
                if (thisNode.edges[j].length < nextEdge.length) {
                    nextEdge = thisNode.edges[j];
                } else { 
                    // all edges for this node are longer than the current shortest node
                    // so we can skip it for now
                    break;
                }
            }
            console.log('this shorted node found was: ', nextEdge);
        }
        console.log('---- pass completed');
        console.log('the shortest node found was : ', nextEdge);
        console.log('from : ' , locs, ' to', nextEdge.dest);
        edges.push(nextEdge);
        nextEdge.used = true;
        // set the reverse of this edge to used as well
        var destinationNode = locs[nextEdge.dest];
        for (var k = 0;k < destinationNode.edges.length; k++) {
            if (destinationNode.edges[k].dest == nextEdge.start) {
                destinationNode.edges[k].used = true;
                break;
            }
        }
        nodesUsed[nextEdge.dest] = true;
        nodes.push(locs[nextEdge.dest]);
        nextEdge.destination = locs[nextEdge.dest];
        nextEdge.origin = locs[nextEdge.start];

    }
    return edges;
}

function renderGraph(mst, locs, ctx) {
    console.log(mst, locs);

    var margin = BlockSize * .15;
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'blue';
    for (var i = 0; i < locs.length; i++) {
        var x1 = locs[i].x * BlockSize + margin,
            y1 = locs[i].y * BlockSize + margin;
        ctx.beginPath();
        ctx.rect(x1, y1, BlockSize - 2 * margin, BlockSize - 2 * margin);
        ctx.stroke();
        ctx.fill();
    }
    ctx.lineWidth = .6;
    for (var i = 0;i < mst.length; i++) {
        var x1 = locs[mst[i].start].x * BlockSize + .5 * BlockSize,
            y1 = locs[mst[i].start].y * BlockSize + .5 * BlockSize;
            x2 = locs[mst[i].dest].x * BlockSize + .5 * BlockSize,
            y2 = locs[mst[i].dest].y * BlockSize + .5 * BlockSize;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

function renderMap(roomMap, ctx) {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'blue';
    for (var i = 0; i < roomMap.length; i++) {
        for (var j = 0; j < roomMap[i].length; j++) {
            if (roomMap[j][i] == 1) {
                ctx.beginPath();
                ctx.rect(i * BlockSize, j * BlockSize, BlockSize, BlockSize);
                ctx.stroke();
                ctx.fill();
            }
        }
    }
}

function buildMap(mst, map) {
    for (var i = 0;i < mst.length; i++) {
        var x1 = mst[i].origin.x,
            y1 = mst[i].origin.y;
            x2 = mst[i].destination.x,
            y2 = mst[i].destination.y;
        while (true) {
            var dx = x1 - x2,
                dy = y1 - y2;
            if (dx == 0 && dy == 0) break;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) x1 -= 1;
                else x1 += 1;
            } else {
                if (dy > 0) y1 -= 1;
                else y1 += 1;
            }
            map[y1][x1] = 1;
        }
    }
}

$(document).ready(function() {
    var jCanvas = $("#mainCanvas");
    console.log(jCanvas);
    jCanvas.css('background-color', 'rgba(255, 255, 255, 0)');
    canvasOffsetX = jCanvas.offset().left;
    canvasOffsetY = jCanvas.offset().top;
    canvas = jCanvas.get(0);
    canvas.height = CanvasHeight;
    canvas.width = CanvasWidth;
    ctx = canvas.getContext('2d');

    ctx.rect(0,0, CanvasWidth, CanvasHeight);
    ctx.fillStyle = "white";
    ctx.fill();



    var height = 10,
        width = 10,
        roomMap = [];

    for (var i = 0;i < height;i++) {
        roomMap.push(initArray(width));
    }

    var locs = seedMap(roomMap, 10);
    createGraph(locs);
    var mst = primmsMethod(locs);
    mstToString(mst, locs);

    //renderGraph(mst, locs, ctx);

    console.log('mst', mst);
    console.log('locs', locs);

    buildMap(mst, roomMap);
    renderMap(roomMap, ctx);
    console.log('roomMap', mapToString(roomMap));
});
