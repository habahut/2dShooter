import { Point } from "../source/util/Point";

import {} from "jasmine";
import { expect } from "chai";

describe ("Point Tests", () => {
    it("point equals itself", () => {
        let p1 = new Point(1,1);
        expect(p1.equals(p1)).to.equal(true);
    }),
    it("point equals other point", () => {
        let p1 = new Point(1,1),
            p2 = new Point(1,1);
        expect(p1.equals(p2)).to.equal(true);
    }),
    it("point does not equal different point", () => {
        let p1 = new Point(1,1),
            p2 = new Point(1,2);
        expect(p1.equals(p2)).to.equal(false);
    });
});
 
