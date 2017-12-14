import { DoorState } from '../enums/DoorState';
import { Orientation } from '../enums/Orientation';

export interface Door {
    x: number;
    y: number;

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    doorState: DoorState;
    orientation: Orientation;
}
