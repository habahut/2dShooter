export class Random {
    static getInt(min: number, max: number) {
        return Math.random() * (max - min) + min
    }
}
