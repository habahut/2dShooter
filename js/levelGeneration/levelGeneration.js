CanvasWidth = 560;
CanvasHeight = 560;
BlockSize = CanvasHeight / 10;

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

function initMap(width, height) {
    var map = [];
    for (var i = 0;i < height;i++) {
        map.push(initArray(width));
    }
    return map;
}

// it would be cool if this was seeded to the edges maybe
// or if there was some coefficient for how spread out the map should be
// close quarters could be fun too
function seedMap(map, n) {
    var x = 0,
        y = 0,
        locs = [];
    while (locs.length < n) {
        // cluster the points?
        margin = 0;
        x = getRandom(margin, map.length -1 - margin);
        y = getRandom(margin, map[0].length  - 1- margin);
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
        //console.log('------------- PASS: ', nodes.length, ' <= ', locs.length);
        //console.log(nodesUsed);
        // search all nodes currently in MST for smallest edge
        var nextEdge = {"length": 999999};
        for (var i = 0; i < nodes.length;i++) {
            //console.log();
            //console.log('looking at node: ', nodes[i]);

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
            //console.log('this shorted node found was: ', nextEdge);
        }
        //console.log('---- pass completed');
        //console.log('the shortest node found was : ', nextEdge);
        //console.log('from : ' , locs, ' to', nextEdge.dest);
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
    for (var i = 0; i < roomMap.length; i++) {
        for (var j = 0; j < roomMap[i].length; j++) {
            if (roomMap[j][i] == 0) continue;
            if (roomMap[j][i] == 1) {
                ctx.fillStyle = 'red';
                ctx.strokeStyle = 'blue';
            } else {
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "red";
            }
            ctx.beginPath();
            ctx.rect(i * BlockSize, j * BlockSize, BlockSize, BlockSize);
            ctx.stroke();
            ctx.fill();
        }
    }
}

function roomWalk(mst, w, h) {
    // want to get 4 expansions per 10 edges in the graph
    // assuming map is square
    var numExpansions = 4 / 10 * mst.length,
        expansions = [],
        expandLocs = [],
        count = 0;
    while (expansions.length < numExpansions) {
        expansions.push(getRandom(0, mst.length - 1));
        expansions.sort(function(a, b) { return a - b });
        makeUnique(expansions);
    }

    console.log('these are our options');
    console.log(expansions[0]);
    console.log(mst[expansions[0]]);
    console.log(expansions[1]);
    console.log(mst[expansions[1]]);
    console.log(expansions[2]);
    console.log(mst[expansions[2]]);
    console.log(expansions[3]);
    console.log(mst[expansions[3]]);

    var map = initMap(w, h);
    for (var i = 0;i < mst.length; i++) {
        var x1 = mst[i].origin.x,
            y1 = mst[i].origin.y;
            x2 = mst[i].destination.x,
            y2 = mst[i].destination.y;
        while (true) {
            var dx = x1 - x2,
                dy = y1 - y2;
            map[y1][x1] = 1;
            if (expansions[count] == i) {
                var lengthRemaining = Math.abs(x1 - x2 + y1 - y2);
                if (getRandom(0, lengthRemaining) == 0) {
                    expandLocs.push([x1, y1]);
                    console.log('found a loc:', x1, y1);
                    chanceExpand = false;
                    count++;
                }
            }
            if (dx == 0 && dy == 0) break;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) x1 -= 1;
                else x1 += 1;
            } else {
                if (dy > 0) y1 -= 1;
                else y1 += 1;
            }
        }
    }

    var expandedRooms = [];
    for (var i = 0;i < expandLocs.length;i++) {
        expandedRooms.push(mergeRooms(map, expandLocs[i][0], expandLocs[i][1]));
        console.log('--------------');
    }
    console.log(expandedRooms);

    return map;
}

function flattenRoomObj(rooms, obj) {
    for (var i = 0;i < obj.length;i++) {
        if (obj[i])
            rooms.push(obj[i]);
    }
}

function mergeRooms(map, x, y, depth) {
    var prefix = "";
    for (var l = 0;l < depth;l++) prefix += "  ";

    console.log(prefix, 'merge rooms called!' , x , y );

    var rooms = [];
    if (!(0 <= x && x < map[0].length &&
        0 <= y && y < map.length)) {
           return [];
    }
    if (depth > 2) return [];
    depth = depth || 1;
    if (map[y][x] == 0) {
        if (getRandomNR(0,1) < .6 / depth) {
            console.log(prefix, 'converted ', x ,y );
            map[y][x] = 2;
            rooms.push({"x": x,"Y": y});
        }
    } else if (map[y][x] == 1) {
        console.log(prefix, "setting: ", x, y);
        rooms.push({"x": x,"y": y});
        map[y][x] = 2;
        if (getRandomNR(0,1) < .9 / depth) {
            flattenRoomObj(mergeRooms(map, x - 1, y, depth + 1), rooms);
            //rooms.push(mergeRooms(map, x - 1, y, depth + 1));
        }
        if (getRandomNR(0,1) < .9 / depth) {
            flattenRoomObj(mergeRooms(map, x + 1, y, depth + 1), rooms);
            //rooms.push(mergeRooms(map, x + 1, y, depth + 1));
        }
        if (getRandomNR(0,1) < .9 / depth) {
            flattenRoomObj(mergeRooms(map, x, y - 1, depth + 1), rooms);
            //rooms.push(mergeRooms(map, x, y - 1, depth + 1));
        }
        if (getRandomNR(0,1) < .9 / depth) {
            flattenRoomObj(mergeRooms(map, x, y + 1, depth + 1), rooms);
            //rooms.push(mergeRooms(map, x, y + 1, depth + 1));
        }
    }
    return rooms;
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
        numSeeds = 10;
        map1 = initMap(width, height);

    var locs = seedMap(map1, numSeeds);
    createGraph(locs);
    var mst = primmsMethod(locs);

    //mstToString(mst, locs);
    //renderGraph(mst, locs, ctx);
    //console.log('mst', mst);
    //console.log('locs', locs);

    var map2 = roomWalk(mst, width, height);
    renderMap(map2, ctx);
    console.log('roomMap', mapToString(map2));
});
