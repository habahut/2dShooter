import { RoomFactory } from "../../factories/RoomFactory";
import { WallObjectFactory } from "../../factories/WallObjectFactory";
import { Edge } from "../../util/Graph";
import { Room } from "../../interfaces/Room";
import { Door } from "../../interfaces/Door";

// does this return an array of points or does it build the room itself....
// if we merge a room we need to update all paths that contain that room...
// we have the path of doors so we can build up the AI map, and use that to plot out hte room
// path, so we don't need to do that here...
//

/**
 * Builds a path of rooms between the given edge, following its determined
 * behavior.
 *
 * Path generators don't take into account the size of the level, it is left to
 * the LevelGenerator to prune points off the map.
 */
export interface PathGenerator {
    roomFactory: RoomFactory;
    wallObjectFactory: WallObjectFactory;

    // Includes the origin and destination of the edge as rooms in the path.
    // {"rooms": Array<Room>, "doors": Array<Door>}
    roomWalk(edge: Edge) : RoomPath;
}

// might need to add a door map here?
// not sure. i had it in the original return value of pointWalk, but it may not be necessary
// with the new process
export class RoomPath {
    rooms: Array<Room>;
    firstDoor: Door;
    lastDoor: Door;
    doors: Array<Door>;
    constructor(rooms: Array<Room>, firstDoor: Door, lastDoor: Door) {
        this.rooms = rooms;
        this.firstDoor = firstDoor;
        this.lastDoor = lastDoor;
    }
}
