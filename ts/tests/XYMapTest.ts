import { Point } from '../source/util/Point';
import { XYMap } from '../source/util/XYMap';

import {} from "jasmine";
import { expect } from "chai";

describe ("XYMaps Tests", () => {
    it("should say this index has content", () => {
        let points: Array<Point> = [new Point(1,1),
                  new Point(1,2),
                  new Point(2,2)],
            xyMap = new XYMap(points);
        expect(xyMap.get(1,1)).to.not.equal(undefined);
        expect(xyMap.get(1,2)).to.not.equal(undefined);
        expect(xyMap.get(2,2)).to.not.equal(undefined);
    }),
    it("should say this index has no content", () => {
        let points: Array<Point> = [new Point(1,1),
                  new Point(1,2),
                  new Point(2,2)],
            xyMap = new XYMap(points);
        expect(xyMap.get(3,3)).to.equal(undefined);
        expect(xyMap.get(1,3)).to.equal(undefined);
        expect(xyMap.get(2,3)).to.equal(undefined);
    }),
    it("should handle duplicate points", () => {
        let points: Array<Point> = [new Point(1,1),
                  new Point(1,1),
                  new Point(1,2),
                  new Point(1,2)],
            xyMap = new XYMap(points);
        expect(xyMap.get(1,2)).to.not.equal(undefined);
        expect(xyMap.get(1,3)).to.equal(undefined);
        expect(xyMap.get(1,1)).to.not.equal(undefined);
    }),
    it("should be empty", () => {
        let points: Array<Point> = [],
            xyMap = new XYMap(points);
            expect(xyMap.isEmpty()).to.equal(true);
    }),
    it("should not be empty", () => {
        let points: Array<Point> = [new Point(1,1)],
            xyMap = new XYMap(points);
        expect(xyMap.isEmpty()).to.equal(false);
    }),
    it("should retrieve the object", () => {
        let points: Array<Point> = [new Point(1, 1, new Point(10, 10))],
            xyMap = new XYMap(points);
        expect(xyMap.get(1, 1).value.equals(new Point(10, 10))).to.equal(true);
    });
 
});
