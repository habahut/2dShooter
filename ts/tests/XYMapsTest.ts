import { Point } from '../source/util/Point';
import { XYMap } from '../source/util/XYMap';

import {} from "jasmine";
import { expect } from "chai";

describe ("XYMaps Tests", () => {
    it("should say this index has content", () => {
        let points = [new Point(1,1),
                  new Point(1,2),
                  new Point(2,2)],
        xyMap = new XYMap(points);
        expect(xyMap.get(1,1)).to.not.equal(undefined);
        expect(xyMap.get(1,2)).to.not.equal(undefined);
        expect(xyMap.get(2,2)).to.not.equal(undefined);
    }),
    it("should say this index has no content", () => {
        let points = [new Point(1,1),
                  new Point(1,2),
                  new Point(2,2)],
        xyMap = new XYMap(points);
        expect(xyMap.get(3,3)).to.equal(undefined);
        expect(xyMap.get(1,3)).to.equal(undefined);
        expect(xyMap.get(2,3)).to.equal(undefined);
    }),
    it("should handle duplicate points", () => {
        let points = [new Point(1,1),
                  new Point(1,1),
                  new Point(1,2),
                  new Point(1,2)],
        xyMap = new XYMap(points);
        expect(xyMap.get(1,2)).to.not.equal(undefined);
        expect(xyMap.get(1,3)).to.equal(undefined);
        expect(xyMap.get(1,1)).to.not.equal(undefined);
    });
 
});
