(function() {
    function Sprite(x, y, img, anim) {
        console.log('attempting to create a sprite');
        var self = this;
        this.counter = 0;
        this.dx = 0;
        this.dy = 0;
        this.x = x;
        this.y = y;
        this.img = img;
        this.dead = false;
        this.anim = anim;
        if (anim) {
            this.height = this.anim.ih;
            this.width = this.anim.iw;
        } else {
            this.height = this.img.height;
            this.width = this.img.width;
        }
        this.hHeight = this.height * .5;
        this.hWidth = this.width * .5;
        this.rotation = 0;
    };
    
    function Sprite_initAnim(totalDuration, tw, th, rows, cols, numFrames, isAnimating, cycles) {
        var iw = tw / cols,
            ih = th / rows,
            cycles = cycles || 1;
            numFrames = numFrames || rows * cols - 1,// start at 0
            frameDuration = totalDuration / numFrames;
        return {
            'isAnimating': isAnimating,
            'counter': 0,
            'fDuration': frameDuration,
            'frame': 0,
            'numFrames': numFrames,
            'iw': iw,
            'ih': ih,
            'rows': rows,
            'cols': cols,
            'x': 0,
            'y': 0,
            'cycles': cycles,
            'cycleCount': 0
        };
    }

    Sprite.prototype = {
        // any reason why this is not the same function as above?
        setAnim : function Sprite_setAnim(img, totalDuration, tw, th, rows, cols, numFrames, isAnimating, cycles) {
            console.log('wut');
            this.img = img;
            this.anim = Sprite_initAnim(totalDuration, tw, th, rows, cols, numFrames, isAnimating, cycles);
        },
        update : function(dt) {
            this.counter += dt;
            this.x += this.dx;
            this.y += this.dy;
            
            if (this.anim && this.anim.isAnimating) {
                var anim = this.anim;
                anim.counter += dt;
                if (anim.counter > anim.fDuration) {
                    anim.counter = 0;
                    anim.frame++;
                    if (anim.frame > anim.numFrames) {
                        anim.frame = 0;
                        if (anim.cycles != -1) {
                            anim.cycleCount++;
                            if (anim.cycleCount >= anim.cycles) this.dead = true;
                        }
                    }
                    anim.x = (anim.frame % anim.rows) * anim.iw;
                    anim.y = Math.floor(anim.frame / anim.cols) * anim.ih;
                }
            }
            return this.dead;
        },
    };

    window.Sprite = Sprite;
    window.Sprite_initAnim = Sprite_initAnim;
})();


/*
 *render: function(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            if (this.anim) {
                ctx.drawImage(this.img, this.anim.x, this.anim.y, 
                        this.anim.iw, this.anim.ih, -(.5 * this.anim.iw), -(.5 * this.anim.ih),
                        this.anim.iw, this.anim.ih);
                ctx.beginPath();
                ctx.moveTo(.5 * this.width, .5 * this.height);
                ctx.lineTo(.5 * this.width, .5 * this.height -50);
                ctx.stroke();
                ctx.closePath();
            } else {
                ctx.drawImage(this.img, -(.5 * this.img.width), -(.5 * this.img.height),
                    this.img.width, this.img.height);
            }
            ctx.restore();
        }
*/
