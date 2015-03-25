(function() {
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function collideRects(camera, r2) {
        return !((r2.x - r2.hWidth) > (camera.x + camera.width) || 
            (r2.x + r2.hWidth) < camera.x || 
            (r2.y - r2.hHeight) > (camera.y + camera.height) ||
            (r2.y + r2.hHeight) < camera.y);

        /*
        if (r2.anim && r2.anim.cols == 4) {
            return b;
        
        }
            if (!b) console.log('@@@@');
            console.log('camera: x',camera.x, 'y', camera.y, ' w',  camera.x + camera.width, 'h', camera.y + camera.height);
            console.log('r2: x',r2.x, 'y', r2.y, ' w', r2.x + r2.width, 'h', r2.y + r2.height);
            console.log('-=-=--=-==-=-');
        return b;
        */
    }

    window.getRandom = getRandom;
    window.collideRects = collideRects;
})();
