import { Orientation } from '../enums/Orientation';

export interface Window {
    x: number;
    y: number;

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    orientation: Orientation;
}
