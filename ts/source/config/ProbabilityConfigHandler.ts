export class ProbabilityConfigHandler {

    probabilityMix: any;

    constructor(configFilePath: string) {
        this.probabilityMix = {};
        let configValues = require(configFilePath);

        for (let mixKey of Object.keys(configValues)) {
            let total: number = 0,
                thisMix: any = {};

            for (let typeKey of Object.keys(configValues[mixKey])) {
                let percentage = configValues[mixKey][typeKey];
                thisMix[typeKey] = {"min": total, "max": total + percentage}
                total += percentage;
            }
            if (total != 100) {
                throw "Invalid Config " + configFilePath + ", values do not add to 100%";
            }
            this.probabilityMix[mixKey] = thisMix;
        }
    }

    /// I'm actually not sure if i need to explicitly import all the potential enums, that would
    // be annoying. I think I might be able to just load them up with reflection, but i'm not sure.


    // this thing should just return the string of the determined behavior. Let the caller figure out
    // how to create an instance of the right enum.
    probabilityAndMixToValue(mixName: string, probability: number) : string {
        // determine if this is a mix value we've been passed. If not, just return the same choice.
        if (this.probabilityMix[mixName] == undefined) {
            return mixName;
        }

        debugger;

        let thisMix = this.probabilityMix[mixName];
        for (let name in thisMix) {
            let range = thisMix[name];
            if (range.min < probability && probability < range.max) {
                return name;
            }
        }

        throw "Could not find an enum value for " + mixName + " for probability: " + probability + " " + JSON.stringify(this.probabilityMix);
    }


        // use probabilityCache to determine and return enum value
        // if the enumString is not present in the probability cache of the enumName, then just
        // return it.

        /*
        if (this.mixes[enumName] == undefined) {
            throw "Attempting to negotiate enum: " + enumName + " which does not exist!";
        }

        let mix = this.mixes[enumName];
        if (mix[enumValue] == undefined) {
            return enumValue;
        }
        for (let type of mix) {
            if (mix[type].min < probability && probability < mix[type].max) {
                
            }
        }
        /// console.log(Object.create(enumName)[Enum.value])
        //for (let mix
        */
    //return "";
}
