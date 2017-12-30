//import { require } from "@types/requirejs";

export class ProbabilityNegotiator {

    mixes: any;

    configFilePath: string = "../../../config/";

    constructor() {
        /// load and cache all the configs on instantiation, no point in doing it lazily.
        // cache by enum type

        // config file name and enum name must match!
        let configs = ["RoomConnectionBehavior"];
        this.mixes = {};

        for (let config of configs) {    
            this.loadConfig(config);
        }
    }

    loadConfig(configName: string) : any {
        //let configValues = require("../../../config/RoomConnectionBehavior.config");
        let configValues = require(this.configFilePath + configName + ".json"),
            totalMix: any = {};

            //console.log(JSON.stringify(configValues));
        debugger;
        for (let mixKey of Object.keys(configValues)) {
            let total: number = 0,
                thisMix: any = {};

            for (let typeKey of Object.keys(configValues[mixKey])) {
                let percentage = configValues[mixKey][typeKey];
                thisMix[typeKey] = {"min": total, "max": total + percentage}
                total += percentage;
            }
            if (total != 100) {
                debugger;
                throw "Invalid Config " + configName + ", values do not add to 100%";
            }
            totalMix[mixKey] = thisMix;
        }

        return totalMix;
    }

    /// I'm actually not sure if i need to explicitly import all the potential enums, that would
    // be annoying. I think I might be able to just load them up with reflection, but i'm not sure.
    probabilityToValue(enumName: string, enumValue: string, value: number) : any {
        // use probabilityCache to determine and return enum value
        // if the enumString is not present in the probability cache of the enumName, then just
        // return it.

         

        /// console.log(Object.create(enumName)[0]);
        //for (let mix
        return "";
    }


}
