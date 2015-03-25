(function() {
    var resourceCache = {},
        loading = [],
        readyCallbacks = [];

    function load(arr) {
        var total = arr.length,
            count = 0;
        for (var i = 0;i < arr.length;i++) {
            (function(obj) {
                var img = new Image();
                resourceCache[obj.key] = false;
                img.onload = function() {
                    resourceCache[obj.key] = img;
                    count++;
                    if(count == total) {
                        readyCallbacks.forEach(function(func) { 
                            func(); 
                        });
                        readyCallbacks = [];
                    }
                };
                img.src = obj.url;
            })(arr[i]);
        }
    }

    function get(key) {
        return resourceCache[key];
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
    };
})();
