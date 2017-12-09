import { Renderable } from './Renderable';
import { Door } from './Door';
import { Wall } from './Wall';
import { Point } from "../util/Point";
import { XYMap } from "../util/XYMap";

export interface Room {
    // X and Y on the row grid, not absolute coordinates on the map
    pointMap: XYMap;

    // scaling of all rooms
    roomTileSize: number;

    doors: Array<Door>;
    getWalls(): Array<Wall>
    getPointMap(): XYMap;
}
