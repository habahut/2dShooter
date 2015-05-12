ROOM_ID = 0;
(function() {
    function Room(coords, roomSize, sprites) {
        var self = this;
        this.sprites = sprites || [];
        this.roomSize = roomSize;
        this.maxDoorSize = .5 * roomSize;
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
            console.log('this coord', coord, x, y);
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
        //  TODO:
        //  this should cut the wall in half that the door is set up on...
        //  should probably create a door Class actually, because then we can
        //  do interesting things like attach physics to doors and such.
        "addDoor": function(door) {
            // "orient the door" such that this door's x1 and y1 are in this room
            // do this by checking if x1,y1 are coordinates in this room object.
            if (! this.coords.get(door.x1, door.y1)) {
                var doorCopy = {'x1': door.x2, 'y1': door.y2, 'x2': door.x1, 'y2': door.y1};
            } else {
                var doorCopy = {'x1': door.x1, 'y1': door.y1, 'x2': door.x2, 'y2': door.y2};
            }
            var direction = '';
            if (x1 == x2) {
                if (y2 > y1) direction = 's';
                else direction = 'n';
            } else {
                if (x2 > x1) direction = 'e';
                else direction = 'w';
            }
            splitWall(x1, y1

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
            // TODO: make the window an object maybe?
            // also make it so that multiple windows can be added?
            this.windows.insert(x1, y1, {"x1": x1, "y1": y1, "x2": x2, "y2": y2});
        },
        "render": function(ctx) {
            var self = this;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            this.coords.forEach(function(coord) {
                for (var p in coord.walls) {
                    var wall = coord.walls[p];
                    ctx.beginPath();
                    ctx.moveTo(wall.x1, wall.y1);
                    ctx.lineTo(wall.x2, wall.y2);
                    ctx.stroke();
                    ctx.closePath();
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
