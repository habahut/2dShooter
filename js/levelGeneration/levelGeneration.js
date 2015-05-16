CanvasWidth = 560;
CanvasHeight = 560;
BlockSize = CanvasHeight / 10;
MapHeight = 10;
MapWidth = 10;

function mapToString(map) {
    var str = '';
    for (var i = 0;i < MapHeight;i++) {
        for (var j = 0;j < MapWidth;j++) {
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
    labelAxis(ctx);
    world.rooms.forEach(function(room) {
        room.render(ctx);
    });
    return;
}

function renderMultiRooms(world, ctx) {
    ctx.strokeStyle = "blue";
    world.multiRoomObjects.forEach(function(obj) {
        ctx.beginPath();
        ctx.moveTo(obj.x1, obj.y1);
        ctx.lineTo(obj.x2, obj.y1);
        ctx.lineTo(obj.x2, obj.y2);
        ctx.lineTo(obj.x1, obj.y2);
        ctx.stroke();
        ctx.closePath();
    });
}

function labelAxis(ctx) {
    ctx.rect(BlockSize,BlockSize, CanvasWidth, CanvasHeight);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.font = "12px Georgia";
    ctx.fillStyle = "black";
    for (var x = 0; x < MapWidth; x++) {
        ctx.fillText(x, x * BlockSize + .5 * BlockSize, .5 * BlockSize);
    }
    for (var y = 1; y < MapHeight; y++) {
        ctx.fillText(y, .5 * BlockSize, y * BlockSize + .5 * BlockSize);
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
        x = getRandom(margin, MapWidth - 1 - margin);
        y = getRandom(margin, MapHeight - 1 - margin);
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
        // search all nodes currently in MST for smallest edge
        var nextEdge = {"length": 999999};
        for (var i = 0; i < nodes.length;i++) {
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
        }
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

function roomWalk(mst, w, h,       ctx) {
    //var numExpansions = 5 / 10 * mst.length,
    var numExpansions = 8,
        expansions = [],
        expandLocs = [],
        count = 0,
        tries = 0;
    /////// this should be refactored into its own function
    while (expansions.length < numExpansions) {
        tries++;
        expansions.push(getRandom(0, mst.length - 1));
        expansions.sort(function(a, b) { return a - b });
        makeUnique(expansions);
        if (tries > numExpansions * 5) break;
    }

    var world = {};
    world.map = new IndexXY("single");
    //// should also be an indexXY
    world.doors = [];
    for (var i = 0;i < mst.length; i++) {
        var x1 = mst[i].origin.x,
            y1 = mst[i].origin.y;
            x2 = mst[i].destination.x,
            y2 = mst[i].destination.y;
        while (true) {
            var dx = x1 - x2,
                dy = y1 - y2;
            world.map.insert(x1, y1, 1);
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
        var r = [];
        mergeRooms(world.map, expandId, expandLocs[i][0], expandLocs[i][1], r);
        // if this location is already taken by other expanded rooms then
        // it will return with a 0 length. Dont add it to the list in that case
        if (r.length == 0) continue;
        var room = new Room(r, BlockSize);
        room.coords.forEach(function(coord, x, y) {
            world.map.insert(x, y, room);
        });
        world.rooms.push(room);
        expandId++;
    }
    return world;
}

function mergeRooms(map, id, x, y, rooms, depth) {
    if (!(0 <= x && x < MapWidth &&
          0 <= y && y < MapHeight)) {
           return;
    }
    depth = depth || 1;
    if (depth > 2) return;
    if (map.get(x, y) == 0) {
        if (getRandomNR(0, 1) < .6 / depth) {
            map.insert(x, y , id);
            rooms.push({"x": x,"y": y});
        }
    } else if (map.get(x, y) == 1) {
        rooms.push({"x": x,"y": y});
        map.insert(x, y, id);
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
    world.map.forEach(function(obj, x, y) {
        if (obj == 1) {
            var room = new Room([ {"x": x, "y": y} ], BlockSize);
            world.rooms.push(room);
            world.map.insert(x, y, room);
        }
    });
}

function cullDoors(world, ctx) { 
    /// TODO: have a think: should this be an IndexXY?
    var doors = [];
    for (var i = world.doors.length - 1;i >= 0;i--) {
        var door = world.doors[i];
        // if both the start and end have the same value
        // and the value is not a "regular" room (1), then the door
        // is between nodes in the same expanded room and can be removed
        if (world.map.get(door.x1, door.y1) == world.map.get(door.x2, door.y2) ) {
            world.doors.splice(i, 1);
            continue;
        }
        console.log('-----');
        //c\nsole.log('the door', door.x1, door.y1, door.x2, door.y2);

        var doorObj = new Door(door.x1, door.y1, door.x2, door.y2, BlockSize);
        world.map.get(door.x1, door.y1).addDoor(doorObj);
        world.map.get(door.x1, door.y1).cutWall(door.x1, door.y1, doorObj, doorObj.position);
        world.map.get(door.x2, door.y2).addDoor2(doorObj);
        world.map.get(door.x2, door.y2).cutWall(door.x2, door.y2, doorObj, doorObj.invPosition);
        world.multiRoomObjects.push(doorObj);
    };
}

function buildGraph(world) {
    world.rooms.forEach(function(room) {
        function compare(x, y, cx, cy) {
            if (!(0 <= cx && cx < MapWidth)
                && (0 <= cy && cy < MapHeight)) {
                    return;
            }
            var other = world.map.get(cx, cy);
            if (room != other && other != 0) {
                room.neighbors.insert(cx, cy, other);
                if (! room.hasDoorBetween(x, y, cx, cy) ) {
                    room.addWindow(x, y, cx, cy);
                }
            }
        }
        room.coords.forEach(function(coord) {
            var x = coord.x,
                y = coord.y;
            compare(x, y, x + 1, y);
            compare(x, y, x - 1, y);
            compare(x, y, x, y + 1);
            compare(x, y, x, y - 1)
        });
    });
    return;
}

$(document).ready(function() {
    var jCanvas = $("#mainCanvas");
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

    //var numSeeds = 15;
    var map1 = initMap(MapWidth, MapHeight),
        numSeeds = 20,
        locs = seedMap(map1, numSeeds);
    createGraph(locs);
    var mst = primmsMethod(locs),
        world = roomWalk(mst, MapWidth, MapHeight,      ctx);
    // render everything in this room. Collide the adjacent rooms with the 
    // camera and the field of vision.
    // nonRoomedObjects are objects that aren't in one single room, such as 
    // doors. They need to all be checked individually.
    ////// need some useful structure for this thing probably....
    world.multiRoomObjects = [];
    roomifyAll(world);
    renderRooms(world, ctx);

    cullDoors(world, ctx);
    buildGraph(world);


    renderRooms(world, ctx);
    renderMultiRooms(world, ctx);

    console.log('world:', world);
});

////// next steps
//
//  windows are only getting added to one side. 
//  should step through it with the debugger... maybe its getting 
//  over written again?
//
//
//
//  maybe try and chose rooms to expand that are far away from eachother? that way 
//  there will be less frequent overlapping
