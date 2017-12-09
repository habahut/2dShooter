import { DoorType } from '../enums/DoorType';
import { DoorState } from "../enums/DoorState";
import { DoorStandard } from "../impl/DoorStandard";
import { Room } from "../interfaces/Room";
import { XYMap } from "../util/XYMap";
import { Point } from "../util/Point";


export class DoorFactory {
    public static MAX_STANDARD_DOOR_SIZE = .8;
    public static MIN_STANDARD_DOOR_SIZE = .4;

    private roomTileSize: number;

    constructor(roomTileSize: number) {
        this.roomTileSize = roomTileSize;
    }

    buildDoor(r1x: number, r1y: number, r2x: number, r2y: number, doorType: DoorType) {
        if (doorType == DoorType.STANDARD) {
            return this.buildStandardDoor(r1x, r1y, r2x, r2y);
        }
    }

    // Returns the points between the two rooms in an 2d Array: 
    // [ [pointInRoom1, pointInRoom2], [pointInRoom1, pointInRoom2], etc... ]
    // An empty array indicates there are no shared walls.
    //
    // Left as points instead of walls assuming this may be refactored to something more generic
    calculateEdgesBetweenRooms(room1: Room, room2: Room) : Array<Array<Point>> {
        let pointMap1: XYMap = room1.getPointMap(),
            pointMap2: XYMap = room2.getPointMap(),
            connections: Array<Array<Point>> = [];
        for (let point of pointMap1.getPoints()) {
            if (pointMap2.get(point.x + 1, point.y)) {
                connections.push([point, pointMap2.get(point.x + 1, point.y)]);
            }
            if (pointMap2.get(point.x - 1, point.y)) {
                connections.push([point, pointMap2.get(point.x - 1, point.y)]);
            }
            if (pointMap2.get(point.x, point.y + 1)) {
                connections.push([point, pointMap2.get(point.x, point.y + 1)]);
            }
            if (pointMap2.get(point.x, point.y - 1)) {
                connections.push([point, pointMap2.get(point.x, point.y - 1)]);
            }
        }

        return connections;
    }

// this should just take 2 Rooms
    buildStandardDoor(r1x: number, r1y: number, r2x: number, r2y: number) {
        // this might be the wrong range with this function that actually works.
        let doorLength = 1 - Math.random() * (DoorFactory.MAX_STANDARD_DOOR_SIZE - DoorFactory.MIN_STANDARD_DOOR_SIZE)
                + DoorFactory.MIN_STANDARD_DOOR_SIZE,
            x1, y1, x2, y2;

        if (r1x == r2x) {
            // vertical room
            if (r1y > r2y) {
                //position = 'n';
                //invPosition = 's';
                y1 = r1y * this.roomTileSize;
                y2 = r1y * this.roomTileSize;
            } else {
                //position = 's';
                //invPosition = 'n';
                y1 = (r1y + 1) * this.roomTileSize;
                y2 = (r1y + 1) * this.roomTileSize;
            }
            x1 = (r1x + length) * this.roomTileSize;
            x2 = (r1x + 1 - length) * this.roomTileSize;
        } else {
            // horizontal room
            if (r1x > r2x) {
                //position = 'w';
                //invPosition = 'e';
                x1 = r1x * this.roomTileSize;
                x2 = r1x * this.roomTileSize;
            } else {
            //position = 'e';
            //invPosition = 'w';
                x1 = (r1x + 1) * this.roomTileSize;
                x2 = (r1x + 1) * this.roomTileSize;
            }
            y1 = (r1y + length) * this.roomTileSize;
            y2 = (r1y + 1 - length) * this.roomTileSize;
        } 
        return new DoorStandard(x1, y1, x2, y2, doorLength, DoorState.CLOSED);
    }
}
