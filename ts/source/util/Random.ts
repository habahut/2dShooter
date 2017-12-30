// TODO: remove this file. All random generation should happen through the mersenneTwister
export class Random {
    static getInt(min: number, max: number) {
        return Math.random() * (max - min) + min
    }
}

