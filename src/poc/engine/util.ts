export interface Map<V> {
    [key: string]: V;
};

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