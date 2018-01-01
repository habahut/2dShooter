import { PathGenerator, RoomPath } from "../interfaces/PathGenerator";
import { RoomFactory } from "../../factories/RoomFactory";
import { WallObjectFactory } from "../../factories/WallObjectFactory";
import { Edge } from "../../util/Graph";
import { Point } from "../../util/Point";
import { RoomType } from "../../enums/RoomType";
import { DoorType } from "../../enums/DoorType";
import { Door } from "../../interfaces/Door";

/**
 * Generates a hallway between points given in roomWalk(edge). Creates as straight as possible a
 * path, moving as long as possible in each direction until it reaches its destination.
 */
// TODO: need to differentiate this by name and allow for the zig zaggign hallway.
export class HallwayGenerator implements PathGenerator {

    // Maximum length of any straight portion of the hallways generated by this
    maxStraightLength: number;
    pathWidth: number;
    roomFactory: RoomFactory;
    wallObjectFactory: WallObjectFactory;

    constructor(maxStraightLength: number, pathWidth: number, roomFactory: RoomFactory, wallObjectFactory: WallObjectFactory) {
        this.maxStraightLength = maxStraightLength;
        this.pathWidth= pathWidth;
        this.roomFactory = roomFactory;
        this.wallObjectFactory = wallObjectFactory;
    }

    //////// does this thing merge new rooms if there is overlap?
    // or do we do that in level generator?
    // we need to return some grouping of points into rooms from this guy
    roomWalk(edge: Edge) : RoomPath {
        let destinationX = edge.p2.x,
            destinationY = edge.p2.y,
            x = edge.p1.x,
            y = edge.p1.y,
            nextX = x,
            nextY = y,
            points: Array<Point> = [],
            doors: Array<Door> = [],

        // build initial door
            dx = destinationX - x,
            dy = destinationY - y,
            mx = (dx < 0) ? -1 : 1,
            my = (dy < 0) ? -1 : 1;
        if (Math.abs(dx) > Math.abs(dy)) {
            doors.push(this.wallObjectFactory.buildDoor(x, y, x + mx, y, DoorType.STANDARD));
        } else {
            doors.push(this.wallObjectFactory.buildDoor(x, y, x, y + my, DoorType.STANDARD));
        }

        // special case: the rooms are adjacent, build only a door between them and return
        if (Math.abs(dx) + Math.abs(dy) == 1) {
            return new RoomPath([], doors);
        }


        // TODO: need to attach the door to all these rooms.

        while (true) {
            dx = destinationX - x;
            dy = destinationY - y;

            if (Math.abs(dx) > Math.abs(dy)) {
                mx = (dx < 0) ? -1 : 1;
                my = 0;
                for (let i = 0;i < Math.abs(dx) && i < this.maxStraightLength; i++) {
                    points = points.concat(this.expandPath(x, y, false, this.pathWidth));
                    x += mx;
                }
            } else {
                mx = 0;
                my = (dy < 0) ? -1 : 1;
                for (let i = 0;i < Math.abs(dy) && i < this.maxStraightLength; i++) {
                    points = points.concat(this.expandPath(x, y, true, this.pathWidth));
                    y += my;
                }
           }
            if (x == destinationX && y == destinationY) break;
        }

        // build last door, between the final room and the preceeding one.
        doors.push(this.wallObjectFactory.buildDoor(x - mx, y - my, x, y, DoorType.STANDARD));
        // add the last room
        points.push(new Point(x, y));
        return new RoomPath([this.roomFactory.buildRoom(points, RoomType.STANDARD)], doors);
    }

    expandPath(x: number, y: number, vertical: boolean, width: number) : Array<Point> {
        if (width <= 1) {
            return [new Point(x, y)];
        }

        let points: Array<Point> = [];
        if (vertical) {
            // expand along X axis for vertical paths
            let startX = x - Math.floor(width / 2);
            for (let i = 0;i < width;i++) {
                points.push(new Point(startX + i, y));
            }
        } else {
            // expand alond Y axis for Horizontal paths
            let startY = y - Math.floor(width / 2);
            for (let i = 0;i < width;i++) {
                points.push(new Point(x, startY + i));
            }
        }

        return points;
    }
}
