import {TimeFxn, TimeFxnFactory} from "./function_of_time";

/**
 * Integrator is a TimeFxnFactory which returns the definite integral between startTime and t, computed using
 * Simpson's Rule.
 *
 * Sending ridiculous functions into this method may have unexpected consequences.
 */
export class Integrator implements TimeFxnFactory {
    private static readonly MAX_ERROR = 0.0001;
    private static readonly MAX_ITER = 14; // about 8k

    constructor(protected startTime: number, protected fxn: TimeFxn) {
    }

    protected integrate(t: number): number {
        let f = this.fxn.get(),
            a = this.startTime;

        let j, s, os, st, ost;
        os = ost = -1.0e30;
        for(j=1;j<=Integrator.MAX_ITER;j++) {
            st=this.trapzd(f, a, t, j);
            s=(4.0*st-ost)/3.0;
            if(j > 5) {
                if (Math.abs(s-os) < Integrator.MAX_ERROR*Math.abs(os) ||
                    (s === 0 && os === 0)) return s;
            }
            os=s;
            ost=st;
        }
        return s; // A crappy approximation is better than nothing at all!
    }

    private static s: number;
    protected trapzd(f: TimeFxn, a: number, b: number, n: number) {
        let x, tnm, sum, del;
        let it, j;
        if (n == 1) {
            Integrator.s = 0.5*(b-a)*(f(a) + f(b));
            return Integrator.s;
        } else {
            for (it = 1, j = 1; j < n-1; j++) it <<= 1;
            tnm=it;
            del=(b-a)/tnm;
            x=a+0.5*del;
            for (sum = 0.0, j=1; j<=it; j++, x+=del) sum += f(x);
            Integrator.s=0.5*(Integrator.s+(b-a)*sum/tnm);
            return Integrator.s;
        }
    }

    get(): TimeFxn { return this.integrate.bind(this); }
}

/**
 * Accumulator is an integrator which accumulates the results of prior calls in a value. When a new call is made,
 * it only integrates the region which has not yet been integrated previously. Prior to the time of the last call,
 * the accumulator's value is assumed to be constant and equal to the integral of fxn at the previous time.
 *
 * N.b. since the function represented by TimeFxnFactory may change arbitrarily between two calls, the total value
 * accumulated may not even be approximately equal to the integral of fxn at any given time.
 */
export class Accumulator extends Integrator {
    constructor(private value: number, startTime, fxn: TimeFxn) {
        super(startTime, fxn);
    }

    private accumulate(t: number): number {
        if (t <= this.startTime) return this.value;
        this.value += this.integrate(t);
        this.startTime = t;
        return this.value;
    }

    get(): TimeFxn {
        return this.accumulate.bind(this);
    }
}

export function accum(value: number, t0: number, fxn: TimeFxnFactory): Accumulator {
    return new Accumulator(value, t0, fxn);
}