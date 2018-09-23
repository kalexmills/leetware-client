/**
 * Contains the following heirarchy. Instances with a (*) are not concrete.
 *   - TimedVal           *
 *   |- Button
 *   |- Constant
 *   |- Knob
 *   |- AbstractCachedVal *
 *   | |- Accumulator
 *   | |- DependentAccumulator
 *   | |- CachedVal
 *   |- DependentVal      *
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

import {Clock, Tickable} from "./engine";

/**
 * TimedVal is a value which changes over time.
 */
export interface TimedVal {
    /**
     * Returns the value of TimedVal at some time in the future. Callers are expected to ensure
     * that subsequent calls to valueAt() pass non-decreasing values of time.
     *
     * @param time
     */
    valueAt(time: number): number;
}

/**
 * Button is a TimedVal whose value can be toggled or set by external events. It has value zero if off and one if on.
 */
export class Button implements TimedVal {
    private isOn: boolean;
    public constructor(isOn: boolean) {
        this.isOn = isOn;
    }

    public valueAt(_ignore: number): number { return this.isOn ? 1 : 0; }

    public toggle(): void {
        this.isOn = !this.isOn;
    }
    public set(isOn: boolean): void {
        this.isOn = isOn;
    }
}

/**
 * Constant is a TimedVal whose value does not change over time.
 */
export class Constant implements TimedVal {
    private value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public valueAt(_ignore: number): number {
        return this.value;
    }
}

/**
 * Knob is a TimedVal whose value does not change over time, but is set by external events.
 */
export class Knob implements TimedVal {
    // N.b. this class doesn't extend DependentVal because its implementation of valueAt is significantly simpler.
    private value: number;

    public constructor(initialValue: number) {
        this.value = initialValue;
    }

    public valueAt(_ignore: number): number { return this.value; }

    public setVal(newVal: number) {
        this.value = newVal;
    }
}

/**
 * AbstractCachedVal implements simple caching to guarantee the wrapped value is only computed once in any tick. It
 * provides a recomputeCachedVal method for implementers to perform their computation.
 */
abstract class AbstractCachedVal implements TimedVal {
    private lastVal: number;
    protected lastCalcAt: number;

    protected constructor(createTime: number) {
        this.lastCalcAt = createTime;
    }

    public valueAt(time: number): number {
        if (this.lastVal === undefined || this.lastCalcAt != time) {
            this.cache(time);
        }
        return this.lastVal;
    }

    protected cache(time: number): void {
        this.lastVal = this.recomputeCachedVal(time);
        this.lastCalcAt = time;
    }

    protected abstract recomputeCachedVal(time: number): number;
}

/**
 * CachedVal wraps a TimedVal and provides caching to guarantee the wrapped value is computed only once in any tick.
 */
export class CachedVal extends AbstractCachedVal {

    constructor(createTime: number, private wrapped: TimedVal) {
        super(createTime);
    }

    protected recomputeCachedVal(time: number): number {
        return this.wrapped.valueAt(time);
    }
}

/**
 * Accumulator is a TimedVal which takes a velocity as input. It accumulates value into an internal store, which is
 * increased or decreased during each tick at a rate equal to the accumulator's velocity.
 *
 * This class also includes an optional acceleration parameter. If not given, it is assumed to be zero. Changes in
 * velocity and acceleration are explicit events.
 *
 * Velocity and acceleration of this Accumulator are changed only via external events.
 */
export class Accumulator extends AbstractCachedVal {
    constructor(private value: number, time: number, private velocity: number, private acceleration: number = 0) {
        super(time);
    }

    public changeVelocity(velocity: number, time: number) {
        this.recomputeCachedVal(time);
        this.velocity = velocity;
    }

    public changeAcceleration(acceleration: number, time: number) {
        this.recomputeCachedVal(time);
        this.acceleration = acceleration;
    }

