import { RoomType } from '../enums/RoomType';
import { Point } from '../util/Point';
import { XYMap } from '../util/XYMap';
import { Wall } from '../interfaces/Wall';
import { Orientation } from '../enums/Orientation';
import { WallType } from "../enums/WallType";
import { WallFactory } from "./WallFactory";
import { Room } from "../interfaces/Room";
import { RoomStandard } from "../impl/RoomStandard";

export class RoomFactory {
    private roomTileSize: number;
    private wallFactory: WallFactory;
    constructor(roomTileSize: number, wallFactory: WallFactory) {
        this.roomTileSize = roomTileSize;
        this.wallFactory = wallFactory;
    }

    buildRoom(points: Array<Point>, roomType: RoomType) : Room {
        //if (roomType == RoomType.STANDARD) {
            return this.buildStandardRoom(points);
        //}
    }

    buildStandardRoom(points: Array<Point>) : Room {
        if (points.length == 0) throw "Empty Points array passed to RoomFactory";

        let pointMap = new XYMap(points),
            walls = [];

        for (let point of points) {
            var x = point.x,
                y = point.y;
            // coordinates specify the dimensions of this room.
            // check each adjacent space. If it is not occupied by another coordinate,
            // then we should add the wall.
            if (! pointMap.get(x + 1, y)) {
                walls.push(this.wallFactory.buildWall(x + 1, y, Orientation.VERTICAL, WallType.STANDARD));
                //coord.walls.e = {"x1": xP1 * roomSize, "y1": y * roomSize,
                //"x2": xP1 * roomSize, "y2": yP1 * roomSize};
            }
            if (! pointMap.get(x - 1, y)) {
                walls.push(this.wallFactory.buildWall(x, y, Orientation.VERTICAL, WallType.STANDARD));
                    //coord.walls.w = {"x1": x * roomSize, "y1": y * roomSize,
                    //"x2": x * roomSize, "y2": yP1 * roomSize};
            }
            if (! pointMap.get(x, y + 1)) {
                walls.push(this.wallFactory.buildWall(x, y + 1, Orientation.HORIZONTAL, WallType.STANDARD));
                    //coord.walls.s = {"x1": x * roomSize, "y1": yP1 * roomSize,
                    //"x2": xP1 * roomSize, "y2": yP1 * roomSize};
            }
            if (! pointMap.get(x, y - 1)) {
                walls.push(this.wallFactory.buildWall(x, y, Orientation.HORIZONTAL, WallType.STANDARD));
                    //coord.walls.n = {"x1": x * roomSize, "y1": y * roomSize,
                    //"x2": xP1 * roomSize, "y2": y * roomSize};
            }
        }

        // just to get this to compile for now
        return new RoomStandard(-1, -1, walls);
    }
}
