import {} from "jasmine";
import { expect } from "chai";

import { WallFactory } from "../source/factories/WallFactory";
import { Orientation } from "../source/enums/Orientation";
import { WallType } from "../source/enums/WallType";
import { Wall } from "../source/interfaces/Wall"

describe ("WallFactory Tests", () => {
    it("should create a vertical wall", () => {
        let wallFactory = new WallFactory(100),
            wall: Wall = wallFactory.buildWall(1,1, Orientation.VERTICAL, WallType.STANDARD);
        expect(wall.getX1()).to.equal(100);
        expect(wall.getY1()).to.equal(100);
        expect(wall.getX2()).to.equal(100);
        expect(wall.getY2()).to.equal(200);
    }),
    it("should create a horizontal wall", () => {
        let wallFactory = new WallFactory(100),
            wall = wallFactory.buildWall(1,1, Orientation.HORIZONTAL, WallType.STANDARD);
        expect(wall.getX1()).to.equal(100);
        expect(wall.getY1()).to.equal(100);
        expect(wall.getX2()).to.equal(200);
        expect(wall.getY2()).to.equal(100);
    });
});
