import { RoomFactory } from "../source/factories/RoomFactory";
import { RoomType } from "../source/enums/RoomType";
import { DoorType } from "../source/enums/DoorType";
import { Wall } from "../source/interfaces/Wall";
import { Door } from "../source/interfaces/Door";
import { Point } from "../source/util/Point";
import { WallFactory } from "../source/factories/WallFactory";
import { Orientation } from "../source/enums/Orientation";
import { WallType } from "../source/enums/WallType";
import { DoorFactory } from "../source/factories/DoorFactory";
import { XYMap } from "../source/util/XYMap";

import {} from "jasmine";
import { expect } from "chai";

describe("DoorFactory Tests", () => {
    it("creates a horizontal door between 5,5 and 5,6", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            doorFactory = new DoorFactory(100),
            door: Door = doorFactory.buildDoor(5, 5, 5, 6, DoorType.STANDARD);
        expect(door.x > 500).to.equal(true);
        expect(door.x < 600).to.equal(true);
        expect(door.y == 600).to.equal(true);
        expect(door.orientation == Orientation.VERTICAL).to.equal(true);
    }),
    it("creates a horizontal door between 5,6 and 5,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            doorFactory = new DoorFactory(100),
            door: Door = doorFactory.buildDoor(5, 6, 5, 5, DoorType.STANDARD);
        expect(door.x > 500).to.equal(true);
        expect(door.x < 600).to.equal(true);
        expect(door.y == 600).to.equal(true);
        expect(door.orientation == Orientation.VERTICAL).to.equal(true);
    }),
    it("creates a vertical door between 5,5 and 6,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            doorFactory = new DoorFactory(100),
            door: Door = doorFactory.buildDoor(5, 5, 6, 5, DoorType.STANDARD);
        expect(door.y > 500).to.equal(true);
        expect(door.y < 600).to.equal(true);
        expect(door.x == 600).to.equal(true);
        expect(door.orientation == Orientation.HORIZONTAL).to.equal(true);
    }),
    it("creates a vertical door between 6,5 and 5,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            doorFactory = new DoorFactory(100),
            door: Door = doorFactory.buildDoor(6, 5, 5, 5, DoorType.STANDARD);
        expect(door.y > 500).to.equal(true);
        expect(door.y < 600).to.equal(true);
        expect(door.x == 600).to.equal(true);
        expect(door.orientation == Orientation.HORIZONTAL).to.equal(true);
    });
});

