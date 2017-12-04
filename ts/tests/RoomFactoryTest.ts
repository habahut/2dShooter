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
    it("should build a room of type standard", () => {
        let points = [new Point(5, 5)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            room = roomFactory.buildRoom(points, RoomType.STANDARD);
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
    });
});

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

