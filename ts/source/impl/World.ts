import { XYMap } from "../util/XYMap";
import { Room } from "../interfaces/Room";
import { Renderable } from "../interfaces/Renderable";

export class World {
    rooms: Array<Room>;
    enemies: Array<any>; // TODO not ready yet.
    roomTileSize: number;

    // think this should take an XYMap of the rooms.
    constructor(roomTileSize: number, rooms: Array<Room>) {
        this.roomTileSize = roomTileSize;
        this.rooms = rooms;
    }

    /**
     * Returns all room objects that the renderable collides with
     */
        /*
    getRooms(renderable: Renderable) : Array<Room> {
        return undefined;
    }
    */

    /**
     * Get the room located at X and Y grid coordinate.
     */
    /*
    getRoom(x: number, y: number) : Room {
        return this.rooms.get(x, y);
    }
    */
}
