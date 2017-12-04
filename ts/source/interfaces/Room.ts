import { Renderable } from './Renderable';
import { Door } from './Door';
import { Wall } from './Wall';

export interface Room {
    // X and Y on the row grid
    // these will need to be an array or something since rooms can take up multiple
    // squares on the grid
    x: number;
    y: number;

    // scaling of all rooms
    roomTileSize: number;

    doors: Array<Door>;
    getWalls(): Array<Wall>
}
