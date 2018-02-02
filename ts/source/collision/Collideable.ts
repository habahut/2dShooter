import { CollideShape } from "./CollideShape";
import { Hitbox } from "./Hitbox";
import { Collision } from "./Collision";

export interface Collideable {
    // The shapes that make up this objects hitbox.
    getHitboxes() : Array<Hitbox>;

    // The next position of the Hitboxes for this object after its movement
    // has been determined but before it is complete.
    getNextHitboxes() : Array<Hitbox>;

    // For objects to handle how they deal with collisions.
    setCollided(collision: Collision) : void;

}
