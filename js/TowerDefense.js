CanvasWidth = 900;
CanvasHeight = 560;
ctx = '';
canvas = '';

function handleInput() {
    if (inputObj.isDown('w')) {
        player.y -= 3;
        //camera.y -= 3;
    }
    if (inputObj.isDown('a')) {
        player.x -= 3;
        //camera.x -= 3;
    }
    if (inputObj.isDown('s')) {
        player.y += 3;
        //camera.y += 3;
    }
    if (inputObj.isDown('d')) {
        player.x += 3;
        //camera.x += 3;
    }
    camera.follow(player);

    if (inputObj.isDown('l')) {
        generateMonster();
    }
};

function explosionFactory(x, y) {
    return new Sprite(x, y, resources.get('explosion_spritesheet'),
                        Sprite_initAnim(1, 320, 320, 5, 5, 3, 25));
};

function convertToExplosion(sprite) {
    sprite.setAnim(resources.get('explosion_spritesheet'), 
                        2, 320, 320, 5, 5, 25, true, 1);
};

function generateMonster() {
    //x = getRandom(0, CanvasWidth);
    //y = getRandom(0, CanvasHeight);

    var x = CanvasWidth - 100,
        y = CanvasHeight - 100;

    //x = 1;
    //y = 1;

    console.log('monster: ', x, y);
    res = resources.get('monster');
    entities.push(new Sprite(x, y, res));
}

function mouseClick(e) {
    var x = e.offsetX,
        y = e.offsetY;
    /// need some sort of 'get bounding box' function
    // which would be useful in other situations as well, such as rendering
    entities.forEach(function(sprite) {
        /*
        console.log('sprite', sprite);
        console.log('click: x', x, 'y', y);
        console.log('sprite x' , sprite.x - .5 * sprite.width, sprite.x + .5 * sprite.width);
        console.log('sprite y', sprite.y - .5 * sprite.height, sprite.y + .5 * sprite.height);
        console.log('-----');
        */
        if (sprite.x -.5 * sprite.width < x && x < sprite.x + .5 * sprite.width) {
            if (sprite.y - .5 * sprite.height < y && y < sprite.y + .5 * sprite.height) {
                console.log('here');
                convertToExplosion(sprite);
            }
        }
    });
}

function mouseMove(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    mx = e.clientX - canvasOffsetX;
    my = e.clientY - canvasOffsetY;
    player.aim(mx, my);
}

function main() {
    var now = Date.now(),
        dt = (now - lastTime) / 1000;
    lastTime = now;

    ctx.rect(0,0, CanvasWidth, CanvasHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    
    for (var i = entities.length -1; i >= 0; i--) {
        if (entities[i].update(dt)) entities.splice(i, 1);
        // this should have the indirection of calling Sprite.render(camera)
        // because not all objects will be just the 'image'. There may be other pieces.
        // would be good to have the flexibility of letting the sprite tell the camera how to render itself
        else camera.render(entities[i]);
    }

    cd += dt; 
    if (cd > 1.5) {
        cd = 0;
        //generateMonster();
    }
    handleInput();
    if (inputObj.isDown('space')) return;

    requestAnimationFrame(main);
}

function init() {
    var jCanvas = $("#mainCanvas");
    jCanvas.css('background-color', 'rgba(255, 255, 255, 0)');
    jCanvas.mousedown(mouseClick);
    jCanvas.mousemove(mouseMove);
    canvasOffsetX = jCanvas.offset().left;
    canvasOffsetY = jCanvas.offset().top;
    canvas = jCanvas.get(0);
    ctx = canvas.getContext('2d');
    //var gcanvas = $('#guiCanvas').get(0),
        //gctx = gcanvas.getContext('2d');
    canvas.height = CanvasHeight;
    canvas.width = CanvasWidth;
    //gcanvas.height = CanvasHeight;
    //gcanvas.width = CanvasWidth;

    ctx.rect(0,0, CanvasWidth, CanvasHeight);
    ctx.fillStyle = "white";
    ctx.fill();

    explosion = new Sprite(500, 100, resources.get('explosion_spritesheet'),
                        Sprite_initAnim(1, 320, 320, 5, 5, 3, 25));

    //this thing seems to be animating much more than 3 times.
    //entities.push(explosion);
    player = new Player(CanvasWidth / 2, CanvasHeight / 2, resources.get('player'),
                        Sprite_initAnim(2, 200, 200, 4, 4, false, true, -1));
    entities.push(player);

    console.log(' the player' , player);
    //totalDuration, tw, th, rows, cols, numFrames, isAnimating, cycles) {

    /*
    ctx.moveTo(275, 275);
    ctx.lineTo(275, 325);
    ctx.lineTo(325, 325);
    ctx.lineTo(325, 275);
    ctx.lineTo(275,275);
    ctx.stroke();
    ctx.closePath();
    */

    camera = new Camera(0, 0, ctx, CanvasWidth, CanvasHeight);

    console.log('fininshed:' ,player);
    console.log('test:', player instanceof Sprite);
    console.log('test:', player instanceof Player);

    generateMonster();

    main();
};

/// should turn this into a 'game object' so i can dynamically add to it
var lastTime = Date.now()
    entities = [],
    camera = '',
    inputObj = new Input(),
    player = '',
    canvasOffsetX = '',
    canvasOffsetY = '',
    cd = 0;
$(document).ready(function() {
    resources.onReady(init);
    resources.load([{'url': '../imgs/dude_sheet.jpg',
                     'key': 'player'},
                    {'url': '../imgs/monster.png',
                     'key': 'monster'},
                    {'url': '../imgs/explosion_spritesheet.png',
                     'key': 'explosion_spritesheet'}]);
});
