import { Window } from "../interfaces/Window";
import { Renderable } from '../interfaces/Renderable';
import { Orientation } from '../enums/Orientation';
import { RenderableMinimap } from "../interfaces/RenderableMinimap";

export class WindowStandard implements Window, Renderable, RenderableMinimap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    orientation: Orientation;

    constructor(x1: number, y1: number, x2: number, y2: number, room1x: number, room1y: number, room2x: number,
            room2y: number, length: number, orientation: Orientation) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.room1x = room1x;
        this.room1y = room1y;
        this.room2x = room2x;
        this.room2y = room2y;
        this.length = length;
        this.orientation = orientation;
    }

    render() : void {
    }

    renderMinimap(ctx: CanvasRenderingContext2D) : void {
    }
}
