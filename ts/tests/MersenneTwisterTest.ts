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
    }),
    it("Tests that the random range function works", () => {
        let generator = new MersenneTwister(123), 
            temp = generator.genrand_range(2,3),
            temp1 = generator.genrand_range(2,3),
            temp2 = generator.genrand_range(2,3);

        expect(2 <= temp && temp < 3).to.equal(true);
        expect(2 <= temp1 && temp1 < 3).to.equal(true);
        expect(2 <= temp2 && temp2 < 3).to.equal(true);
    });
});

