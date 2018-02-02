import { MinimapCamera } from "../vision/MinimapCamera";

export interface RenderableMinimap {
    renderMinimap(minimapCamera: MinimapCamera) : void;
}
