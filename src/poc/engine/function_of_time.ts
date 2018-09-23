/**
 * Contains the following heirarchy. Instances with a (*) are not concrete.
 *   - TimeFxnFactory     *
 *   |- Constant
 *   |- Knob
 *   |- Button
 *   |- DependentFoT      *
 *   | |- Adder
 *   | |- Averager
 *   | |- Multiplier
 *   | |- Filter          *
 *   | | |- Clamper
 *   | | |- Sigmoider
 *   |- ZipCombiner
 *   | |- DotProduct
 *   | |- WeightedAverage *
 *
 * At the bottom of the file the following functions and constants can be found
 *
 * functions:
 *   accum, add, avg, button, clamp, dot, knob, mul, num, sigmoid, wghtdAvg
 *
 * constants:
 *   HALF, ONE, ZERO
 *
 * N.b. the order of this notice matches the order of appearance of classes in the file and moreover the names of
 *      instances are "as alphabetized as possible". Keep it that way (please).
 */

/**
 * TimeFxn is a function of time.
 */
export type TimeFxn = (t: number) => number;

/**
 * TimedVal represents a function over time.
 */
export interface TimeFxnFactory {
    /**
     * Returns a function defining the value of this object at all points in time.
     *
     * @param time
     */
    get(): TimeFxn;
}

/**
 * Constant is a function of time which remains constant over time.
 */
export class Constant implements TimeFxnFactory {
    private fxn: TimeFxn;
    constructor(x: number) {
        this.fxn = (_ignore: number) => x;
    }

    public get(): TimeFxn {
        return this.fxn;
    }
}

/**
 * Knob is a TimeFxnFactory which always emits a Exotic Function Object bound to a single value set in the factory. All
 * functions ever retrieved from this factory will emit the value currently stored in this object.
 */
export class Knob implements TimeFxnFactory {
    readonly fxn: TimeFxn;
    private value: number;

    constructor(value: number) {
        this.fxn = ((_ignore: number) => this.value).bind(this);
    }

    public setValue(x: number) {
        this.value = x;
    }

    public getValue(): number {
        return this.value;
    }

    public get(): TimeFxn {
        return this.fxn;
    }
}

/**
 * Button is a TimeFxnFactory whose value is zero or one depending on whether the button is on or off. The state of
 * the button is independent of time, but may change in response to external events.
 */
export class Button implements TimeFxnFactory {
    readonly fxn: TimeFxn;
    private isOn: boolean;

    constructor(isOn: boolean) {
        this.fxn = ((_ignore: number) => this.isOn ? 1 : 0).bind(this);
    }

    public toggle() { this.isOn = !this.isOn; }
    public setState(isOn: boolean) {
        this.isOn = isOn;
    }

    public getState(): boolean {
        return this.isOn;
    }

    public get(): TimeFxn {
        return this.fxn;
    }
}

/**
 * DependentVal depends on one or more source values.
 */
abstract class DependentFoT implements TimeFxnFactory {
    private sources: TimeFxnFactory[];

    constructor(... sources: TimeFxnFactory[]) {
        this.sources = sources;
    }

    public get(): TimeFxn {
        return this.computeVal(...this.sources.map((s) => s.get()));
    }

    protected abstract computeVal(...inputs: TimeFxn[]): TimeFxn;
}

/**
 * Averager is a DependentFoT which averages its inputs together.
 */
export class Averager extends DependentFoT {
    computeVal(...values: TimeFxn[]): TimeFxn {
        return (t:number) => (values.map(fxn => fxn(t))
                                    .reduce((prev, curr) => prev + curr, 0)) / values.length;
    }
}

/**
 * Adder is a DependentFoT which sums its inputs together and returns the result.
 */
export class Adder extends DependentFoT {
    computeVal(...values: TimeFxn[]): TimeFxn {
        return (t:number) => (values.map(fxn => fxn(t))
                                    .reduce((prev, curr) => prev + curr, 0));
    }
}

/**
 * Multiplier is a DependentFoT which multiplies its inputs together. It is most appropriate for inputs between
 * zero and one.
 */
export class Multiplier extends DependentFoT {
    computeVal(...values: TimeFxn[]): TimeFxn {
        return (t:number) => (values.map(fxn => fxn(t))
                                    .reduce((prev, curr) => prev * curr, 1));
    }
}

/**
 * Filter is a DependentFoT with a single input which filters its input in some way.
 */
export abstract class Filter extends DependentFoT {

    constructor(input: TimeFxnFactory) {
        super(input);
    }

    protected computeVal(...sources: TimeFxn[]): TimeFxn {
        // N.b. despite this method's variadic signature, we are guaranteed to only be called with one source value.
        return this.filter(sources[0]);
    }

