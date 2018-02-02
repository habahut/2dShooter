import { WindowObj } from "./WindowObj";
import { Door } from "./Door";
import { Orientation } from "../enums/Orientation";
import { Renderable } from "./Renderable";
import { RenderableMinimap } from "./RenderableMinimap";
import { MinimapCamera } from "../vision/MinimapCamera";

export interface Wall extends Renderable, RenderableMinimap {
    // Grid coordinate numbers
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    thickness: number;
    doors: Array<Door>;
    windows: Array<WindowObj>;
    orientation: Orientation;

    getX1(): number;
    getY1(): number;
    getX2(): number;
    getY2(): number;
    getOrientation(): Orientation;

    render(): void;
    renderMinimap(minimapCamera: MinimapCamera): void;
}
