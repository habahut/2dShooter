﻿import { DoorState } from '../enums/DoorState';
import { Orientation } from '../enums/Orientation';
import { Renderable } from "./Renderable";
import { RenderableMinimap } from "./RenderableMinimap";
import { MinimapCamera } from "../vision/MinimapCamera";

export interface Door extends Renderable, RenderableMinimap {
    // x & y pixel coordinates in the world.
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    // x & y coordinates of the rooms on the room grid.
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
    renderMinimap(minimapCamera: MinimapCamera) : void;
}
