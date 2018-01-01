// TODO: remove this file. All random generation should happen through the mersenneTwister
// TODO: ideally this would be an interface which wraps MersenneTwister and clients
// would'nt know about hte twister at all, just call this guy which provides all their stuff.
export class Random {
    static getInt(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    static uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