    protected abstract filter(source: TimeFxn): TimeFxn;
}

/**
 * Clamper is a filter which clamps its input to the closed interval between [min, max].
 */
export class Clamper extends Filter {
    public constructor(input: TimeFxnFactory, private min: number, private max:number) {
        super(input);
    }

    protected filter(fxn: TimeFxn): TimeFxn {
        return (t: number) => {
            let out: number = fxn(t);
            return (out < this.min) ? this.min : out > this.max ? this.max : out;
        }
    }

    public setMax(val: number) { this.max = val; }
    public setMin(val: number) { this.min = val; }
}

/**
 * Sigmoider is a filter which applies a shifted and scaled sigmoid function to its input.
 */
export class Sigmoider extends Filter {
    public constructor(input: TimeFxnFactory, private shift: number = 0 , private scale: number = 1) {
        super(input);
    }

    protected filter(fxn: TimeFxn): TimeFxn {
        return (t: number) => this.scale*(1 / (1 + Math.exp(fxn(t) + this.shift)));
    }
}

/**
 * ZipCombiner is an abstract TimedVal which combines a pair of array of inputs in dot-product-like way.
 */
export abstract class ZipCombiner implements TimeFxnFactory {
    private a: TimeFxnFactory[];
    private b: TimeFxnFactory[];

    public constructor(a: TimeFxnFactory[], b: TimeFxnFactory[]) {
        this.a = a;
        this.b = b;
    }

    public get(): TimeFxn {
        return this.zipCombine(this.a.map((fot) => fot.get()),
                               this.b.map((fot) => fot.get()));
    }

    protected abstract zipCombine(a: TimeFxn[], b: TimeFxn[]): TimeFxn;
}

/**
 * DotProduct is a ZipCombiner which takes the dot product of its input arrays. If its inputs are not of the same
 * length, the result is the dot-product of prefixes for which both arrays have values.
 */
export class DotProduct extends ZipCombiner {
    public zipCombine(a: TimeFxn[], b: TimeFxn[]): TimeFxn {
        if(a.length < b.length) {
            return (t: number) => a.map(fxn => fxn(t))
                                   .reduce((prev, curr, idx) => prev + curr * b[idx](t), 0);
        } else {
            return (t:number) => b.map(fxn => fxn(t))
                                  .reduce((prev, curr, idx) => prev + curr * a[idx](t), 0);
        }
    }
}

/**
 * WeightedAverage is a ZipCombiner which takes the weighted average of an input array, treating the first argument
 * as weights If its inputs are not of the same
 * length, the result is the dot-product of prefixes for which both arrays have values.
 */
export class WeightedAverage extends ZipCombiner {
    public zipCombine(weights: TimeFxn[], inputs: TimeFxn[]): TimeFxn{
        if(weights.length < inputs.length) {
            return (t:number) => (weights.map(fxn => fxn(t))
                                         .reduce((prev, curr, idx) => prev + curr * inputs[idx](t), 0)) /
                                 (weights.map(fxn => fxn(t))
                                         .reduce((prev, curr) => prev + curr, 0));
        } else {
            return (t:number) => (inputs.map(fxn => fxn(t))
                                         .reduce((prev, curr, idx) => prev + curr * weights[idx](t), 0)) /
                                 (weights.map(fxn => fxn(t))
                                         .reduce((prev, curr) => prev + curr, 0));
        }
    }
}

// Convenience methods to avoid a shitton of 'new' statements. This should be considered the "public API"
export function add(...vals: TimeFxnFactory[]): Adder {
    return new Adder(...vals);
}
export function avg(...vals: TimeFxnFactory[]): Averager {
    return new Averager(...vals);
}
export function button(isOn: boolean): Button {
    return new Button(isOn);
}
export function clamp(val: TimeFxnFactory, min: number, max: number): Clamper {
    return new Clamper(val, min, max);
}
export function dot(a: TimeFxnFactory[], b: TimeFxnFactory[]): DotProduct {
    return new DotProduct(a, b);
}
export function knob(value: number): Knob {
    return new Knob(value);
}
export function mul(...vals: TimeFxnFactory[]): Multiplier {
    return new Multiplier(...vals);
}
export function num(val: number): Constant {
    return new Constant(val);
}
export function sigmoid(val: TimeFxnFactory, shift: number = 0, scale: number = 1): Sigmoider {
    return new Sigmoider(val, shift, scale);
}
export function wghtdAvg(a: TimeFxnFactory[], b: TimeFxnFactory[]): WeightedAverage {
    return new WeightedAverage(a, b);
}
export const HALF: TimeFxnFactory = new Constant(0.5);
export const ONE: TimeFxnFactory = new Constant(1);
export const ZERO: TimeFxnFactory = new Constant(0);
