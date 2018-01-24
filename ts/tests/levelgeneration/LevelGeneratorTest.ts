import {} from "jasmine";
import { expect } from "chai";


import { RoomPath } from "../../source/levelGeneration/interfaces/PathGenerator";
import { PointTestUtil } from "../util/PointTestUtil";
import { RoomTestUtil } from "../util/RoomTestUtil";
import { RoomType } from "../../source/enums/RoomType";
import { DoorType } from "../../source/enums/DoorType";
import { RoomScaledFactoryFactory } from "../../source/factories/RoomScaledFactoryFactory";
import { RoomFactory } from "../../source/factories/RoomFactory";
import { WallFactory } from "../../source/factories/WallFactory";
import { HallwayGenerator } from "../../source/levelGeneration/impl/HallwayGenerator";
import { Point } from "../../source/util/Point";
import { Edge } from "../../source/util/Graph";
import { MersenneTwister } from "../../source/util/MersenneTwister";
import { LevelGenerator } from "../../source/levelGeneration/LevelGenerator";
import { WallObjectFactory } from "../../source/factories/WallObjectFactory";
import { Door } from "../../source/interfaces/Door";
import { Room } from "../../source/interfaces/Room";
import { XYMap } from "../../source/util/XYMap";

describe ("LevelGeneratorTests", () => {
    it("mergeOverlappingRooms case 1", () => {
        let roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, mersenneTwister),
            roomFactory: RoomFactory = roomScaledFactoryFactory.getRoomFactory(),
            room1: Room = roomFactory.buildRoom([new Point(0, 0), new Point(0, 1)], RoomType.STANDARD),
            room2: Room = roomFactory.buildRoom([new Point(0, 0), new Point(-1, 0)], RoomType.STANDARD),
            room3: Room = roomFactory.buildRoom([new Point(0, 1), new Point(0, 2)], RoomType.STANDARD),
            doorFactory: WallObjectFactory = roomScaledFactoryFactory.getWallObjectFactory(),
            keepDoor: Door = doorFactory.buildDoor(0, 0, 1, 0, DoorType.STANDARD),
            keepDoor2: Door = doorFactory.buildDoor(-1, 0, -2, 0, DoorType.STANDARD),
            keepDoor3: Door = doorFactory.buildDoor(0, 2, 0, 3, DoorType.STANDARD),
            removeDoor: Door = doorFactory.buildDoor(0, 0, -1, 0, DoorType.STANDARD);

        room1.addDoor(keepDoor);
        room1.addDoor(removeDoor);
        room2.addDoor(removeDoor);
        room2.addDoor(keepDoor2);
        room3.addDoor(keepDoor3);

        let mergedRooms: Array<Room> = levelGenerator.mergeOverlappingRooms([room1, room2, room3]),
            expectedRoom = roomFactory.buildRoom([new Point(0, 0), new Point(0, 1),
                new Point(-1, 0), new Point(0, 2)], RoomType.STANDARD);
        expectedRoom.addDoor(keepDoor);
        expectedRoom.addDoor(keepDoor2);
        expectedRoom.addDoor(keepDoor3);

        expect(RoomTestUtil.compareRooms(mergedRooms[0], expectedRoom)).to.equal(true);
    }),
    it("finds that all 3 rooms overlap", () => {
        let roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, mersenneTwister),
            roomFactory: RoomFactory = roomScaledFactoryFactory.getRoomFactory(),
            room1: Room = roomFactory.buildRoom([new Point(0, 0), new Point(0, 1), new Point(1, 0)], RoomType.STANDARD),
            room2: Room = roomFactory.buildRoom([new Point(1, 1), new Point(1, 2), new Point(1, 3)], RoomType.STANDARD),
            room3: Room = roomFactory.buildRoom([new Point(0, 0), new Point(4, 5), new Point(1, 3)], RoomType.STANDARD),
            pointMap: XYMap = new XYMap();

        levelGenerator.insertRoom(room1, pointMap);
        levelGenerator.insertRoom(room2, pointMap);

        let overlappingRooms: Array<Room> = levelGenerator.findOverlappingRooms(room3, pointMap);

        expect(overlappingRooms.length).to.equal(3);
    }),
    it("Collect Rooms returns the expected set of rooms, case 1", () => {
        let roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, mersenneTwister),
            wallObjectFactory: WallObjectFactory = roomScaledFactoryFactory.getWallObjectFactory(),
            door: Door = wallObjectFactory.buildDoor(0, 0, 0, 1, DoorType.STANDARD),
            roomFactory: RoomFactory = roomScaledFactoryFactory.getRoomFactory(),

            mergedRoomPoints: Array<Point> = [new Point(0, 0), new Point(0, 0), new Point(-1, 0), new Point(-1, 1)],
            mergedRoom2Points: Array<Point> = [new Point(-2, 5), new Point(-2, 5), new Point(-3, 5)],

            roomToBeMerged1 = roomFactory.buildRoom([mergedRoomPoints[0]], RoomType.STANDARD),
            roomToBeMerged2 = roomFactory.buildRoom([mergedRoomPoints[1], mergedRoomPoints[2], mergedRoomPoints[3]], RoomType.STANDARD),
            roomToBeMerged3 = roomFactory.buildRoom([mergedRoom2Points[0]], RoomType.STANDARD),
            roomToBeMerged4 = roomFactory.buildRoom([mergedRoom2Points[1], mergedRoom2Points[2]], RoomType.STANDARD),

            roomUnMerged1 = roomFactory.buildRoom([new Point(1, 0), new Point(1, 0), new Point(2, 0), new Point(2, 1)], RoomType.STANDARD),
            roomUnMerged2 = roomFactory.buildRoom([new Point(2, -1), new Point(2, -2), new Point(2, -3), new Point(2, -4)], RoomType.STANDARD),
            roomUnMerged3 = roomFactory.buildRoom([new Point(10, 10)], RoomType.STANDARD),

            expectedRoom1 = roomFactory.buildRoom(mergedRoomPoints, RoomType.STANDARD),
            expectedRoom2 = roomFactory.buildRoom(mergedRoom2Points, RoomType.STANDARD),

            roomPath1: RoomPath = new RoomPath([roomToBeMerged1, roomToBeMerged2, roomUnMerged1], door, door),
            roomPath2: RoomPath = new RoomPath([roomToBeMerged3, roomToBeMerged4, roomUnMerged2], door, door),

            expectedRooms: Array<Room> = [roomUnMerged1, roomUnMerged2, roomUnMerged3, expectedRoom1, expectedRoom2];

        debugger;
        let collectedRooms = levelGenerator.collectRooms([roomPath1, roomPath2], [roomUnMerged3]);
        debugger;
        expect(RoomTestUtil.verifyArrayOfRooms(expectedRooms, collectedRooms)).to.equal(true);
    });
});
