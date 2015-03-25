(function() {
    function Camera(x, y, ctx, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.width = canvasWidth;
        this.height = canvasHeight;
    };

    Camera.prototype = {
        render: function(sprite) {
            if (collideRects(this, sprite)) {
                // need to convert from absolute map coordinates stored in the object to screen coordinates
                var screenX = sprite.x - camera.x,
                    screenY = sprite.y - camera.y;

                this.ctx.save();
                this.ctx.translate(screenX, screenY);
                this.ctx.rotate(sprite.rotation);
                if (sprite.anim) {
                    this.ctx.drawImage(sprite.img, sprite.anim.x, sprite.anim.y, 
                        sprite.anim.iw, sprite.anim.ih, -(.5 * sprite.anim.iw), -(.5 * sprite.anim.ih),
                        sprite.anim.iw, sprite.anim.ih);
                    this.ctx.beginPath();
                    this.ctx.moveTo(.5 * sprite.width, .5 * sprite.height);
                    this.ctx.lineTo(.5 * sprite.width, .5 * sprite.height -50);
                    this.ctx.stroke();
                    this.ctx.closePath();
                } else {
                    //this.ctx.drawImage(sprite.img, -(.5 * sprite.img.width), -(.5 * sprite.img.height),
                        //sprite.img.width, sprite.img.height);

                    this.ctx.beginPath();
                    this.ctx.moveTo(-.5 * sprite.width, -.5 * sprite.height);
                    this.ctx.lineTo(.5 * sprite.width, -.5 * sprite.height);
                    this.ctx.lineTo(.5 * sprite.width, .5 * sprite.height);
                    this.ctx.lineTo(-.5 * sprite.width, .5 * sprite.height);
                    this.ctx.lineTo(-.5 * sprite.width, -.5 * sprite.height);
                    this.ctx.stroke();
                    this.ctx.closePath(); 
                }
                this.ctx.restore();
            }
        },
        follow: function(sprite) {
            this.x = sprite.x - (.5 * sprite.width);
            this.x -= .5 * this.width;
            this.y = sprite.y - (.5 * sprite.height);
            this.y -= .5 * this.height;
        }
    }

    window.Camera = Camera;
})();

/*
 * context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
 * img      Specifies the image, canvas, or video element to use     
 * sx       Optional. The x coordinate where to start clipping  
 * sy       Optional. The y coordinate where to start clipping 
 * swidth   Optional. The width of the clipped image    
 * sheight  Optional. The height of the clipped image  
 * x        The x coordinate where to place the image on the canvas 
 * y        The y coordinate where to place the image on the canvas
 * width    Optional. The width of the image to use (stretch or reduce the image)   
 * height   Optional. The height of the image to use (stretch or reduce the image)
 */


