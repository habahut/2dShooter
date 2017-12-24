import { Window } from "../interfaces/Window";
import { RenderableDebug } from '../interfaces/RenderableDebug';
import { Renderable } from '../interfaces/Renderable';
import { Orientation } from '../enums/Orientation';

export class WindowStandard implements Window, Renderable, RenderableDebug {
    x: number;
    y: number;

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    orientation: Orientation;

    constructor(x: number, y: number, room1x: number, room1y: number, room2x: number,
            room2y: number, length: number, orientation: Orientation) {
        this.x = x;
        this.y = y;
        this.room1x = room1x;
        this.room1y = room1y;
        this.room2x = room2x;
        this.room2y = room2y;
        this.length = length;
        this.orientation = orientation;
    }

    render() {
    }

    renderDebug() {
    }
}