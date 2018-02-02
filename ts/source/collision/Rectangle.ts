import { Hitbox } from "./Hitbox";
import { HitboxType } from "./HitboxType";

// it would be cool to have each frame of the animation change the hitbox...
export class Rectangle implements Hitbox {

    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    getHitboxType() : HitboxType {
        return HitboxType.RECTANGLE;
    }
}
 
