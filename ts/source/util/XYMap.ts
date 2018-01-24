import { Point } from "./Point";

// This class takes an array of points, and provides convenience methods for
// querying that array.
export class XYMap {
    private pointMap: Map<number, Map<number, any> | undefined>;
    private points: Array<Point>;
    private empty: boolean;
    private immutable: boolean;

    // Repeated points will be ignored.
    // TODO: perhaps there should be a different version of this that throws an error if
    // points would be overwritten?
    constructor(inputPoints?: Array<Point>) {
        this.pointMap = new Map<number, Map<number, any>>();
        this.points = [];
        // Can create an XYMap with an already predefined set of points. If so,
        // the map is immutable. Can otherwise build up the map and set immutability once
        // finished building.
        if (! inputPoints) {
            this.empty = true;
            this.immutable = false;
            return;
        }

        if (inputPoints.length == 0) {
            this.empty = true
            return
        }
        this.empty = false;

        this.points = [];
        for (let point of inputPoints) {
            // skip duplicate points
            if (this.get(point.x, point.y) != undefined) {
                continue;
            }

            this.set(point.x, point.y, point.value);
        }
        this.immutable = true;
    }

    // returns the value at [x][y], or undefined if that coordinate is empty.
    // The internal map contains points, for easy modification when setting a new value for
    // an existing coordinate.
    get(x: number, y: number) : any | undefined {
        let tempMap: Map<number, any> | undefined = this.pointMap.get(x);
        if (tempMap == undefined) {
            return undefined;
        }
        if (tempMap.get(y) == undefined) {
            return undefined;
        }
        return tempMap.get(y).value;
    }

    getPoints() {
        return this.points;
    }

    isEmpty() : boolean {
        return this.empty;
    }

    // TODO: this should be overloaded so we aren't deconstructing the point above
    // and the rebuilding it here...
    set(x: number, y: number, value: any = undefined) : void {
        if (this.immutable) {
            let err = new Error();
            console.trace();
            throw "Trying to modify immutable map!";
        }

        if (value == undefined) value = true;

        let tempMap: Map<number, any> | undefined = this.pointMap.get(x),
            point: Point = new Point(x, y, value);
        if (tempMap != undefined) {
            // only add this point if it didn't exist already, otherwise update it.
            if (tempMap.get(y) == undefined) {
                this.points.push(point);
            } else {
                tempMap.get(y).value = value;
            }
            tempMap.set(y, point);
        } else { 
            let tempMap = new Map<number, any>();
            tempMap.set(y, point);
            this.pointMap.set(x, tempMap);

            this.points.push(new Point(x, y, value));
        }
    }

    values() : Array<any> {
        let values: Array<any> = [];
        for (let point of this.points) {
            values.push(point.value);
        }
        return values;
    }
}

