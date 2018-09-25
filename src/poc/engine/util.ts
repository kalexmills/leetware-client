import {Clock} from "./engine";

export interface Map<V> {
    [key: string]: V;
};

export class LazyGainer {
    private value: number;
    private gainRate: number;
    private lastRateChangeAt: Clock.Tick;

    private isPaused: boolean;
    private pausedGainRate: number;

    public pause() {
        if(!this.isPaused) {
            this.isPaused = true;
            this.pausedGainRate = this.gainRate;
            this.setGainRate(0);
        }
    }

    public resume() {
        if(this.isPaused) {
            this.isPaused = false;
            this.setGainRate(this.pausedGainRate);
        }
    }

    public getGainRate() { return this.gainRate; }

    public setGainRate(gainRate: number) {
        this.value += (Clock.now() - this.lastRateChangeAt) * this.gainRate;
        this.gainRate = gainRate;
        this.lastRateChangeAt = Clock.now();
    }

    public rateAdd(addend: number) {
        this.setGainRate(this.gainRate + addend);
    }

    public rateMul(multiplier: number) {
        this.setGainRate(this.gainRate * multiplier);
    }

    public add(addend: number) {
        this.value += addend;
    }

    public mul(multiplier: number) {
        this.value *= multiplier;
    }

    public currVal() {
        return this.value + (Clock.now() - this.lastRateChangeAt) * this.gainRate;
    }
}

export function sum(vec: number[]) {
    return vec.reduce((prev, curr) => prev + curr, 0);
}

export function avg(vec: number[]) {
    return sum(vec) / vec.length;
}

export function wghtdAvg(weights: number[], inputs: number[]) {
    if(weights.length < inputs.length) {
        return weights.reduce((prev, curr, idx) => prev + curr * inputs[idx], 0) /
            weights.reduce((prev, curr) => prev + curr, 0);
    } else {
        return inputs.reduce((prev, curr, idx) => prev + curr * weights[idx], 0) /
            weights.reduce((prev, curr, idx) => idx < inputs.length ? prev + curr : 0, 0);
    }
}

export function dot(a: number[], b: number[]) {
    if(a.length < b.length) {
        return a.reduce((prev, curr, idx) => prev + curr * b[idx], 0);
    } else {
        return b.reduce((prev, curr, idx) => prev + curr * a[idx], 0);
    }
}