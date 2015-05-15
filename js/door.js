(function() {
    MAX_DOOR_SIZE = .3;
    // TODO: this should be the player's widht + some padding
    MIN_DOOR_SIZE = .1
    function Door(r1x, r1y, r2x, r2y, roomSize) {
        var self = this;
        this.r1x = r1x;
        this.r1y = r1y;
        this.r2x = r2x;
        this.r2y = r2y;
        this.roomSize = roomSize;
        this.length = 1 - getRandomNR(MIN_DOOR_SIZE, MAX_DOOR_SIZE);
        this.hasModel = getRandom(0, 4);
        this.open = (this.hasModel) ? false : true;
        position(self);
    }

    function position(self) {
        var roomSize = self.roomSize,
            r1x = self.r1x,
            r1y = self.r1y,
            r2x = self.r2x,
            r2y = self.r2y;
        // position is always relative to r1
        console.log('determining a door');
        if (r1x == r2x) {
            // vertical room
            if (r1y > r2y) { 
                self.position = 's';
                self.y1 = (r1y + 1) * roomSize;
                self.y2 = (r1y + 1) * roomSize;
            } else {
                self.position = 'n';
                self.y1 = r1y * roomSize;
                self.y2 = r1y * roomSize;
            }
            self.x1 = (r1x + self.length) * roomSize;
            self.x2 = (r1x + 1 - self.length) * roomSize;
        } else {
            // horizontal room
            if (r1x > r2x) {
                self.position = 'w';
                self.x1 = r1x * roomSize;
                self.x2 = r1x * roomSize;
            } else {
                self.position = 'e';
                self.x1 = (r1x + 1) * roomSize;
                self.x2 = (r1x + 1) * roomSize;
            }
            self.y1 = (r1y + self.length) * roomSize;
            self.y2 = (r1y + 1 - self.length) * roomSize;
        }

        console.log('the door coords' , self);
    }

    window.Door = Door;
})()
