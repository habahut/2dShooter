import { ProbabilityBehaviorDeterminator } from "../../config/ProbabilityBehaviorDeterminator";
import { ProbabilityConfigHandler } from "../../config/ProbabilityConfigHandler";

/**
 * This enum determines the preferred behavior of the LevelGenerator when dealing with the
 * pathways connecting the largest rooms.
 *
 * Each type of behavior is explained below.
 */
export enum RoomConnectionBehavior {
    // No change, the level generator will do nothing, leaving many individual rooms as the path
    // between the expanded rooms
    NONE,
    // The level generator will bias towards narrow hallways connecting expanded rooms.
    // this will generate a fairly sparse level, with only the original expanded rooms connected by
    // narrow hallways.

    // TODO: should have a hallway variant for zig zagging or straight lines, or combining the two

    HALLWAYS,
    // Same as above, but the generator will attempt to build wider hallways.
    WIDE_HALLWAYS,
    // The level generator will bias towards blob-like connections, often splitting up the
    // connection into multiple, irregularly shaped rooms.
    BLOBS,
    // Same as above, but the generator will attempt to build even larger blob-like connections,
    // Filling as much space as possible between rooms. This will lead to a very dense level,
    // filled with large rooms
    LARGE_BLOBS,

    // These define mixes of the above, with some bias towards a type of feature. Config file
    // RoomConnectionBehavior.config for percentages of mix.
    EVEN_MIX,
    HALLWAY_MIX,
    WIDE_HALLWAY_MIX,
    BLOB_MIX,
    LARGE_BLOB_MIX
}

// this thing should HAVE a probabilityNegotiator, and be some new interface type
// which can be used by all similar behavioral enums.
export class RoomConnectionBehaviorDeterminator implements ProbabilityBehaviorDeterminator {

    probabilityConfigHandler: ProbabilityConfigHandler;

    constructor(configFilePath: string = "") {
        if (configFilePath == "") {
            configFilePath = "../../../config/RoomConnectionBehavior.json";
        }
        this.probabilityConfigHandler = new ProbabilityConfigHandler(configFilePath);
    }

    probabilityToBehavior(mixName: string, probability: number): any {
        // this somewhat torturous typing and casting is required by typescript
        let name: keyof typeof RoomConnectionBehavior = <keyof typeof RoomConnectionBehavior> 
            this.probabilityConfigHandler.probabilityAndMixToValue(mixName, probability);
        return RoomConnectionBehavior[name];
    }
}


/*
export class ProbabilityNegotiator() {

    mixes: any;

    static configFilePath = "../../../config/";

    constructor() {
        /// load and cache all the configs on instantiation, no point in doing it lazily.
        // cache by enum type

        // config file name and enum name must match!
        configs = {["RoomConnectionBehavior"]}
        mixes = {};

        for (let config of configs) {    
            mixes[config] = loadConfig;
        }
    }

    loadConfig(configName: string) : any {
        let configValues = require(configFilePath + configName);

        for (let mix of configValues) {
            let total = 0,
                thisMix = {};
            for (let type of mix) {
                thisMix[type] = {"min": total, "max": total + mix[type]};
                total += mix[type];
            }
            if (total != 100) {
                throw "Invalid Config " + CONFIG + ", values do not add to 100%";
            }
        }

        return thisMix;
    }

    ///
    probabilityToValue(enumName: string, enumValue: string, value: number) : any {
        // use probabilityCache to determine and return enum value
        // if the enumString is not present in the probability cache of the enumName, then just
        // return it.

        /// console.log(Object.create(enumName)[0]);
        for (let mix
    }

    /*
        mixes = {}; 
        for (let mix of CONFIG.mixes) {
            let mixPercentages = {};
                total = 0,
                name = Object.keys(mix)[0]
            for (let type of Object.keys(mix[name])) {
                let temp = {};
                temp[type] = {"min": total, "max": total + mix[name][type]};
                mixPercentages[name] = temp;
            }
        }
        */



        //// 

        /*
    getRoomBehavior(mersenneTwister: MersenneTwister, behavior: RoomConnectionBehavior) {
        // in this case, the behavior is already determined, so just return it.
        if (behavior == RoomConnectionBehavior.NONE 
                || behavior == RoomConnectionBehavior.HALLWAYS
                || behavior == RoomConnectionBehavior.WIDE_HALLWAYS
                || behavior == RoomConnectionBehavior.BLOBS
                || behavior == RoomConnectionBehavior.LARGE_BLOBS) {
            return behavior;
        }



    }

}
*/

/// usage: https://basarat.gitbooks.io/typescript/docs/enums.html
