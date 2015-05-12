ROOM_ID = 0;
(function() {
    function Room(coords, roomSize, sprites) {
        var self = this;
        this.sprites = sprites || [];
        this.walls = defineWalls(coords, roomSize); 
        this.roomSize = roomSize;
        this.coords = new IndexXY("single");
        coords.forEach(function(coord) {
            self.coords.insert(coord.x, coord.y, {"x": coord.x, "y": coord.y});
        });

        this.doors = new IndexXY("multiple");
        this.neighbors = new IndexXY("multiple");
        this.windows = new IndexXY("multiple");
        this.id = ROOM_ID++;
    };

    function defineWalls(coords, roomSize) {
        // it would be cool if we could sort these walls clockwise
        // then we woudln't need to begin and close path each time we draw
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
            /// javascript is fucking retarded.
            // it is treating (x + 1) as a string, which makes 4 into 41 instead of 5.
            // what the fuck
            var x1 = x + 1,
                y1 = y + 1;

            if (thisWalls.n) {
                walls.push({"x1": x * roomSize, "y1": y * roomSize, 
                            "x2": x1 * roomSize, "y2": y * roomSize});
            }
            if (thisWalls.e) {
                walls.push({"x1": x1 * roomSize, "y1": y * roomSize,
                            "x2": x1 * roomSize, "y2": y1 * roomSize});
            }
            if (thisWalls.s) {
                walls.push({"x1": x * roomSize, "y1": y1 * roomSize, 
                            "x2": x1 * roomSize, "y2": y1 * roomSize});
            }
            if (thisWalls.w) {
                walls.push({"x1": x * roomSize, "y1": y * roomSize, 
                            "x2": x * roomSize, "y2": y1 * roomSize});
            }
        }
        return walls;
    }

    Room.prototype = {
        "addDoor": function(door) {
            // "orient the door" such that this door's x1 and y1 are in this room
            // and x2, y2 are in the room it leads to
            if (! this.coords.get(door.x1, door.y1)) {
                var doorCopy = {'x1': door.x2, 'y1': door.y2, 'x2': door.x1, 'y2': door.y1};
            } else {
                var doorCopy = {'x1': door.x1, 'y1': door.y1, 'x2': door.x2, 'y2': door.y2};
            }

            //  TODO:
            //  this should cut the wall in half that the door is set up on...
            //  should probably create a door Class actually, because then we can
            //  do interesting things like attach physics to doors and such.



            this.doors.insert(doorCopy.x1, doorCopy.y1, doorCopy);
        },
        "hasDoorBetween": function(ox, oy, tx, ty) {
            var flag = false,
                doors = this.doors.getMany(ox, oy);
            if (doors) { 
                doors.forEach(function(door) {
                    if (door && door.x2 == tx && door.y2 == ty) {
                        flag = true;
                    }
                });
            }
            return flag;
        },
        "addWindow": function(x1, y1, x2, y2) {
            this.windows.insert(x1, y1, {"x1": x1, "y1": y1, "x2": x2, "y2": y2});
        },
        "render": function(ctx) {
            var self = this;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            this.walls.forEach(function(wall) {
                ctx.beginPath();
                ctx.moveTo(wall.x1, wall.y1);
                ctx.lineTo(wall.x2, wall.y2);
                ctx.stroke();
                ctx.closePath();
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
