import { Room } from '../interfaces/Room';
import { Renderable } from '../interfaces/Renderable';
import { RenderableMinimap } from '../interfaces/RenderableMinimap';
import { Door } from '../interfaces/Door';
import { Wall } from '../interfaces/Wall';
import { Point } from "../util/Point";
import { XYMap } from "../util/XYMap";

export class RoomStandard implements Room, Renderable, RenderableMinimap {
    roomTileSize: number;
    
    // TODO: how do doors get added here to the room? Does room factory need to know about them?
    // or should it generate them itself?
    doors: Array<Door>;
    walls: Array<Wall>;
    pointMap: XYMap;
    // TODO windows
    id: string;

    constructor(points: Array<Point>, walls: Array<Wall>, id: string) {
        this.walls = walls;
        this.pointMap = new XYMap(points);
        this.id = id;
        this.doors = [];
    }

    render() { }
    renderMinimap(ctx: CanvasRenderingContext2D) {
        for (let wall of this.walls) {
            wall.renderMinimap(ctx);
        }
        for (let door of this.doors) {
            door.renderMinimap(ctx);
        }
    }

    addDoor(door: Door) {
        this.doors.push(door);
    }

    getWalls() {
        return this.walls;
    }
    getPointMap() {
        return this.pointMap;
    }
    equals(other: Room) : boolean {
        return this.id == other.id;
    }
}

