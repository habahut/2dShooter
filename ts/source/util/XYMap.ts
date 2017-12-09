import { Point } from "./Point";

// This class takes an array of points, and provides convenience methods for
// querying that array.
export class XYMap {
    private pointMap: any;
    private points: Array<Point>;
    // I think this needs to be extended for world map, so it can index like this. Somehow...
    // some sort of interface and an indexer utils????
    constructor(points: Array<Point>) {
        this.points = points;
        this.pointMap = {};
        for (let point of points) {
            if (this.pointMap[point.x] === undefined) {
                let temp : any = {};
                temp[point.y] = point;
                this.pointMap[point.x] = temp;
            } else { 
                let obj = this.pointMap[point.x];
                obj[point.y]  = point;
            }
        }
    }
    // returns true if a point exists at [x][y], else false.
    get(x: number, y: number) {
        if (this.pointMap[x] === undefined) {
            return undefined;
        }
        return this.pointMap[x][y]
    }
    getPoints() {
        return this.points;
    }
}
