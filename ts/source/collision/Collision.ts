import { Collideable } from "./Collideable";

// Models a collision between two Collideables. When 3+ objects collide, individual collisions will be
// created for each.
export interface Collision {
    // need to figure out how this will work
    getAngle() : number;

    // speed of the collision (sum of both Collideables movement)
    getSpeed() : number;

    // Get all objects 
    getCollideables() : Collideable;

    // Set both sides of this collision as handled and remove it from the list of
    // pending collisions.
    setHandled() : void;
}
