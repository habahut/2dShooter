import { Orientation } from '../enums/Orientation';

// breachable window: one the player or enemies can jump through
// looking through a window should cause the enemies on the other side to activate
// and coming looking for you
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
