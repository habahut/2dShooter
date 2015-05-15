ROOM_ID = 0;
(function() {
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

    function splitWall(self, door, invert) {
        var inversions = {"n": "s", "s": "n",
                          "e": "w", "w": "e"};
        var roomX = 'x',
            roomY = 'y',
            truePosition = '';
        if (invert) {
            // this is the adjacent room, cut out the opposite wall
            var truePosition = inversions[door.position],
                roomX = door.r2x,
                roomY = door.r2y;
        }
        else {
            var truePosition = door.position,
                roomX = door.r1x,
                roomY = door.r1y;
        }
        console.log('');
        console.log('room ID', self.id);
        console.log('the roomX & roomY', roomX, roomY);
        console.log('all the walls', deepCopy(self.coords.get(roomX, roomY).walls));
        console.log('the position' , truePosition);
        var wall = self.coords.get(roomX, roomY).walls[truePosition];
        console.log('we are going to chop up ' , deepCopy(wall));
        wall1 = {"x1": wall.x1, "y1": wall.y1, "x2": door.x1, "y2": door.y1},
        wall2 = {"x1": door.x2, "y1": door.y2, "x2": wall.x2, "y2": wall.y2};
        console.log('it has become' , wall1);
        console.log('               ', wall2);
        console.log('');
        self.coords.get(roomX, roomY).walls[truePosition] = [wall1, wall2];
    }

    Room.prototype = {
        // When two rooms have a door between them, we don't want to add
        // 2 doors to the map. So instead we add the door to one room
        // and then 'cut out' the doors shape into the other.
        "addDoor": function(door) {
            splitWall(this, door, false);
            this.doors.insert(door.r1x, door.r1y, door);
        },
        "cutOutDoor": function(door) {
            // in this case, the door was added to the other room, so
            // we know the door is oriented around that room. So we need to reverse
            // the position variable, a.k.a. a door in the south wall for the other room
            // is a door through the north wall of this room.
            splitWall(this, door, true);
            this.doors.insert(door.r2x, door.r2y, door);
        },
        "hasDoorBetween": function(ox, oy, tx, ty) {
            var flag = false,
                doors = this.doors.getMany(ox, oy);
            if (doors) { 
                doors.forEach(function(door) {
                    // this isn't going to return true ever...
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
