import { Room } from '../interfaces/Room';
import { Renderable } from '../interfaces/Renderable';
import { RenderableDebug } from '../interfaces/RenderableDebug';
import { Door } from '../interfaces/Door';
import { Wall } from '../interfaces/Wall';

export class RoomStandard implements Room, Renderable, RenderableDebug {
    // values on the room grid
    x: number;
    y: number;

    roomTileSize: number;
    
    doors: Array<Door>;
    walls: Array<Wall>;
    // TODO windows

    constructor(x: number, y: number, walls: Array<Wall> ) {
        this.walls = walls;
    }

    render() { }
    renderDebug() { }

    getWalls() {
        return this.walls;
    }
}
