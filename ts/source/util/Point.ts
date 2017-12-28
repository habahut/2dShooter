// Convenience class for storing a value at its associated location.
export class Point {
    x: number;
    y: number;
    value: any;
    constructor(x: number, y: number, value: any = undefined) {
        this.x = x;
        this.y = y;
        if (value === undefined) {
            this.value = true;
        } else {
            this.value = value;
        }
    }
    // Checks only the x and y value, not the value of the object.
    equals(other: Point) {
        return (this.x == other.x && this.y == other.y);
    }
    toString() {
        return this.x.toString() + "," + this.y.toString();
    }
    // TOOD: needs unit test
    // this should be an interface that all these things implement probably.
    equalsCoords(p2: Point) {
        return (this.x == p2.x && this.y == p2.y);
    }
}
