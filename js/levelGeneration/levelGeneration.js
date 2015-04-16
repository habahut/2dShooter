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
    for (var i = 0;i < world.roomMap.length;i++) {
        for (var j = 0;j < world.roomMap[0].length;j++) {

            var room = world.roomMap[i][j];
            if (room == 0) continue;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            room.walls.forEach(function(wall) {
                ctx.beginPath();
                ctx.moveTo(wall.x1, wall.y1);
                ctx.lineTo(wall.x2, wall.y2);
                ctx.stroke();
                ctx.closePath();
            });
            ctx.lineWidth = 10;
            ctx.strokeStyle = "blue";
            room.doors.forEach(function(door) {
                var x1 = 0, y1 = 0,
                    doorWidth = .2 * BlockSize;
                if (door.x1 == door.x2) {
                    x1 = (door.x1 + .5) * BlockSize;
                    if (door.y1 > door.y2) y1 = door.y1 * BlockSize;
                    else y1 = door.y2 * BlockSize;
                } else {
                    y1 = (door.y1 + .5) * BlockSize;
                    if (door.x1 > door.x2) x1 = door.x1 * BlockSize;
                    else x1 = door.x2 * BlockSize;
                }
                ctx.beginPath();
                ctx.rect(x1, y1, doorWidth, doorWidth);
                ctx.stroke();
                ctx.closePath();
            });
            ctx.lineWidth = 5;
            ctx.strokeStyle  = "yellow";
            room.windows.forEach(function(wind) {
                var x1 = 0, y1 = 0,
                    windWidth = .2 * BlockSize;
                if (wind.x1 == wind.x2) {
                    x1 = (wind.x1 + .5) * BlockSize;
                    if (wind.y1 > wind.y2) y1 = wind.y1 * BlockSize;
                    else y1 = wind.y2 * BlockSize;
                } else {
                    y1 = (wind.y1 + .5) * BlockSize;
                    if (wind.x1 > wind.x2) x1 = wind.x1 * BlockSize;
                    else x1 = wind.x2 * BlockSize;
                }
                ctx.beginPath();
                ctx.rect(x1, y1, windWidth, windWidth);
                ctx.stroke();
                ctx.closePath();
            });
        }
    }
}

function renderGrid(ctx, width, height) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    for (var x = 0;x < width;x += BlockSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.closePath();
    }
    for (var y = 0;y < height;y += BlockSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
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
        // if this location is already taken by other expanded rooms then
        // it will return with a 0 length. Dont add it to the list in that case
        if (room.length == 0) continue;
        var r = new Room(room, BlockSize);
        world.rooms.push(r);
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
                var r = new Room([ {"x": j, "y": i} ], BlockSize);
                map[i][j] = r;
                world.rooms.push(r);
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
                continue;
            }
        }
        world.roomMap[door.y1][door.x1].addDoor(door);
        world.roomMap[door.y2][door.x2].addDoor(door);
    };
}

function buildGraph(world) {
    /// this is getting duplicates.
    // we need to figure out some way to organize the x & y coordinates
    // so that we can reference them easily, instead of having to put
    // for loops everywhere.
    world.rooms.forEach(function(room) {
        room.coords.forEach(function(coord) {
            var x = coord.x,
                y = coord.y,
                // if this value == 1 then it is a standard room.
                // but all standard rooms are == 1. We want standard rooms
                // that are neighbors to still register.
                thisId = (world.map[y][x] == 1) ? -1 : world.map[y][x];
            /// can we move this out without losing the scope of 'room'?
            function compare(cx, cy) {
                if (!(0 <= cx && cx < world.map[0].length &&
                    0 <= cy && cy < world.map.length)) {
                        return;
                }
                if (world.map[cy][cx] != thisId && world.map[cy][cx] != 0) {
                    room.neighbors.push(world.roomMap[cy][cx]);
                    if (! room.hasDoor(cx, cy) ) {
                        room.addWindow(x, y, cx, cy);
                    }
                }
            }
            compare(x + 1, y);
            compare(x - 1, y);
            compare(x, y + 1);
            compare(x, y - 1)
        });
    });
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
    renderGrid(ctx, canvas.width, canvas.height);

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
    buildGraph(world);
    // addWindows() -> self explanatory
    renderRooms(world, ctx);
    console.log('world:', world);
    console.log('roomMap', mapToString(world.roomMap));
});

////// next steps
//
//  turn the room objects themselves into the graph
//  each room should have a neighbors object with links to the other
//  rooms within it.
//  assignThis in a method that checks all adjacency. If there is a door between
//  the two rooms, make them neighbors, if not put a window there.
//
//
//
//
//
//  maybe try and chose rooms to expand that are far away from eachother? that way 
//  there will be less frequent overlapping
//
//  we shoudl really create a world object with convenience methods...
