import { ProbabilityNegotiator } from "../source/config/ProbabilityNegotiator";

import {} from "jasmine";
import { expect } from "chai";

describe ("Probability Negotiator tests", () => {
    it("given the test config file, it generates the correct configuration for RoomConnectionBehavior", () => {
        let probabilityNegotiator: ProbabilityNegotiator = new ProbabilityNegotiator(),
            config = probabilityNegotiator.loadConfig("TESTS/testRoomConnectionBehavior");

        expect(config["EVEN_MIX"]["NONE"].min).to.equal(0);
        expect(config["EVEN_MIX"]["HALLWAYS"].max).to.equal(40);
        expect(config["EVEN_MIX"]["WIDE_HALLWAYS"].min).to.equal(40);
        expect(config["HALLWAY_MIX"]["HALLWAYS"].max).to.equal(60);
        expect(config["BLOB_MIX"]["NONE"].max).to.equal(10);
        expect(config["BLOB_MIX"]["LARGE_BLOBS"].min).to.equal(50);
        // below is the full expected result. Spot check a few.
        /*
        {"EVEN_MIX":{"NONE":{"min":0,"max":20},"HALLWAYS":{"min":20,"max":40},"WIDE_HALLWAYS":{"min":40,"max":60},"BLOBS":{"min":60,"max":80},"LARGE_BLOBS":{"min":80,"max":100}}, "HALLWAY_MIX":{"NONE":{"min":0,"max":10},"HALLWAYS":{"min":10,"max":60},"WIDE_HALLWAYS":{"min":60,"max":80},"BLOBS":{"min":80,"max":90},"LARGE_BLOBS":{"min":90,"max":100}},"WIDE_HALLWAY_MIX":{"NONE":{"min":0,"max":10},"HALLWAYS":{"min":10,"max":30},"WIDE_HALLWAYS":{"min":30,"max":80},"BLOBS":{"min":80,"max":90},"LARGE_BLOBS":{"min":90,"max":100}},"BLOB_MIX":{"NONE":{"min":0,"max":10},"HALLWAYS":{"min":10,"max":20},"WIDE_HALLWAYS":{"min":20,"max":30},"BLOBS":{"min":30,"max":50},"LARGE_BLOBS":{"min":50,"max":100}}}
        */
    });
});
