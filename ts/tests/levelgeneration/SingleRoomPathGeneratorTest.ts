import {} from "jasmine";
import { expect } from "chai";

import { WallFactory } from "../../source/factories/WallFactory";
import { SingleRoomPathGenerator } from "../../source/levelGeneration/impl/SingleRoomPathGenerator";
import { RoomFactory } from "../../source/factories/RoomFactory";
import { PointTestUtil } from "../util/PointTestUtil";
import { DoorType } from "../../source/enums/DoorType";
import { Door } from "../../source/interfaces/Door";
import { WallObjectFactory } from "../../source/factories/WallObjectFactory";
import { RoomScaledFactoryFactory } from "../../source/factories/RoomScaledFactoryFactory";
import { LevelGenerator } from "../../source/levelGeneration/LevelGenerator";
import { Point } from "../../source/util/Point";
import { EdgeCollection, Edge } from "../../source/util/Graph";
import { MersenneTwister } from "../../source/util/MersenneTwister";
import { PathTestUtil } from "./PathTestUtil";
import { Room } from "../../source/interfaces/Room";
import { RoomType } from "../../source/enums/RoomType";
import { RoomPath } from "../../source/levelGeneration/interfaces/PathGenerator";

describe ("SingleRoomPathGenerator Tests", () => {
    it("pointWalk case 1", () => {
        let edge: Edge = new Edge(new Point(0, 0), new Point(0, 1), 1),
            edgeCollection: EdgeCollection = new EdgeCollection(),
            expectedPoints: Array<Point> = [new Point(0, 0), new Point(0, 1)],
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            singleRoomPathGenerator: SingleRoomPathGenerator = new SingleRoomPathGenerator(roomFactory, doorFactory),

            doors: Array<Door> = [doorFactory.buildDoor(0, 0, 0, 1, DoorType.STANDARD)],
            expectedPath: RoomPath = new RoomPath(roomsFromPoints(expectedPoints, roomFactory), doors),
            path: RoomPath = singleRoomPathGenerator.roomWalk(edge);

        expect(PathTestUtil.verifyPath(path, expectedPath)).to.equal(true);
    }),
    it("pointWawlk Points case 2", () => {
        let edge: Edge = new Edge(new Point(0, 3), new Point(-2, 0), 3.6056),
            expectedPoints: Array<Point> = [new Point(0, 3), new Point(0, 2),
                                        new Point(0, 1), new Point(-1, 1),
                                        new Point(-1, 0), new Point(-2, 0)],
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            doors: Array<Door> = [
                doorFactory.buildDoor(0, 3, 0, 2, DoorType.STANDARD),
                doorFactory.buildDoor(0, 2, 0, 1, DoorType.STANDARD),
                doorFactory.buildDoor(0, 1, -1, 1, DoorType.STANDARD),
                doorFactory.buildDoor(-1, 1, -1, 0, DoorType.STANDARD),
                doorFactory.buildDoor(-1, 0, -2, 0, DoorType.STANDARD)
            ],
            
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            singleRoomPathGenerator: SingleRoomPathGenerator = new SingleRoomPathGenerator(roomFactory, doorFactory),
            expectedPath: RoomPath = new RoomPath(roomsFromPoints(expectedPoints, roomFactory), doors),
            path: RoomPath = singleRoomPathGenerator.roomWalk(edge);

        debugger;
        expect(PathTestUtil.verifyPath(path, expectedPath)).to.equal(true);
    });
});


function roomsFromPoints(points: Array<Point>, roomFactory: RoomFactory) : Array<Room> {
    let rooms: Array<Room> = [];
    for (let point of points) {
        rooms.push(roomFactory.buildRoom([point], RoomType.STANDARD));
    }
    return rooms;
}


// TODO: why are doors not added to the rooms being generated?

function verifyDoors(doors: Array<Door>, expectedDoors: Array<Door>) : boolean {
    if (doors.length != expectedDoors.length) return false;

    for (let door of doors) {
        let found: boolean = false;
        for (let expectedDoor of expectedDoors) {
            if (door.equals(expectedDoor)) {
                found = true;
                break;
            }
        }

        if (! found) return false;
    }

    return true;
}

