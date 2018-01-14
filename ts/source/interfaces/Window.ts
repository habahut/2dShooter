import { Orientation } from '../enums/Orientation';
import { Renderable } from "./Renderable";
import { RenderableMinimap } from "./RenderableMinimap";

// breachable window: one the player or enemies can jump through
// looking through a window should cause the enemies on the other side to activate
// and coming looking for you
export interface Window extends Renderable, RenderableMinimap {
    x1: number;
    y1: number;
    x2: number;
    y2: number

    room1x: number;
    room1y: number;
    room2x: number;
    room2y: number;

    length: number;
    orientation: Orientation;

    render(): void;
    renderMinimap(ctx: CanvasRenderingContext2D) : void;
}
