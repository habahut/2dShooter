import { RoomConnectionBehaviorDeterminator } from "../source/enums/LevelGeneration/RoomConnectionBehavior";
import { RoomConnectionBehavior } from "../source/enums/LevelGeneration/RoomConnectionBehavior";

import {} from "jasmine";
import { expect } from "chai";

describe ("Probability Behavior Determinator, using RoomConnectionBehaviorDeterminator", () => {
    it("returns the correct enum value given the test config and different mixes", () => {
        let determinator = new RoomConnectionBehaviorDeterminator("../../../config/TESTS/testRoomConnectionBehavior.json");
        


    });
});

