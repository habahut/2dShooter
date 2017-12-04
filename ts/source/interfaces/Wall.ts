import { WindowObj } from "./WindowObj";
import { Door } from "./Door";
import { Orientation } from "../enums/Orientation";

export interface Wall {
    // Grid coordinate numbers
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    thickness: number;
    doors: Array<Door>;
    windows: Array<WindowObj>;
    orientation: Orientation;

    getX1(): number;
    getY1(): number;
    getX2(): number;
    getY2(): number;
    getOrientation(): Orientation;
}
