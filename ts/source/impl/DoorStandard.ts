import { DoorState } from '../enums/DoorState';
import { Door } from "../interfaces/Door";
import { RenderableDebug } from '../interfaces/RenderableDebug';
import { Renderable } from '../interfaces/Renderable';
import { Orientation } from '../enums/Orientation';

export class DoorStandard implements Door, Renderable, RenderableDebug {
    x: number;
    y: number;

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    doorState: DoorState;
    orientation: Orientation;

    constructor(x: number, y: number, room1x: number, room1y: number, room2x: number,
            room2y: number, length: number, doorState: DoorState, orientation: Orientation) {
        this.x = x;
        this.y = y;
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

    renderDebug() {
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
