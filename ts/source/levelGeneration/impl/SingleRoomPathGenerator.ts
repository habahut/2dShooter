import { PathGenerator, RoomPath } from "../interfaces/PathGenerator";
import { RoomFactory } from "../../factories/RoomFactory";
import { WallObjectFactory } from "../../factories/WallObjectFactory";
import { Edge } from "../../util/Graph";
import { Point } from "../../util/Point";
import { RoomType } from "../../enums/RoomType";
import { DoorType } from "../../enums/DoorType";
import { Door } from "../../interfaces/Door";
import { Room } from "../../interfaces/Room";
import { XYMap } from "../../util/XYMap";

export class SingleRoomPathGenerator implements PathGenerator {

    roomFactory: RoomFactory;
    wallObjectFactory: WallObjectFactory;

    constructor(roomFactory: RoomFactory, wallObjectFactory: WallObjectFactory) {
        this.roomFactory = roomFactory;
        this.wallObjectFactory = wallObjectFactory;
    }

    roomWalk(edge: Edge) : RoomPath {
        let rooms: Array<Room> = [],
            doors: Array<Door> = [],
            doorMap: XYMap = new XYMap();

        let destinationX = edge.p2.x,
            destinationY = edge.p2.y,
            x = edge.p1.x,
            y = edge.p1.y,
            nextX = x,
            nextY = y;
        while (true) {
            rooms.push(this.roomFactory.buildRoom([new Point(x, y)], RoomType.STANDARD));
            if (x == destinationX && y == destinationY)  break;

            let dx = edge.p2.x - x,
                dy = edge.p2.y - y;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) nextX = x + 1;
                else nextX = x - 1;
            } else { 
                if (dy > 0) nextY = y + 1;
                else nextY = y - 1;
            }

            let door: Door = this.wallObjectFactory.buildDoor(x, y, nextX, nextY, DoorType.STANDARD);
            doors.push(door);
            // set the door in both locations of the map, since we want it to be accessable from
            // either coordinate.
            doorMap.set(x, y, door);
            doorMap.set(nextX, nextY, door);

            x = nextX;
            y = nextY;
        }

        return new RoomPath(rooms, doors);
    }

}
