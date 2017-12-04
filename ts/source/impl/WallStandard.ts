import { Orientation } from "../enums/Orientation";
import { Wall } from "../interfaces/Wall";
import { Renderable } from "../interfaces/Renderable";
import { RenderableDebug } from "../interfaces/RenderableDebug";
import { Door } from "../interfaces/Door";
import { WindowObj } from "../interfaces/WindowObj";

export class WallStandard implements Wall, Renderable, RenderableDebug {

    x1: number;
    y1: number;
    x2: number;
    y2: number;

    thickness: number;
    orientation: Orientation;
    doors: Array<Door>;
    windows: Array<WindowObj>;

    constructor(x1: number, y1: number, x2: number, y2: number, 
            thickness: number, orientation: Orientation) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.thickness = thickness;
        this.orientation = orientation;
    }

    render() { }
    renderDebug() { }

    getX1() {
        return this.x1;
    }
    getY1() {
        return this.y1;
    }
    getX2() {
        return this.x2;
    }
    getY2() {
        return this.y2;
    }
    getOrientation() {
        return this.orientation;
    }

}
