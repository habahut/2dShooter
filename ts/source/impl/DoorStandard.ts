import { DoorState } from '../enums/DoorState';
import { Door } from "../interfaces/Door";
import { Renderable } from '../interfaces/Renderable';
import { Orientation } from '../enums/Orientation';
import { RenderableMinimap } from "../interfaces/RenderableMinimap";

export class DoorStandard implements Door, Renderable, RenderableMinimap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    doorState: DoorState;
    orientation: Orientation;

    constructor(x1: number, y1: number, x2: number, y2: number, room1x: number, room1y: number, room2x: number,
            room2y: number, length: number, doorState: DoorState, orientation: Orientation) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.room1x = room1x;
        this.room1y = room1y;
        this.room2x = room2x;
        this.room2y = room2y;
        this.length = length;
        this.doorState = doorState;
        this.orientation = orientation;
    }

    render() {
    }

    renderMinimap(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.closePath();
    }

    equals(other: Door) : boolean {
        // check that this door matches in either direction
        return (this.room1x == other.room1x && this.room1y == other.room1y 
                    && this.room2x == other.room2x && this.room2y == other.room2y)
                ||
               (this.room1x == other.room2x && this.room1y == other.room2y 
                    && this.room2x == other.room1x && this.room2y == other.room1y);
    }
}
