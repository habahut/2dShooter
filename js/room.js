(function() {
    function Room(coords, roomSize, sprites) {
        var self = this;
        this.sprites = sprites || [];
        this.walls = defineWalls(coords); 
        this.roomSize = roomSize;
    };

    function defineWalls(coords) {
        walls = [];
        for (var i = 0;i < coords.length;i++) {
            var thisRoom = coords[i],
                thisWalls = {"n": 1, "e": 1, "s": 1, "w": 1};
                
            for (var j = 0; j < coords.length; j++) {
                if (i == j) continue;
                var compareRoom = coords[j];
                if (thisRoom.x + 1 == compareRoom.x) thisWalls.e = 0;
                if (thisRoom.x - 1 == compareRoom.x) thisWalls.w = 0;
                if (thisRoom.y + 1 == compareRoom.y) thisWalls.s = 0;
                if (thisRoom.y - 1 == compareRoom.y) thisWalls.n = 0;
            }
            if (thisWalls.n) {
                walls.push({"x1": x * roomSize, "y1": y * roomSize, 
                            "x2": (x + 1) * roomSize, "y1": y * roomSize});
            }
            if (thisWalls.e) {
                walls.push({"x1": (x + 1) * roomSize, "y1": y * roomSize,
                            "x2": (x + 1) * roomSize, "y2": (y + 1) * roomSize});
            }
            if (thisWalls.s) {
                walls.push({"x1": x * roomSize, "y1": (y + 1) * roomSize, 
                            "x2": (x + 1) * roomSize, "y1": (y + 1) * roomSize});
            }
            if (thisWalls.w) {
                walls.push({"x1": x * roomSize, "y1": y * roomSize, 
                            "x2": x * roomSize, "y1": (y + 1) * roomSize});
            }
        }
        return walls;
    }

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
})();
