(function() {
    /// not really sure if this is going to work correctly.
    //I remember reading that Math.round is not the right thing to use here
    //but ihave no internet to confirm righgt now
    //
    //// this seems to be 'inclusive' of both ends
    // given that everything starts indexing at 0 it may be better
    // afterall to make this exclusive of max...
    //      will need to change line 64 for of levelGeneration for example
    function getRandom(min, max) {
        return Math.floor((Math.random() * (max - min) + min) + .5);
    }

    function getRandomNR(min, max) {
        return Math.random() * (max - min) + min;
    }

    // this will not work unless you pass it sorted array
    function makeUnique(arr, key) {
        for (var i = arr.length - 2;i >= 0;i--) {
            if (key) {
                if (arr[i][key] == arr[i + 1][key]) {
                    arr.splice(i, 1);
                }
            } else {
                if (arr[i] == arr[i + 1]) {
                    arr.splice(i, 1);
                }
            }
        }
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
    window.getRandomNR = getRandomNR;
    window.collideRects = collideRects;
    window.makeUnique = makeUnique;
})();
