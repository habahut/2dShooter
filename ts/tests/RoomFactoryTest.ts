import { RoomFactory } from "../source/factories/RoomFactory";
import { RoomType } from "../source/enums/RoomType";
import { Wall } from "../source/interfaces/Wall";
import { Point } from "../source/util/Point";
import { WallFactory } from "../source/factories/WallFactory";
import { Orientation } from "../source/enums/Orientation";
import { WallType } from "../source/enums/WallType";

import {} from "jasmine";
import { expect } from "chai";

describe ("RoomFactory Tests", () => {
    it("should build a room object with the given point", () => {
        let points = [new Point(5, 5)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            room = roomFactory.buildRoom(points, RoomType.STANDARD);
        debugger;
        expect(room.getPointMap().get(5, 5)).to.equal(true);
        expect(room.getPointMap().getPoints().length).to.equal(1);
    }),
    it("1 point room has all walls", () => {
        let points = [new Point(5, 5)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            expectedWalls = [wallFactory.buildWall(5, 5, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(5, 5, Orientation.HORIZONTAL, WallType.STANDARD),
                            wallFactory.buildWall(6, 5, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(5, 6, Orientation.HORIZONTAL, WallType.STANDARD)],
            room = roomFactory.buildRoom(points, RoomType.STANDARD);
        verifyWalls(room.getWalls(), expectedWalls);
    }),
    it("Should generate the correct walls for complex wall shape", () => {
        let points = [new Point(5, 5),
                     new Point(5, 6),
                     new Point(6, 6),
                     new Point(6, 6),
                     new Point(7, 5)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            expectedWalls = [wallFactory.buildWall(5, 5, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(5, 5, Orientation.HORIZONTAL, WallType.STANDARD),
                            wallFactory.buildWall(6, 5, Orientation.VERTICAL, WallType.STANDARD),

                            wallFactory.buildWall(5, 6, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(5, 7, Orientation.HORIZONTAL, WallType.STANDARD),

                            wallFactory.buildWall(6, 6, Orientation.HORIZONTAL, WallType.STANDARD),

                            wallFactory.buildWall(6, 7, Orientation.HORIZONTAL, WallType.STANDARD),
                            wallFactory.buildWall(6, 8, Orientation.HORIZONTAL, WallType.STANDARD),
                            wallFactory.buildWall(7, 7, Orientation.VERTICAL, WallType.STANDARD),
                
                            wallFactory.buildWall(7, 5, Orientation.HORIZONTAL, WallType.STANDARD),
                            wallFactory.buildWall(8, 5, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(7, 7, Orientation.HORIZONTAL, WallType.STANDARD)],
            room = roomFactory.buildRoom(points, RoomType.STANDARD);
        verifyWalls(room.getWalls(), expectedWalls);
    }),
    it("Should create the walls for a square room", () => {
        let points = [new Point(5, 5),
                     new Point(5, 6),
                     new Point(6, 5),
                     new Point(6, 6)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            expectedWalls = [wallFactory.buildWall(5, 5, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(5, 5, Orientation.HORIZONTAL, WallType.STANDARD),

                            wallFactory.buildWall(5, 6, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(5, 7, Orientation.HORIZONTAL, WallType.STANDARD),

                            wallFactory.buildWall(6, 5, Orientation.HORIZONTAL, WallType.STANDARD),
                            wallFactory.buildWall(7, 5, Orientation.VERTICAL, WallType.STANDARD),

                            wallFactory.buildWall(7, 6, Orientation.VERTICAL, WallType.STANDARD),
                            wallFactory.buildWall(6, 7, Orientation.HORIZONTAL, WallType.STANDARD)],
            room = roomFactory.buildRoom(points, RoomType.STANDARD);
        verifyWalls(room.getWalls(), expectedWalls);
    });
});

// confirms that all walls in "walls" are present in "expectedWalls"
function verifyWalls(walls: Array<Wall>, expectedWalls: Array<Wall>) {
    let found = false;
    for (let wall of walls) {
        for (let expectedWall of expectedWalls) {
            if (expectedWall.getX1() == wall.getX1()
                    && expectedWall.getY1() == wall.getY1()
                    && expectedWall.getX2() == wall.getX2()
                    && expectedWall.getY2() == wall.getY2()) {
                found = true;
                break;
            }
            if (found == false) return false;
        }
    }
    return true;
}

