export class Random {
    static getInt(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    static createId() {
        let result = ''; 
        while (!result)  {
            result = Math.random().toString(36).substring(2); 
        }
        return result; 
    }
}

export class RandomGenerator {
    seed: Array<number>;
    count: number;
    index: number;

    constructor(seed: Array<number>) {
        this.seed = seed;
        this.count = 0;
        this.index = 0;
    }

    random() : boolean {
        this.count++;
        if (this.count == this.seed[this.index]) {
            this.index++;
            if (this.index > this.seed.length) {
                this.index = 0;
            }
            return true;
        }
        return false;
    }
}
