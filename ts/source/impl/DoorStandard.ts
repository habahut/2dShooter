import { DoorState } from '../enums/DoorState';
import { RenderableDebug } from '../interfaces/RenderableDebug';
import { Renderable } from '../interfaces/Renderable';

export class DoorStandard implements Renderable, RenderableDebug {
    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;
    doorState: DoorState;

    constructor(room1x: number, room1y: number, room2x: number, room2y: number, length: number, doorState: DoorState) {
        this.room1x = room1x;
        this.room1y = room1y;
        this.room2x = room2x;
        this.room2y = room2y;
        this.doorState = doorState;
    }

    render() {
    }

    renderDebug() {
    }
}
