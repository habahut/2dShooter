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

    function collideRects(r1, r2) {
        return !((r2.x - r2.hWidth) > (r1.x + r1.width) || 
            (r2.x + r2.hWidth) < r1.x || 
            (r2.y - r2.hHeight) > (r1.y + r1.height) ||
            (r2.y + r2.hHeight) < r1.y);
    }

    function deepCopy(o) {
        return JSON.parse(JSON.stringify(o));
    }

    window.getRandom = getRandom;
    window.getRandomNR = getRandomNR;
    window.collideRects = collideRects;
    window.makeUnique = makeUnique;
    window.deepCopy = deepCopy;
})();
