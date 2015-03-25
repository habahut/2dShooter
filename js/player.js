(function() {
    function Player(x, y, img, anim) {
        var player = function() {};
        player.prototype = new Sprite(x, y, img, anim);
        console.log('in const', player);

        var instance = new player();

        player.prototype.aim = aim;

        return instance;
    };

    function aim(mx, my) {
        if (this.anim) {
            var dx = (this.x - .5 * this.anim.iw) - mx,
                dy = (this.y - .5 * this.anim.ih) - my;
        } else {
            var dx = (this.x - .5 * this.img.width) - mx,
                dy = (this.y - .5 * this.img.height) - my;
        }
        this.rotation = Math.atan2(dy, dx) - Math.PI/2;
    }
    
    window.Player = Player;
})();
