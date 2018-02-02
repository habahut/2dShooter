import { Renderable } from './Renderable';
import { Door } from './Door';
import { Wall } from './Wall';
import { Point } from "../util/Point";
import { XYMap } from "../util/XYMap";
import { RenderableMinimap } from "./RenderableMinimap";
import { MinimapCamera } from "../vision/MinimapCamera";

export interface Room extends Renderable, RenderableMinimap {
    // X and Y on the row grid, not absolute coordinates on the map
    pointMap: XYMap;
    id: string;

    // scaling of all rooms
    roomTileSize: number;

    doors: Array<Door>;
    getWalls(): Array<Wall>

    getPointMap(): XYMap;
    equals(other: Room): boolean;

    render(): void;
    renderMinimap(minimapCamera: MinimapCamera) : void;

    addDoor(door: Door): void;
}
