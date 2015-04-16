(function() {
    function Room(coords, roomSize, sprites) {
        var self = this;
        this.sprites = sprites || [];
        this.walls = defineWalls(coords, roomSize); 
        this.roomSize = roomSize;
        this.coords = coords;
        this.doors = [];
        this.neighbors = [];
        this.windows = [];
    };

    function defineWalls(coords, roomSize) {
        walls = [];
        for (var i = 0;i < coords.length;i++) {
            var thisRoom = coords[i],
                thisWalls = {"n": 1, "e": 1, "s": 1, "w": 1},
                x = thisRoom.x,
                y = thisRoom.y;

            for (var j = 0; j < coords.length; j++) {
                if (i == j) continue;
                var compareRoom = coords[j];
                // if the y values are the same, compare if they are adjacent in the 
                // X plane, if so remove the wall between them.
                if (thisRoom.y == compareRoom.y) {
                    if (thisRoom.x + 1 == compareRoom.x) thisWalls.e = 0;
                    if (thisRoom.x - 1 == compareRoom.x) thisWalls.w = 0;
                }
                // same as above, but if the X is the same, then remove adjacent
                // walls along the Y plane.
                if (thisRoom.x == compareRoom.x) {
                    if (thisRoom.y + 1 == compareRoom.y) thisWalls.s = 0;
                    if (thisRoom.y - 1 == compareRoom.y) thisWalls.n = 0;
                }
            }
            if (thisWalls.n) {
                walls.push({"x1": x * roomSize, "y1": y * roomSize, 
                            "x2": (x + 1) * roomSize, "y2": y * roomSize});
            }
            if (thisWalls.e) {
                walls.push({"x1": (x + 1) * roomSize, "y1": y * roomSize,
                            "x2": (x + 1) * roomSize, "y2": (y + 1) * roomSize});
            }
            if (thisWalls.s) {
                walls.push({"x1": x * roomSize, "y1": (y + 1) * roomSize, 
                            "x2": (x + 1) * roomSize, "y2": (y + 1) * roomSize});
            }
            if (thisWalls.w) {
                walls.push({"x1": x * roomSize, "y1": y * roomSize, 
                            "x2": x * roomSize, "y2": (y + 1) * roomSize});
            }
        }
        return walls;
    }

    Room.prototype = {
        "addDoor": function(door) {
            // "orient the door" such that this door's x1 and y1 are in this room
            // and x2, y2 are in the room it leads to
            var flag = false;
            this.coords.forEach(function(coord) {
                if (door.x1 == coord.x && door.y1 == coord.y) {
                    flag = true;
                    return;
                }
            });
            if (! flag) {
                door = {'x1': door.x2, 'y1': door.y2, 'x2': door.x1, 'y2': door.y1};
            }
            this.doors.push(door);
        },
        "hasDoor": function(x,y) {
            var flag = false;
            this.doors.forEach(function(door) {
                if (door.x2 == x && door.y2 == y) {
                    flag = true;
                    return;
                }
            });
            return flag;
        },
        "addWindow": function(x1, y1, x2, y2) {
            this.windows.push({"x1": x1, "y1": y1, "x2": x2, "y2": y2});
        }

    };

    function render(camera) {
        camera.customRenderMany(this.walls, function(ctx, wall) {
            ctx.beginPath();
            ctx.strokeStyle = "black"
            ctx.lineWidth = 3;
            ctx.moveTo(wall.x1, wall.y1);
            ctx.lineTo(wall.x2, wall.y2);
            ctx.stroke();
            ctx.closePath();
        });
    }

    window.Room = Room;
})();
