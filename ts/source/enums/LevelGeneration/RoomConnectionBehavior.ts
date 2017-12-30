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
