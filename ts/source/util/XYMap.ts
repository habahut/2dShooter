import { Point } from "./Point";

// This class takes an array of points, and provides convenience methods for
// querying that array.
export class XYMap {
    private pointMap: any;
    private points: Array<Point>;
    private empty: boolean;
    // I think this needs to be extended for world map, so it can index like this. Somehow...
    // some sort of interface and an indexer utils????

    // what should happen if there are multiple points in the Array<Point> with the same x and y?
    constructor(points: Array<Point>) {
        if (points.length == 0) {
            this.empty = true
            return
        }
        this.empty = false;
        this.points = points;
        this.pointMap = {};
        for (let point of points) {
            // determine what we will set at this point. If the point has the optional value
            // set than use that, otherwise default to true.
            let value = point.value;
            if (point.value === undefined) value = true;
            if (this.pointMap[point.x] === undefined) {
                let temp : any = {};
                temp[point.y] = point;
                this.pointMap[point.x] = temp;
            } else { 
                let obj = this.pointMap[point.x];
                obj[point.y] = point;
            }
        }
    }
    // returns the point at [x][y], or undefined if that coordinate is empty.
    get(x: number, y: number) {
        if (this.pointMap[x] === undefined) {
            return undefined;
        }
        return this.pointMap[x][y]
    }
    getPoints() {
        return this.points;
    }
    isEmpty() : boolean {
        return this.empty;
    }
}
