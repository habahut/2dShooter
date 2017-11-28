/**
 * Generates a random assortment of rooms with connecting windows and doors
 */

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

function roomWalk(mst, w, h) {
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

function cullDoors(world) {
    /// TODO: have a think: should this be an IndexXY?
    var doors = [];
    for (var i = world.doors.length - 1;i >= 0;i--) {
        var door = world.doors[i];
        // if both the start and end have the same value
        // and the value is not a "regular" room (1), then the door
        // is between nodes in the same expanded room and can be removed
        if (world.map.get(door.x1, door.y1) == world.map.get(door.x2, door.y2) ) {
            continue;
        }
        var doorObj = new Door(door.x1, door.y1, door.x2, door.y2, BlockSize);
        world.map.get(door.x1, door.y1).addDoor(doorObj);
        world.map.get(door.x1, door.y1).cutWall(door.x1, door.y1, doorObj, doorObj.position);
        world.map.get(door.x2, door.y2).addDoor2(doorObj);
        world.map.get(door.x2, door.y2).cutWall(door.x2, door.y2, doorObj, doorObj.invPosition);
        doors.push(doorObj);
    };
    world.doors = doors;
}

function buildGraph(world) {
    world.windows = [];
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
                    var windowObj = new WindowObj(x, y, cx, cy, BlockSize);
                    room.addWindow(x, y, cx, cy);
                    world.windows.push(windowObj);
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

/// returns a 'world' object that contains the map.
// Structure:
//  world: {
//      doors: [ door1: { 
//                          x1,y1,x2,y2                // coordinates
//                          r1x, r1y, r2x, r2y         // the two rooms it is between
//                          position                   // which compass direction wall its on 'e', 'w', 's', 'n'
//                          function render            // draw the door
//                          function collide(obj)      // returns true if the obj
//                      }
//              ... ],
//      windows: [ window1: { same as above }
//              ...],
//      rooms: [ room1: {
//                          coords (indexXY) {
//                              x -> y
//                                  walls: {
//                                      'n/s/w/e' { x1, y2, x2, y2 }
//                                   }
//                          }                                       // easily accessible storage for walls and coordinates of this room
//                          doors (indexXY) {
//                              x -> y
//                                  doors: [
//                                      { x1, y1, x2, y2 }          // this may either be the door object or {x1,y1,x2,y2}. either way only these
//                                                                  // values should be expected
//                                  ]
//                          }
//                          neighbors(indexXY) {
//                              x -> y:
//                                  room                            // same as this
//                          }
//                          windows(indexXY) {
//                              x -> y:
//                                  window                          // same as doors, should only rely on {x1,y1,x2,y2}
//                          }
//                          sprites (array) 
//                      }
//              ...]
//      multiRoomObjects: [ obj ]     // some sort of object that spans multiple rooms. Not currently used
//      map: indexXY                  // maps coordinates to the rooms stored in the array above
//  }
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
        world = roomWalk(mst, MapWidth, MapHeight);
    world.multiRoomObjs = [];
    roomifyAll(world);
    renderRooms(world, ctx);

    cullDoors(world);
    buildGraph(world);

    renderRooms(world, ctx);
    renderDoors(world, ctx);
    renderWindows(world, ctx);

    console.log('world:', world);
});
