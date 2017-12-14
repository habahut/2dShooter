import { RoomFactory } from "../source/factories/RoomFactory";
import { RoomType } from "../source/enums/RoomType";
import { DoorType } from "../source/enums/DoorType";
import { WindowType } from "../source/enums/WindowType";
import { Wall } from "../source/interfaces/Wall";
import { Door } from "../source/interfaces/Door";
import { Window } from "../source/interfaces/Window";
import { Point } from "../source/util/Point";
import { WallFactory } from "../source/factories/WallFactory";
import { Orientation } from "../source/enums/Orientation";
import { WallType } from "../source/enums/WallType";
import { WallObjectFactory } from "../source/factories/WallObjectFactory";
import { XYMap } from "../source/util/XYMap";

import {} from "jasmine";
import { expect } from "chai";

describe("WallObjectFactory Tests", () => {
    it("creates a horizontal door between 5,5 and 5,6", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory = new WallObjectFactory(100),
            door: Door = wallObjectFactory.buildDoor(5, 5, 5, 6, DoorType.STANDARD);
        expect(door.x > 500).to.equal(true);
        expect(door.x < 600).to.equal(true);
        expect(door.y == 600).to.equal(true);
        expect(door.orientation == Orientation.VERTICAL).to.equal(true);
    }),
    it("creates a horizontal door between 5,6 and 5,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory = new WallObjectFactory(100),
            door: Door = wallObjectFactory.buildDoor(5, 6, 5, 5, DoorType.STANDARD);
        expect(door.x > 500).to.equal(true);
        expect(door.x < 600).to.equal(true);
        expect(door.y == 600).to.equal(true);
        expect(door.orientation == Orientation.VERTICAL).to.equal(true);
    }),
    it("creates a vertical door between 5,5 and 6,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory = new WallObjectFactory(100),
            door: Door = wallObjectFactory.buildDoor(5, 5, 6, 5, DoorType.STANDARD);
        expect(door.y > 500).to.equal(true);
        expect(door.y < 600).to.equal(true);
        expect(door.x == 600).to.equal(true);
        expect(door.orientation == Orientation.HORIZONTAL).to.equal(true);
    }),
    it("creates a vertical door between 6,5 and 5,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory = new WallObjectFactory(100),
            door: Door = wallObjectFactory.buildDoor(6, 5, 5, 5, DoorType.STANDARD);
        expect(door.y > 500).to.equal(true);
        expect(door.y < 600).to.equal(true);
        expect(door.x == 600).to.equal(true);
        expect(door.orientation == Orientation.HORIZONTAL).to.equal(true);
    }),
    // window tests
    it("creates a vertical window between 5,5 and 6,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory = new WallObjectFactory(100),
            windowObj: Window = wallObjectFactory.buildWindow(5, 5, 6, 5, WindowType.STANDARD);
        expect(windowObj.y > 500).to.equal(true);
        expect(windowObj.y < 600).to.equal(true);
        expect(windowObj.x == 600).to.equal(true);
        expect(windowObj.orientation == Orientation.HORIZONTAL).to.equal(true);
    }),
    it("creates a vertical window between 6,5 and 5,5", () => {
        let wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            wallObjectFactory = new WallObjectFactory(100),
            windowObj: Window = wallObjectFactory.buildWindow(6, 5, 5, 5, WindowType.STANDARD);
        expect(windowObj.y > 500).to.equal(true);
        expect(windowObj.y < 600).to.equal(true);
        expect(windowObj.x == 600).to.equal(true);
        expect(windowObj.orientation == Orientation.HORIZONTAL).to.equal(true);
    });

});

