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

describe ("HallwayGeneratorTests", () => {
    it("expands correctly in the vertical", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 3, roomFactory, doorFactory),
            expectedPoints: Array<Point> = [new Point(-1, 0), new Point(0, 0), new Point(1, 0)];
        
        let points = hallwayGenerator.expandPath(0, 0, true, 3);
        expect(PointTestUtil.verifyPoints(points, expectedPoints)).to.equal(true);
    }),
    it("expands correctly in the horizontal", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 4, roomFactory, doorFactory),
            expectedPoints: Array<Point> = [new Point(0, -2), new Point(0, -1),
                new Point(0, 0), new Point(0, 1)];
        
        let points = hallwayGenerator.expandPath(0, 0, false, 4);
        expect(PointTestUtil.verifyPoints(points, expectedPoints)).to.equal(true);
    }),
    it("special case: adjacent rooms", () => {
        let edge: Edge = new Edge(new Point(0,0), new Point(0,1), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            roomPath: RoomPath = hallwayGenerator.roomWalk(edge),
            expectedRoomPath: RoomPath = new RoomPath([], [doorFactory.buildDoor(0, 0, 0, 1, DoorType.STANDARD)]);
        expect(PathTestUtil.verifyPath(roomPath, expectedRoomPath)).to.equal(true);
    }),
    it("case 1", () => {
        let edge: Edge = new Edge(new Point(0,0), new Point(2, 1), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            expectedRoomPath: RoomPath = new RoomPath(
                [roomFactory.buildRoom([
                    new Point(0,0), new Point(1, 0), new Point(2, 0), new Point(2, 1)
                ], RoomType.STANDARD)],
                [
                    doorFactory.buildDoor(0, 0, 1, 0, DoorType.STANDARD), 
                    doorFactory.buildDoor(2, 0, 2, 1, DoorType.STANDARD)
                ]
            );
        expect(PathTestUtil.verifyPath(hallwayGenerator.roomWalk(edge), expectedRoomPath)).to.equal(true);
    }),
    it("case 2", () => {
        let edge: Edge = new Edge(new Point(3, 3), new Point(-1, 1), 1),
            wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            doorFactory: WallObjectFactory = new WallObjectFactory(100),
            hallwayGenerator: HallwayGenerator = new HallwayGenerator(3, 1, roomFactory, doorFactory),
            expectedRoomPath: RoomPath = new RoomPath(
                [roomFactory.buildRoom([
                    new Point(3,3), new Point(2, 3), new Point(1, 3), new Point(0, 3),
                    new Point(0,2), new Point(0, 1), new Point(-1, 1)
                ], RoomType.STANDARD)],
                [
                    doorFactory.buildDoor(3, 3, 2, 3, DoorType.STANDARD), 
                    doorFactory.buildDoor(0, 1, -1, 1, DoorType.STANDARD)
                ]
  
            );
        expect(PathTestUtil.verifyPath(hallwayGenerator.roomWalk(edge), expectedRoomPath)).to.equal(true);
    });
});

