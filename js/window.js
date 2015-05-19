(function() {
    //// this and door can probably inherit from a parent class.
    // since they are doing the same thing basically.
    function WindowObj(r1x, r1y, r2x, r2y, roomSize) {
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
        if (r1x == r2x) {
            // vertical room
            if (r1y > r2y) { 
                self.position = 'n';
                self.invPosition = 's';
                self.y1 = r1y * roomSize;
                self.y2 = r1y * roomSize;
            } else {
                self.position = 's';
                self.invPosition = 'n';
                self.y1 = (r1y + 1) * roomSize;
                self.y2 = (r1y + 1) * roomSize;
            }
            self.x1 = (r1x + self.length) * roomSize;
            self.x2 = (r1x + 1 - self.length) * roomSize;
        } else {
            // horizontal room
            if (r1x > r2x) {
                self.position = 'w';
                self.invPosition = 'e';
                self.x1 = r1x * roomSize;
                self.x2 = r1x * roomSize;
            } else {
                self.position = 'e';
                self.invPosition = 'w';
                self.x1 = (r1x + 1) * roomSize;
                self.x2 = (r1x + 1) * roomSize;
            }
            self.y1 = (r1y + self.length) * roomSize;
            self.y2 = (r1y + 1 - self.length) * roomSize;
        }
    }

    window.WindowObj = WindowObj();
})();
