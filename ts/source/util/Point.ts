// Convenience class for storing a value at its associated location.
export class Point {
    x: number;
    y: number;
    value: any;
    constructor(x: number, y: number, value?: any) {
        this.x = x;
        this.y = y;
        if (this.value === undefined) {
            this.value = true;
        } else {
            this.value = value;
        }
    }
    equals(other: Point) {
        return (this.x == other.x && this.y == other.y);
    }
}