    protected recomputeCachedVal(time: number): number {
        let dT = (time - this.lastCalcAt);
        this.value += this.velocity*dT + 0.5*this.acceleration*dT*dT;
        this.velocity += this.acceleration*dT;
        return this.value;
    }
}

/**
 * DependentAccumulator is an accumulator whose acceleration and velocities are TimedValues. A DependentAccumulator
 * must recompute itself on each tick so that it can stay informed of changes on downstream TimedVals which may change
 * arbitrarily.
 *
 * The DependentAccumulator accumulates velocity separately from the velVal TimedVal. It interprets these changes in
 * velVal as instantaneous impulses that occur on the tick.
 */
export class DependentAccumulator extends AbstractCachedVal implements Tickable {
    private velocity: number;
    private velocityAtLastCalc: number;
    constructor(private value: number, time: number, private velVal: TimedVal, private acceleration: TimedVal) {
        super(time);
        Clock.registerTickable(this);
        this.velocity = this.velVal.valueAt(time);
        this.velocityAtLastCalc = this.velocity;
    }

    public tick(time: number): void {
        this.valueAt(time); // make the call to the superclass to ensure that caching occurs.
    }

    public changeVelocity(velocity: TimedVal, time: number) {
        this.cache(time); // force a recache if needed.
        this.velVal = velocity;
    }

    public changeAcceleration(acceleration: TimedVal, time: number) {
        this.cache(time); // force a recache if needed.
        this.acceleration = acceleration;
    }

    protected recomputeCachedVal(time: number): number {
        let velNow = this.velVal.valueAt(time);
        let dT = (time - this.lastCalcAt);
        let dV = (this.velVal.valueAt(time) - this.velocityAtLastCalc);

        this.velocity += dV;
        this.value += this.velocity*dT + 0.5*this.acceleration.valueAt(time)*dT*dT;
        this.velocity += this.acceleration.valueAt(time)*dT;

        this.velocityAtLastCalc = velNow;
        return this.value;
    }
}

/**
 * DependentVal depends on one or more source values.
 */
abstract class DependentVal implements TimedVal {
    private sources: TimedVal[];

    constructor(... sources: TimedVal[]) {
        this.sources = sources;
    }

    public valueAt(time: number): number {
        return this.computeVal(...this.sources.map((s) => s.valueAt(time)));
    }

    protected abstract computeVal(...inputs: number[]): number;
}

/**
 * Averager is a Combiner which averages its inputs together.
 */
export class Averager extends DependentVal {
    computeVal(...values: number[]): number {
        return values.reduce((prev, curr) => prev + curr, 0) / values.length;
    }
}

/**
 * Adder is a Combiner which sums its inputs together and returns the result.
 */
export class Adder extends DependentVal {
    computeVal(...values: number[]): number {
        return values.reduce((prev, curr) => prev + curr, 0);
    }
}

/**
 * Multiplier is a Combiner which multiplies its inputs together. It is most appropriate for inputs between
 * zero and one.
 */
export class Multiplier extends DependentVal {
    computeVal(...values: number[]): number {
        return values.reduce((prev, curr) => prev * curr, 1);
    }
}

/**
 * Filter is a DependentVal with a single input which filters its input in some way.
 */
export abstract class Filter extends DependentVal {

    constructor(input: TimedVal) {
        super(input);
    }

    protected computeVal(...sources: number[]): number {
        // N.b. despite this method's variadic signature, we are guaranteed to only be called with one source value.
        return this.filter(sources[0]);
    }

    protected abstract filter(source: number): number;
}

/**
 * Clamper is a filter which clamps its input to the closed interval between [min, max].
 */
export class Clamper extends Filter {
    public constructor(input: TimedVal, private min: number, private max:number) {
        super(input);
    }

    protected filter(value: number): number {
        return (value < this.min) ? this.min : (value > this.max) ? this.max : value;
    }

    public setMax(val: number) { this.max = val; }
    public setMin(val: number) { this.min = val; }
}

