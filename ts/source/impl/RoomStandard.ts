import { Room } from '../interfaces/Room';
import { Renderable } from '../interfaces/Renderable';
import { RenderableDebug } from '../interfaces/RenderableDebug';
import { Door } from '../interfaces/Door';
import { Wall } from '../interfaces/Wall';
import { Point } from "../util/Point";
import { XYMap } from "../util/XYMap";
import { Random } from "../util/Random";

export class RoomStandard implements Room, Renderable, RenderableDebug {
    roomTileSize: number;
    
    doors: Array<Door>;
    walls: Array<Wall>;
    pointMap: XYMap;
    // TODO windows

    id: string;

    constructor(points: Array<Point>, walls: Array<Wall> ) {
        this.walls = walls;
        this.pointMap = new XYMap(points);
        this.id = Random.createId();
    }

    render() { }
    renderDebug() { }

    getWalls() {
        return this.walls;
    }
    getPointMap() {
        return this.pointMap;
    }
    equals(other: Room) {
        return this.id == other.id;
    }
}
