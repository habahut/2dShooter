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
import { BlobPathGenerator, PointsAndLastPoint } from "../../source/levelGeneration/impl/BlobPathGenerator";
import { Point } from "../../source/util/Point";
import { Edge } from "../../source/util/Graph";
import { MersenneTwister } from "../../source/util/MersenneTwister";
import { XYMap } from "../../source/util/XYMap";
import { Orientation } from "../../source/enums/Orientation";
import { Room } from "../../source/interfaces/Room";

describe ("BlobGeneratorTests", () => {
    it("vertical blob test top", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            xyMap: XYMap = new XYMap();
        xyMap.set(0, 1);

        // it shouldn't expand upwards
        let pointsAndLastPoint: PointsAndLastPoint = blobPathGenerator.verticalBlobify(0, 0, 6, xyMap, mersenneTwister);
        expect(pointNotPresent(pointsAndLastPoint, new Point(0, 1))).to.equal(true);
    }),
    it("vertical blob test bottom", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            xyMap: XYMap = new XYMap();
        xyMap.set(0, -1);


        // it shouldn't expand down
        let pointsAndLastPoint: PointsAndLastPoint = blobPathGenerator.verticalBlobify(0, 0, 6, xyMap,mersenneTwister);
        expect(pointNotPresent(pointsAndLastPoint, new Point(0, -1))).to.equal(true);
    }),
    it("horizontal blob test left", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            xyMap: XYMap = new XYMap();
        xyMap.set(-1, 0);


        // it shouldn't expand left
        let pointsAndLastPoint: PointsAndLastPoint = blobPathGenerator.horizontalBlobify(0, 0, 6, xyMap, mersenneTwister);
        expect(pointNotPresent(pointsAndLastPoint, new Point(-1, 0))).to.equal(true);
    }),
    it("horizontal blob test right", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            xyMap: XYMap = new XYMap();
        xyMap.set(1, 0);


        // it shouldn't expand left
        let pointsAndLastPoint: PointsAndLastPoint = blobPathGenerator.horizontalBlobify(0, 0, 6, xyMap, mersenneTwister);
        expect(pointNotPresent(pointsAndLastPoint, new Point(1, 0))).to.equal(true);
    }),
    it("blobWalkAxis x axis", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            xyMap: XYMap = new XYMap();
        xyMap.set(1, 1);

        let pointsAndLastPoint: PointsAndLastPoint = blobPathGenerator.blobWalkAxis(0, 0, Orientation.HORIZONTAL, 1, 3, 3, xyMap, mersenneTwister);
        expect(pointsAndLastPoint.lastOnAxisPoint.equals(new Point(3, 0))).to.equal(true); 
        expect(pointNotPresent(pointsAndLastPoint, new Point(1, 1))).to.equal(true);
    }),
    it("blobWalkAxis y axis", () => {
        let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            xyMap: XYMap = new XYMap();
        xyMap.set(1, 1);

        let pointsAndLastPoint: PointsAndLastPoint = blobPathGenerator.blobWalkAxis(0, 0, Orientation.VERTICAL, 1, 3, 3, xyMap, mersenneTwister);
        expect(pointsAndLastPoint.lastOnAxisPoint.equals(new Point(0, 3))).to.equal(true); 
        expect(pointNotPresent(pointsAndLastPoint, new Point(1, 1))).to.equal(true);
    }),
    it("Blob Path Generation case 1", () => {
         let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            edge: Edge = new Edge(new Point(0, 0), new Point(0, 3), 3);

        let roomPath: RoomPath = blobPathGenerator.roomWalk(edge),
            expectedRoom: Room = roomFactory.buildRoom([new Point(0, 1), new Point(0, 2)], RoomType.STANDARD);

        expect(RoomTestUtil.verifyRoomContains(expectedRoom, roomPath.rooms[0])).to.equal(true);
    });
    it("blob path generation case 2", () => {
         let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            edge: Edge = new Edge(new Point(0, 0), new Point(0, 5), 3);

        let roomPath: RoomPath = blobPathGenerator.roomWalk(edge),
            expectedRoom1: Room = roomFactory.buildRoom([new Point(0, 1), new Point(0, 2), new Point(0, 3), new Point(0, 4)], RoomType.STANDARD);

        expect(RoomTestUtil.verifyRoomContains(expectedRoom1, roomPath.rooms[0])).to.equal(true);
    }),
    it("blob path generation case 3", () => {
         let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            edge: Edge = new Edge(new Point(0, 0), new Point(3, 3), 3);

        let roomPath: RoomPath = blobPathGenerator.roomWalk(edge),
            expectedRoom1: Room = roomFactory.buildRoom([new Point(0, 1), new Point(1, 1), new Point(2, 1)], RoomType.STANDARD),
            expectedRoom2: Room = roomFactory.buildRoom([new Point(3, 1), new Point(3, 2)], RoomType.STANDARD);

        expect(RoomTestUtil.verifyRoomContains(expectedRoom1, roomPath.rooms[0])).to.equal(true);
        expect(RoomTestUtil.verifyRoomContains(expectedRoom2, roomPath.rooms[1])).to.equal(true);
    });
        /*
    it("blob path generation case 4", () => {
         let wallFactory: WallFactory = new WallFactory(100),
            roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(2521345),
            blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
            edge: Edge = new Edge(new Point(4, 4), new Point(0, 0), 3);

        let roomPath: RoomPath = blobPathGenerator.roomWalk(edge),
            expectedRoom1: Room = roomFactory.buildRoom([new Point(0, 1), new Point(1, 1), new Point(2, 1)], RoomType.STANDARD),
            expectedRoom2: Room = roomFactory.buildRoom([new Point(3, 1), new Point(3, 2)], RoomType.STANDARD);

        debugger;

        expect(RoomTestUtil.verifyRoomContains(expectedRoom1, roomPath.rooms[0])).to.equal(true);
        expect(RoomTestUtil.verifyRoomContains(expectedRoom2, roomPath.rooms[1])).to.equal(true);
    });
    */

    // TODO: 
    // we just need a few more complicated test cases here to finish this off.
});

function pointNotPresent(pointsAndLastPoint: PointsAndLastPoint, point: Point) {
    for (let p of pointsAndLastPoint.points) {
        if (point.equals(p)) {
            return false;
        }
    }
    return true;
}
