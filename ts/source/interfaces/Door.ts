import { DoorState } from '../enums/DoorState';
import { Orientation } from '../enums/Orientation';
import { Renderable } from "./Renderable";
import { RenderableMinimap } from "./RenderableMinimap";

export interface Door extends Renderable, RenderableMinimap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    doorState: DoorState;
    orientation: Orientation;

    // TODO: this should be part of an "equals" interface
    // assumption: no shared wall will have multiple doors
    equals(other: Door) : boolean;

    render() : void;
    renderMinimap(ctx: CanvasRenderingContext2D) : void;
}
