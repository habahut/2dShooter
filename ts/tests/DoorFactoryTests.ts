import { RoomFactory } from "../source/factories/RoomFactory";
import { RoomType } from "../source/enums/RoomType";
import { Wall } from "../source/interfaces/Wall";
import { Point } from "../source/util/Point";
import { WallFactory } from "../source/factories/WallFactory";
import { Orientation } from "../source/enums/Orientation";
import { WallType } from "../source/enums/WallType";
import { DoorFactory } from "../source/factories/DoorFactory";

import {} from "jasmine";
import { expect } from "chai";

describe("DoorFactory Tests", () => {
    it("correct edge calculation between basic rooms", () => {
        let points1 = [new Point(5, 5)],
            points2 = [new Point(5, 6)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            room1 = roomFactory.buildRoom(points1, RoomType.STANDARD),
            room2 = roomFactory.buildRoom(points2, RoomType.STANDARD),
            doorFactory = new DoorFactory(100),
            edges = doorFactory.calculateEdgesBetweenRooms(room1, room2);
        expect(edges[0][0].equals(points1[0])).to.equal(true);
        expect(edges[0][1].equals(points2[0])).to.equal(true);
    });
        /*
        let points = [new Point(5, 5)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            room = roomFactory.buildRoom(points, RoomType.STANDARD);
            */
    //});
});
