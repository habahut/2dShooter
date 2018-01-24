import {} from "jasmine";
import { expect } from "chai";

import { PathTestUtil } from "./PathTestUtil";
import { RoomPath } from "../../source/levelGeneration/interfaces/PathGenerator";
import { PointTestUtil } from "../util/PointTestUtil";
import { RoomTestUtil } from "../util/RoomTestUtil";
import { RoomType } from "../../source/enums/RoomType";
import { DoorType } from "../../source/enums/DoorType";
import { WallObjectFactory } from "../../source/factories/WallObjectFactory";
import { RoomFactory } from "../../source/factories/RoomFactory";
import { WallFactory } from "../../source/factories/WallFactory";
import { HallwayGenerator } from "../../source/levelGeneration/impl/HallwayGenerator";
import { Point } from "../../source/util/Point";
import { Edge } from "../../source/util/Graph";
import { Room } from "../../source/interfaces/Room";
import { Door } from "../../source/interfaces/Door";
import { XYMap } from "../../source/util/XYMap";

describe ("HallwayGeneratorTests", () => {
    it("Expand Path with width = 1", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            expectedPoints: Array<Point> = [new Point(0, 0)],
            forbiddenPoints = new XYMap();
        
        let points = hallwayGenerator.expandPath(0, 0, true, 1, forbiddenPoints);
        expect(PointTestUtil.verifyPoints(points, expectedPoints)).to.equal(true);

    }),
    it("expands correctly in the vertical, destination above", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 5, roomFactory, doorFactory),
            expectedPoints: Array<Point> = [new Point(-1, 0), new Point(0, 0), new Point(1, 0), new Point(2, 0)],
            forbiddenPoints = new XYMap([new Point(-2, 0)]);
        
        let points = hallwayGenerator.expandPath(0, 0, true, 5, forbiddenPoints);
        expect(PointTestUtil.verifyPoints(points, expectedPoints)).to.equal(true);
    }),
    it("expands correctly in the vertical, destination below", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 5, roomFactory, doorFactory),
            expectedPoints: Array<Point> = [new Point(-2, 0), new Point(-1, 0), new Point(0, 0), new Point(1, 0)],
            forbiddenPoints = new XYMap([new Point(2, 0)]);
        
        let points = hallwayGenerator.expandPath(0, 0, true, 5, forbiddenPoints);
        expect(PointTestUtil.verifyPoints(points, expectedPoints)).to.equal(true);
    }),
    it("expands correctly in the horizontal destination left", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 5, roomFactory, doorFactory),
            expectedPoints: Array<Point> = [new Point(0, -1), new Point(0, 0), new Point(0, 1), new Point(0, 2)],
            forbiddenPoints = new XYMap([new Point(0, -2)]);
        
        let points = hallwayGenerator.expandPath(0, 0, false, 5, forbiddenPoints);
        expect(PointTestUtil.verifyPoints(points, expectedPoints)).to.equal(true);
    }),
    it("expands correctly in the horizontal destination right", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 5, roomFactory, doorFactory),
            expectedPoints: Array<Point> = [new Point(0, -2), new Point(0, -1), new Point(0, 0), new Point(0, 1)],
            forbiddenPoints = new XYMap([new Point(0, 2)]);
     
        let points = hallwayGenerator.expandPath(0, 0, false, 5, forbiddenPoints);
        expect(PointTestUtil.verifyPoints(points, expectedPoints)).to.equal(true);
    });
    it("special case: adjacent rooms", () => {
        let edge: Edge = new Edge(new Point(0,0), new Point(0,1), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            expectedRoomPath: RoomPath = new RoomPath([], doorFactory.buildDoor(0, 0, 0, 1, DoorType.STANDARD),
                doorFactory.buildDoor(0, 0, 0, 1, DoorType.STANDARD));

        let roomPath: RoomPath = hallwayGenerator.roomWalk(edge);
        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    }),
    it("special case: gap of 1 between rooms", () => {
        let edge: Edge = new Edge(new Point(0,0), new Point(0,2), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            room: Room = roomFactory.buildRoom([new Point(0, 1)], RoomType.STANDARD),
            door1: Door = doorFactory.buildDoor(0, 0, 0, 1, DoorType.STANDARD),
            door2: Door = doorFactory.buildDoor(0, 1, 0, 2, DoorType.STANDARD),
            expectedRoomPath: RoomPath = new RoomPath([room], door1, door2);
        room.addDoor(door1);
        room.addDoor(door2);

        let roomPath: RoomPath = hallwayGenerator.roomWalk(edge);
        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    }),
    it("special case: gap of 1 between rooms (horizontal)", () => {
        let edge: Edge = new Edge(new Point(0,0), new Point(2,0), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            room: Room = roomFactory.buildRoom([new Point(1, 0)], RoomType.STANDARD),
            door1: Door = doorFactory.buildDoor(0, 0, 1, 0, DoorType.STANDARD),
            door2: Door = doorFactory.buildDoor(1, 0, 2, 0, DoorType.STANDARD),
            expectedRoomPath: RoomPath = new RoomPath([room], door1, door2);

        room.addDoor(door1);
        room.addDoor(door2);
        let roomPath: RoomPath = hallwayGenerator.roomWalk(edge);

        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    }),
    it("case 1", () => {
        let edge: Edge = new Edge(new Point(0,0), new Point(2, 1), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            room: Room = roomFactory.buildRoom([new Point(1, 0), new Point(1, 1)], RoomType.STANDARD),
            door1: Door = doorFactory.buildDoor(0, 0, 1, 0, DoorType.STANDARD), 
            door2: Door = doorFactory.buildDoor(1, 1, 2, 1, DoorType.STANDARD);

        room.addDoor(door1);
        room.addDoor(door2);
        let expectedRoomPath: RoomPath = new RoomPath([room], door1, door2),
            roomPath: RoomPath = hallwayGenerator.roomWalk(edge);
        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    }),
    it("case 1.5", () => {
        let edge: Edge = new Edge(new Point(0,0), new Point(2, 1), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 3, roomFactory, doorFactory),
            room: Room = roomFactory.buildRoom([new Point(1, 0), new Point(1, 1),
                new Point(2, 0), new Point(1, 2)], RoomType.STANDARD),
            door1: Door = doorFactory.buildDoor(0, 0, 1, 0, DoorType.STANDARD), 
            door2: Door = doorFactory.buildDoor(1, 1, 2, 1, DoorType.STANDARD);

        room.addDoor(door1);
        room.addDoor(door2);
        let expectedRoomPath: RoomPath = new RoomPath([room], door1, door2),
            roomPath: RoomPath = hallwayGenerator.roomWalk(edge);
        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    }),
    it("case 2", () => {
        let edge: Edge = new Edge(new Point(3, 3), new Point(-1, 1), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            room: Room = roomFactory.buildRoom([
                new Point(2, 3), new Point(1, 3), new Point(0, 3),
                    new Point(0, 2), new Point(0, 1),
                ], RoomType.STANDARD),
            door1: Door = doorFactory.buildDoor(3, 3, 2, 3, DoorType.STANDARD), 
            door2: Door = doorFactory.buildDoor(0, 1, -1 ,1, DoorType.STANDARD);

        room.addDoor(door1);
        room.addDoor(door2);
        let expectedRoomPath: RoomPath = new RoomPath([room], door1, door2),
            roomPath: RoomPath = hallwayGenerator.roomWalk(edge);

        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    }),
    it("case 3", () => {
        let edge: Edge = new Edge(new Point(3, 3), new Point(-3, 0), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            room: Room = roomFactory.buildRoom([
                    new Point(2, 3), new Point(1, 3), new Point(0, 3),
                    new Point(0, 2), new Point(0, 1), new Point(0, 0), new Point(-1, 0),
                    new Point(-2, 0)
                ], RoomType.STANDARD),
            door1: Door = doorFactory.buildDoor(3, 3, 2, 3, DoorType.STANDARD), 
            door2: Door = doorFactory.buildDoor(-2, 0, -3, 0, DoorType.STANDARD);

        room.addDoor(door1);
        room.addDoor(door2);
        let expectedRoomPath: RoomPath = new RoomPath([room], door1, door2),
            roomPath: RoomPath = hallwayGenerator.roomWalk(edge);

        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    });
});

