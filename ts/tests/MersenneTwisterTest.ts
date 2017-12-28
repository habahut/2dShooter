import { MersenneTwister } from "../source/util/MersenneTwister";
import {} from "jasmine";
import { expect } from "chai";

describe ("Mersenne Twister Validation", () => {
    it("This test just ensures that the Mersenne Twister module is installed and working correctly", () => {
        let generator = new MersenneTwister(123), 
            generator2 = new MersenneTwister(123);
        expect(generator.random()).to.equal(generator2.random());
        expect(generator.random()).to.equal(generator2.random());
        expect(generator.random()).to.equal(generator2.random());
    });
});