/**
 * Sigmoider is a filter which applies a shifted and scaled sigmoid function to its input.
 */
export class Sigmoider extends Filter {
    public constructor(input: TimedVal, private shift: number = 0 , private scale: number = 1) {
        super(input);
    }

    protected filter(value: number): number {
        return this.scale*(1 / (1 + Math.exp(value + this.shift)));
    }
}

/**
 * ZipCombiner is an abstract TimedVal which combines a pair of array of inputs in dot-product-like way.
 */
export abstract class ZipCombiner implements TimedVal {
    private a: TimedVal[];
    private b: TimedVal[];
    private lastVal: number;

    public constructor(a: TimedVal[], b: TimedVal[]) {
        this.a = a;
        this.b = b;
    }

    public valueAt(time: number) {
        this.lastVal =  this.zipCombine(this.a.map((input) => input.valueAt(time)),
                                        this.b.map((input) => input.valueAt(time)));
        return this.lastVal;
    }

    protected abstract zipCombine(a: number[], b: number[]): number;
}

/**
 * DotProduct is a ZipCombiner which takes the dot product of its input arrays. If its inputs are not of the same
 * length, the result is the dot-product of prefixes for which both arrays have values.
 */
export class DotProduct extends ZipCombiner {
    public zipCombine(a: number[], b: number[]): number {
        if(a.length < b.length) {
            return a.reduce((prev, curr, idx) => prev + curr * b[idx], 0);
        } else {
            return b.reduce((prev, curr, idx) => prev + curr * a[idx], 0);
        }
    }
}

/**
 * WeightedAverage is a ZipCombiner which takes the weighted average of an input array, treating the first argument
 * as weights If its inputs are not of the same
 * length, the result is the dot-product of prefixes for which both arrays have values.
 */
export class WeightedAverage extends ZipCombiner {
    public zipCombine(weights: number[], inputs: number[]): number {
        if(weights.length < inputs.length) {
            return weights.reduce((prev, curr, idx) => prev + curr * inputs[idx], 0) /
                   weights.reduce((prev, curr) => prev + curr, 0);
        } else {
            return inputs.reduce((prev, curr, idx) => prev + curr * weights[idx], 0) /
                   weights.reduce((prev, curr, idx) => idx < inputs.length ? prev + curr : 0, 0);
        }
    }
}

// Convenience methods to avoid a shit-ton of 'new' statements. This should be considered the "public API"
export function accum(val: number, time: number, vel: number, accel: number = 0): Accumulator {
    return new Accumulator(val, time, vel, accel);
}
export function daccum(val: number, time: number, vel: TimedVal, accel: TimedVal = ZERO): DependentAccumulator {
    return new DependentAccumulator(val, time, vel, accel);
}
export function add(...vals: TimedVal[]): Adder {
    return new Adder(...vals);
}
export function avg(...vals: TimedVal[]): Averager {
    return new Averager(...vals);
}
export function button(isOn: boolean = false): Button {
    return new Button(isOn);
}
export function clamp(val: TimedVal, min: number, max: number): Clamper {
    return new Clamper(val, min, max);
}
export function dot(a: TimedVal[], b: TimedVal[]): DotProduct {
    return new DotProduct(a, b);
}
export function knob(val: number = 0): Knob {
    return new Knob(val);
}
export function mul(...vals: TimedVal[]): Multiplier {
    return new Multiplier(...vals);
}
export function num(val: number): Constant {
    return new Constant(val);
}
export function sigmoid(val: TimedVal, shift: number = 0, scale: number = 1): Sigmoider {
    return new Sigmoider(val, shift, scale);
}
export function wghtdAvg(a: TimedVal[], b: TimedVal[]): WeightedAverage {
    return new WeightedAverage(a, b);
}
export const HALF: TimedVal = new Constant(0.5);
export const ONE: TimedVal = new Constant(1);
export const ZERO: TimedVal = new Constant(0);
