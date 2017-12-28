import { MersenneTwister } from "../source/util/MersenneTwister";
import { EdgeCollection } from "../source/util/Graph";
import { Point } from "../source/util/Point";
import { LevelGenerator } from "../source/LevelGeneration/LevelGenerator";
import { RoomScaledFactoryFactory } from "../source/factories/RoomScaledFactoryFactory";
import { WallObjectFactory } from "../source/factories/WallObjectFactory";
import { Door } from "../source/interfaces/Door";
import { DoorType } from "../source/enums/DoorType";

import {} from "jasmine";
import { expect } from "chai";

describe ("LevelGenerator Tests", () => {
    it("pointWalk Points case 1", () => {
        let edgeCollection: EdgeCollection = new EdgeCollection(),
            expectedPoints: Array<Point> = [new Point(0, 0), new Point(0, 1)],
            roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, mersenneTwister);

        edgeCollection.addEdge(new Point(0, 0), new Point(0, 1), 1);
        expect(verifyPoints(levelGenerator.pointWalk(edgeCollection)["points"], expectedPoints)).to.equal(true);
    }),
    it("pointWawlk Points case 2", () => {
        let edgeCollection: EdgeCollection = new EdgeCollection(),
            expectedPoints: Array<Point> = [new Point(0, 3), new Point(0, 2),
                                        new Point(0, 1), new Point(-1, 1),
                                        new Point(-1, 0), new Point(-2, 0)],
            roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, mersenneTwister);

        edgeCollection.addEdge(new Point(0, 3), new Point(-2, 0), 3.6056);
        expect(verifyPoints(levelGenerator.pointWalk(edgeCollection)["points"], expectedPoints)).to.equal(true);
    }),
    it("pointWawlk Points case 3", () => {
        let edgeCollection: EdgeCollection = new EdgeCollection(),
            expectedPoints: Array<Point> = [new Point(0, 3), new Point(0, 2),
                                        new Point(0, 1), new Point(-1, 1),
                                        new Point(-1, 0), new Point(-2, 0),
                                        new Point(3, 3), new Point(3, 4),
                                        new Point(4, 4)],
            roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, mersenneTwister);

        edgeCollection.addEdge(new Point(0, 3), new Point(-2, 0), 3.6056);
        edgeCollection.addEdge(new Point(3, 3), new Point(4, 4), 1);
        expect(verifyPoints(levelGenerator.pointWalk(edgeCollection)["points"], expectedPoints)).to.equal(true);
    }),
    it("pointWalk doors case 1", () => {
        let edgeCollection: EdgeCollection = new EdgeCollection(),
            wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
            expectedDoors: Array<Door> = [wallObjectFactory.buildDoor(0, 3, 0, 2, DoorType.STANDARD),
                wallObjectFactory.buildDoor(0, 2, 0, 1, DoorType.STANDARD),
                wallObjectFactory.buildDoor(0, 1, -1, 1, DoorType.STANDARD),
                wallObjectFactory.buildDoor(-1, 1, -1, 0, DoorType.STANDARD),
                wallObjectFactory.buildDoor(-1, 0, -2, 0, DoorType.STANDARD),
                wallObjectFactory.buildDoor(3, 3, 3, 4, DoorType.STANDARD),
                wallObjectFactory.buildDoor(3, 4, 4, 4, DoorType.STANDARD)],
            roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            mersenneTwister: MersenneTwister = new MersenneTwister(),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, mersenneTwister);

        edgeCollection.addEdge(new Point(0, 3), new Point(-2, 0), 3.6056);
        edgeCollection.addEdge(new Point(3, 3), new Point(4, 4), 1);
        expect(verifyDoors(levelGenerator.pointWalk(edgeCollection)["doors"], expectedDoors)).to.equal(true);
    });

});

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

function verifyPoints(points: Array<Point>, expectedPoints: Array<Point>) : boolean {
    if (points.length != expectedPoints.length) return false;

    for (let point of points) {
        let found: boolean = false;
        for (let expectedPoint of expectedPoints) {
            if (point.equalsCoords(expectedPoint)) {
                found = true;
                break;
            }
        }

        if (! found) return false;
    }

    return true;
}

