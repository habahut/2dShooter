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
        margin = 1;
        x = getRandom(margin, map.length -1 - margin);
        y = getRandom(margin, map[0].length  - 1- margin);
        if (map[y][x] != 0) continue;
        map[y][x] = 1;
        locs.push({"x":x, "y": y});
    }
    return locs;
}

// creates edges between nodes, with edge length equal to the absolute distance
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
            if (roomMap[j][i] != 1) continue;
                        ctx.beginPath();
            ctx.rect(i * BlockSize, j * BlockSize, BlockSize, BlockSize);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
    }
}

function renderRooms(world, ctx) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    for (var i = 0;i < world.roomMap.length;i++) {
        for (var j = 0;j < world.roomMap[0].length;j++) {
            var room = world.roomMap[i][j];
            if (room == 0) continue;
            console.log('the room is: ', room);
            for (var k = 0;k < room.walls.length; k++) {
                var wall = room.walls[k];
                ctx.beginPath();
                ctx.moveTo(wall.x1, wall.y1);
                ctx.lineTo(wall.x2, wall.y2);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function renderDoors(doors) {
    ctx.strokeStyle = "white";
    for (var i = 0;i < doors.length; i++) {
        var door = doors[i];
        var hBlock = BlockSize * .5;
        ctx.lineWidth = 15;
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(door.x1 * BlockSize + hBlock, door.y1 * BlockSize + hBlock);
        ctx.lineTo(door.x2 * BlockSize + hBlock, door.y2 * BlockSize + hBlock);
        ctx.stroke();
        ctx.closePath();
    }
}

function roomWalk(mst, w, h) {
    //var numExpansions = 5 / 10 * mst.length,
    var numExpansions = 5,
        expansions = [],
        expandLocs = [],
        count = 0;
    console.log('expanion details', mst.length, numExpansions);
    /////// this should be refactored into its own function
    while (expansions.length < numExpansions) {
        expansions.push(getRandom(0, mst.length - 1));
        expansions.sort(function(a, b) { return a - b });
        makeUnique(expansions);
    }

    var world = {};
    world.map = initMap(w, h);
    world.doors = [];
    for (var i = 0;i < mst.length; i++) {
        var x1 = mst[i].origin.x,
            y1 = mst[i].origin.y;
            x2 = mst[i].destination.x,
            y2 = mst[i].destination.y;
        while (true) {
            var dx = x1 - x2,
                dy = y1 - y2;
            world.map[y1][x1] = 1;
            if (expansions[count] == i) {
                var lengthRemaining = Math.abs(x1 - x2 + y1 - y2);
                if (getRandom(0, lengthRemaining) == 0) {
                    expandLocs.push([x1, y1]);
                    chanceExpand = false;
                    count++;
                }
            }
            if (dx == 0 && dy == 0) break;
            var door = {"x1": x1, "y1": y1};
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) x1 -= 1;
                else x1 += 1;
            } else {
                if (dy > 0) y1 -= 1;
                else y1 += 1;
            }
            // add newly modified values
            door.x2 = x1;
            door.y2 = y1;
            world.doors.push(door);
        }
    }

    world.rooms = [];
    // each expanded room gets an ID within the map array
    // to simplify identifying it later.
    var expandId = 2; 
    for (var i = 0;i < expandLocs.length;i++) {
        var room = [];
        mergeRooms(world.map, expandId, expandLocs[i][0], expandLocs[i][1], room);
        world.rooms.push(new Room(room, BlockSize));
        expandId++;
    }
    return world;
}

function mergeRooms(map, id, x, y, rooms, depth) {
    if (!(0 <= x && x < map[0].length &&
        0 <= y && y < map.length)) {
           return;
    }
    depth = depth || 1;
    if (depth > 2) return;
    if (map[y][x] == 0) {
        if (getRandomNR(0,1) < .6 / depth) {
            map[y][x] = id;
            rooms.push({"x": x,"y": y});
        }
    } else if (map[y][x] == 1) {
        rooms.push({"x": x,"y": y});
        map[y][x] = id;
        /// depth squared?
        if (getRandomNR(0,1) < 1 / depth) {
            mergeRooms(map, id, x - 1, y, rooms, depth + 1);
        }
        if (getRandomNR(0,1) < 1 / depth) {
            mergeRooms(map, id, x + 1, y, rooms, depth + 1);
        }
        if (getRandomNR(0,1) < 1 / depth) {
            mergeRooms(map, id, x, y - 1, rooms, depth + 1);

        }
        if (getRandomNR(0,1) < 1 / depth) {
            mergeRooms(map, id, x, y + 1, rooms, depth + 1);
        }
    }
}

function roomifyAll(world) {
    var map = initMap(world.map[0].length, world.map.length);
    world.rooms.forEach(function(room) {
        for (var i = 0; i < room.coords.length;i++) {
            var x = room.coords[i].x,
                y = room.coords[i].y;
            map[y][x] = room;
        }
    });

    for (var i = 0;i < world.map.length;i++) {
        for (var j = 0;j < world.map[0].length;j++) {
            if (world.map[i][j] == 1) {
                map[i][j] = new Room([ {"x": j, "y": i} ], BlockSize);
            }
        }
    }
    world.roomMap = map;
}

function cullDoors(world) {
    for (var i = world.doors.length - 1;i >= 0;i--) {
        door = world.doors[i];
        // if both the start and end have the same value
        // and the value is not a "regular" room (1), then the door
        // is between nodes in the same expanded room and can be removed
        if (world.map[door.y1][door.x1] == world.map[door.y2][door.x2]) {
            if (world.map[door.y1][door.x1] != 1) {
                world.doors.splice(i, 1);
            }
        }
    };
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
        numSeeds = 15;
        map1 = initMap(width, height);

    var locs = seedMap(map1, numSeeds);
    createGraph(locs);
    var mst = primmsMethod(locs);
    var world = roomWalk(mst, width, height);
    roomifyAll(world);
    cullDoors(world);
    // assign doors() -> assigns all doors to the various rooms they belong to
    // addWindows() -> self explanatory
    //renderMap(world.map, ctx);
    //renderExpandedRooms(world.expandedRooms, ctx);
    renderRooms(world, ctx);
    renderDoors(world.doors);
    console.log('roomMap', mapToString(world.roomMap));
});

////// important: should transform world.map into 
// world.oldMap or something, world.map should be the new 
// array of rooms


////// next steps
//
//  turn all rooms into room objects.
//  cull doors within rooms
//
//
//
//  maybe try and chose rooms to expand that are far away from eachother? that way 
//  there will be less frequent overlapping
//
//  create windows. it seems likely this will require iterating over all the rooms to see
//  whats next to it. Could also create teh adjacency map during room walk
