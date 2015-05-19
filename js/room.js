ROOM_ID = 0;(function() {
    function Room(coords, roomSize, sprites) {
        var self = this;
        this.sprites = sprites || [];
        this.roomSize = roomSize;
        this.maxwindowSize = .2 * roomSize;
        this.coords = new IndexXY("single");
        coords.forEach(function(coord) {
            self.coords.insert(coord.x, coord.y, {"x": coord.x, "y": coord.y, "walls": {} });
        });
        this.doors = new IndexXY("multiple");
        this.neighbors = new IndexXY("multiple");
        this.windows = new IndexXY("multiple");
        this.id = ROOM_ID++;

        defineWalls(self);
    }

    function defineWalls(self) {
        self.coords.forEach(function(coord, x, y) {
            var xP1 = x + 1,
                yP1 = y + 1,
                roomSize = self.roomSize;
            // coordinates specify the dimensions of this room.
            // check each adjacent space. If it is not occupied by another coordinate,
            // then we should add the wall.
            if (! self.coords.get(x + 1, y)) {
                coord.walls.e = {"x1": xP1 * roomSize, "y1": y * roomSize,
                                "x2": xP1 * roomSize, "y2": yP1 * roomSize};
            }
            if (! self.coords.get(x - 1, y)) {
                coord.walls.w = {"x1": x * roomSize, "y1": y * roomSize, 
                                "x2": x * roomSize, "y2": yP1 * roomSize};
            }
            if (! self.coords.get(x, y + 1)) {
                coord.walls.s = {"x1": x * roomSize, "y1": yP1 * roomSize, 
                                "x2": xP1 * roomSize, "y2": yP1 * roomSize};
            }
            if (! self.coords.get(x, y - 1)) {
                coord.walls.n = {"x1": x * roomSize, "y1": y * roomSize, 
                                "x2": xP1 * roomSize, "y2": y * roomSize}; 
            }
        });
    }

    Room.prototype = {
        // these two methods reflect the fact that the door objects are immutable.
        // The door needs to be added to 2 rooms, but the relevant coordinates (door.r1x vs door.r2x)
        // don't change, so we need a clear way to specify if this is room 1 or 2 of the doors coordinates.
        //
        // the current plan is that each room gets its own copy of the coordinates of the door
        // just so it has its own convenient way to check the presence of it
        //
        // the door itself is a multiRoom object, and its state is maintained elsewhere.
        "addDoor": function(door) {
            this.doors.insert(door.r1x, door.r1y, door);
        },
        "addDoor2": function(door) {
            var doorCopy = {"r1x": door.r2x, "r1y": door.r2y, "r2x": door.r1x, "r2y": door.r1y};
            this.doors.insert(door.r2x, door.r2y, doorCopy);
        },
        "cutWall": function(roomX, roomY, obj, wallPosition) {
            var wall = this.coords.get(roomX, roomY).walls[wallPosition],
                wall1 = {"x1": wall.x1, "y1": wall.y1, "x2": obj.x1, "y2": obj.y1},
                wall2 = {"x1": obj.x2, "y1": obj.y2, "x2": wall.x2, "y2": wall.y2};
            this.coords.get(roomX, roomY).walls[wallPosition] = [wall1, wall2];

        },
        "hasDoorBetween": function(ox, oy, tx, ty) {
            var flag = false,
                doors = this.doors.getMany(ox, oy);
            if (doors) { 
                doors.forEach(function(door) {
                    if (door && door.r2x == tx && door.r2y == ty) {
                        flag = true;
                    }
                });
            }
            return flag;
        },
        "addWindow": function(x1, y1, windowObj) {
            // TODO split this into multiple windows?
            this.windows.insert(x1, y1, {"x1": x1, "y1": y1, "x2": x2, "y2": y2});
        },
        /*
        "addWindow2": function(x1, y1, windowObj) {
            var windowCopy = {"r1x": r2x, "r1y": r2y, "r2x": r1x, "r2y": r1y}; 
            this.windows.insert(x1, y1, windowCopy);
        },
        */
        "render": function(ctx) {
            var self = this;
            function drawWall(wall) {
                ctx.beginPath();
                ctx.moveTo(wall.x1, wall.y1);
                ctx.lineTo(wall.x2, wall.y2);
                ctx.stroke();
                ctx.closePath();
            }
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            this.coords.forEach(function(coord) {
                for (var p in coord.walls) {
                    if (typeof coord.walls[p].length == "undefined") {
                        drawWall(coord.walls[p]);
                    } else {
                        coord.walls[p].forEach(drawWall);
                    }
                }
            });

            ctx.lineWidth = 10;
            ctx.strokeStyle = "blue";
            this.doors.forEachMany(function(door) {
                var x = 0, y = 0,
                    doorWidth = .05 * self.roomSize;
                if (door.x1 == door.x2) {
                    x = (door.x1 + .5) * self.roomSize;
                    if (door.y1 > door.y2) {
                        y = door.y1 * self.roomSize;
                        y += 10;
                    } else {
                        y = door.y2 * self.roomSize;
                        y -= 10;
                    }
                } else {
                    y = (door.y1 + .5) * self.roomSize;
                    if (door.x1 > door.x2) {
                        x = door.x1 * self.roomSize;
                        x += 10;
                    } else { 
                        x = door.x2 * self.roomSize;
                        x -= 10;
                    }
                }
                ctx.beginPath();
                ctx.rect(x, y, doorWidth, doorWidth);
                ctx.stroke();
                ctx.closePath();
            });

            ctx.lineWidth = 5;
            ctx.strokeStyle  = "green";
            this.windows.forEachMany(function(wind) {
                var x = 0, y = 0,
                    windWidth = .1 * self.roomSize;
                if (wind.x1 == wind.x2) {
                    x = (wind.x1 + .5) * self.roomSize;
                    if (wind.y1 > wind.y2) {
                        y = wind.y1 * self.roomSize;
                        y += 10;
                    } else {
                        y = wind.y2 * self.roomSize;
                        y -= 10;
                    }
                } else {
                    y = (wind.y1 + .5) * self.roomSize;
                    if (wind.x1 > wind.x2) {
                        x = wind.x1 * self.roomSize;
                        x += 10;
                    } else {
                        x = wind.x2 * self.roomSize;
                        x -= 10;
                    }
                }
                ctx.beginPath();
                ctx.rect(x, y, windWidth, windWidth);
                ctx.stroke();
                ctx.closePath();
            });
            ctx.font = "12px Georgia";
            ctx.fillStyle = "black";
            this.coords.forEach(function(coord) {
                var x = coord.x,
                    y = coord.y;
                ctx.fillText(self.id, x * BlockSize + .5 * BlockSize, y * BlockSize + .5 * BlockSize);
            });
        },



        //// once we integrate this into the main program the render
        //function will look something like this ...
        "actualRender": function(camera) {
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
    };

    window.Room = Room;
})();
