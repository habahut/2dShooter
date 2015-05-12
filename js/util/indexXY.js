indexXYCount = 0;
(function() {
    function IndexXY(type) {
        this.map = {};
        // certain use cases for this object can only have 1 element
        // at each index location. For example, there can only be one room
        // at coordinate 1,1. But, there can be multiple doors within 
        // the room at 1,1. The multiple argument determines whether there
        // can be multiple elements at an index location or not.
        this.multiple = (type == "multiple") ? true : false;
        this.id = indexXYCount++;
    }

    function throwMultipleError() {
        console.trace()
        throw "You cannot use forEach with multiple IndexXY";
    }

    IndexXY.prototype = {
        "insert": function(x, y, obj) {
            obj = obj || 1;
            if (typeof this.map[x] == 'undefined') {
                this.map[x] = {};
                if (this.multiple) this.map[x][y] = [obj];
                else this.map[x][y] = obj;
            } else {
                if (this.multiple) {
                    if (this.map[x][y]) this.map[x][y].push(obj);
                    else this.map[x][y] = [obj];
                }
                else this.map[x][y] = obj;
            }
        },
        "get": function(x, y) {
            if (this.multiple) throwMultipleError("You cannot use get with multiple IndexXY");
            if (typeof this.map[x] != "undefined") {
                if (this.map[x][y]) {
                    return this.map[x][y];
                }
            }
            return false;
        },
        "getMany": function(x, y) {
            if (! this.multiple) throwMultipleError("You cannot use getMany with non-multiple IndexXY");
            if (typeof this.map[x] != "undefined") {
                if (this.map[x][y]) {
                    return this.map[x][y];
                }
            }
            return false;
        },
        ///// TODO: this will delete all entries with index x,y.
        // should pass the object to be deleted here as well.
        "delete": function(x, y) {
            if (typeof this.map[x] != "undefined") {
                this.map[x][y] == undefined;
            }
        },
        "forEach": function(callback) {
            if (this.multiple) throwMultipleError("You cannot use forEach with multiple IndexXY");
            for(var x in this.map) {
                // these are strings because they are the keys in this object
                // but they represent numbers and so need to be cast to ints.
                for (var y in this.map[x]) {
                    callback(this.map[x][y], parseInt(x), parseInt(y), this.map);
                }
            }
        },
        "forEachMany": function(callback) {
            if (! this.multiple) throwMultipleError("You cannot use forEachMany with non-multiple IndexXY");
            for(var x in this.map) {
                // these are strings because they are the keys in this object
                // but they represent numbers and so need to be cast to ints.
                for (var y in this.map[x]) {
                    // since this is a multiple IndexXY, iterate over each element
                    // at each index.
                    //
                    //console.log('callback' , callback);
                    //console.log("--- ", this.map[x][y]);
                    //console.log("       ", this.map[x][y].forEach);
                    this.map[x][y].forEach(function(element) {
                        callback(element, parseInt(x), parseInt(y), this.map);
                    })
                }
            }
        }
    };

    window.IndexXY = IndexXY;
})();
