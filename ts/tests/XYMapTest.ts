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
    it("should handle and remove uplicate points", () => {
        let points: Array<Point> = [new Point(1,1),
                  new Point(1,1),
                  new Point(1,2),
                  new Point(1,2)],
            xyMap = new XYMap(points);
        expect(xyMap.get(1,2)).to.not.equal(undefined);
        expect(xyMap.get(1,3)).to.equal(undefined);
        expect(xyMap.get(1,1)).to.not.equal(undefined);
        
        expect(xyMap.getPoints().length).to.equal(2);
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
        expect(xyMap.get(1, 1).equals(new Point(10, 10))).to.equal(true);
    }),
    it("should be immutable", () => {
        let points: Array<Point> = [new Point(1,1)],
            xyMap = new XYMap(points);
        expect(function() {
            xyMap.set(0, 0, true);
        }).to.throw('Trying to modify immutable map!');
    }),
    it("can build the map up using set instead of as an array of points", () => {
        let xyMap = new XYMap();
        xyMap.set(1, 1, true);
        xyMap.set(1,1, "banana");
        xyMap.set(1, 2, true);
        xyMap.set(1, 2, true);

        expect(xyMap.get(1, 1)).to.equal("banana");
        expect(xyMap.get(1, 2)).to.equal(true);
        expect(xyMap.values().length).to.equal(2);
    });
});
