import "jasmine";
import {
    accum,
    add,
    avg,
    clamp,
    daccum,
    knob,
    mul,
    num,
    wghtdAvg,
    Accumulator,
    Adder,
    Averager,
    Clamper,
    Constant,
    DependentAccumulator,
    DotProduct,
    Knob,
    Multiplier,
    WeightedAverage,
    ONE,
    ZERO,
} from './timed_val';
import {Clock} from "./engine";

beforeEach(() => {
    Clock.jettisonSubscribers();
    Clock.reset();
});

describe('Constant', () => {
    it('should not change its value over time', () => {
        let c: Constant = num(10);

        expect(c.valueAt(0)).toEqual(10);
        expect(c.valueAt(1)).toEqual(10);
        expect(c.valueAt(2)).toEqual(10);
        expect(c.valueAt(3)).toEqual(10);
        expect(c.valueAt(-120)).toEqual(10);
        expect(c.valueAt(2000000)).toEqual(10);
    });
});

describe('Knob', () => {
    it('should respond to changes from external events', () => {
       let k: Knob = new Knob(10);

       expect(k.valueAt(0)).toEqual(10);

       k.setVal(5);
       expect(k.valueAt(100)).toEqual(5);
    });
});

describe('DotProduct', () => {
    it('should correctly compute a static dot-product', () => {
        let sum: DotProduct = new DotProduct(
            [new Constant(1), new Constant(2), new Constant(3)],
            [new Constant(4), new Constant(5), new Constant(6)]);

        expect(sum.valueAt(0)).toEqual(32);
        expect(sum.valueAt(123)).toEqual(32);
        expect(sum.valueAt(-1245)).toEqual(32);
    });

    it('should correctly update when downstream weights change', () => {
        let a: Knob = new Knob(1),
            b: Knob = new Knob(1),
            c: Knob = new Knob(1),
            d: Knob = new Knob(1),
            acPbd: DotProduct = new DotProduct([a, b], [c, d]);

        expect(acPbd.valueAt(0)).toEqual(2);  // 1*1 + 1*1
        a.setVal(2);
        expect(acPbd.valueAt(0)).toEqual(3);  // 2*1 + 1*1
        b.setVal(2);
        expect(acPbd.valueAt(0)).toEqual(4);  // 2*1 + 2*1
        c.setVal(11);
        expect(acPbd.valueAt(0)).toEqual(24); // 2*11 + 2*1
    });

    it('should correctly update when downstream weights change over time', () => {
        let time: number = 0,
            a: Accumulator = new Accumulator(0, time, 1),
            b: Accumulator = new Accumulator(0, time, 2),
            c: Constant = new Constant(0.5),
            d: Accumulator = new Accumulator(0, time, 1),
            acPbd: DotProduct = new DotProduct([a,b], [c,d]);

        expect(acPbd.valueAt(time)).toEqual(0);     // 0*0.5 + 0*0
        time = 1;
        expect(acPbd.valueAt(time)).toEqual(2.5);   // 1*0.5 + 2*1
        time = 2;
        expect(acPbd.valueAt(time)).toEqual(9);     // 2*0.5 + 4*2
        time = 3;
        expect(acPbd.valueAt(time)).toEqual(19.5)   // 3*0.5 + 6*3
    })
});

describe('Accumulator', () => {
   it('should correctly compute a value that updates according to velocity', () => {
       let acc: Accumulator = accum(0, 0, 1, 0);

       expect(acc.valueAt(0)).toEqual(0);
       expect(acc.valueAt(1)).toEqual(1);
       expect(acc.valueAt(4)).toEqual(4);
   });
    it('should correctly accumulate value when velocity is changed', () => {
        let acc: Accumulator = accum(0, 0, 1, 0);

        expect(acc.valueAt(4)).toEqual(4);
        acc.changeVelocity(-1, 4);
        expect(acc.valueAt(6)).toEqual(2);
        acc.changeVelocity(2, 6);
        expect(acc.valueAt(8)).toEqual(6);
    });
    it('should correctly compute a value that updates according to acceleration', () => {
        let acc: Accumulator = accum(0, 0, 0, 1);

        expect(acc.valueAt(0)).toEqual(0);
        expect(acc.valueAt(1)).toEqual(0.5);
        expect(acc.valueAt(2)).toEqual(2);
        expect(acc.valueAt(3)).toEqual(4.5);
    });
    it('should correctly compute a value when acceleration is changed', () => {
        let acc: Accumulator = accum(0, 0, 0, 1);

        expect(acc.valueAt(0)).toEqual(0);
        expect(acc.valueAt(1)).toEqual(0.5);
        acc.changeAcceleration(-1, 1);
        expect(acc.valueAt(2)).toEqual(1);
        expect(acc.valueAt(3)).toEqual(0.5);
        expect(acc.valueAt(4)).toEqual(-1);
    });
    it('should correctly compute a value that updates according to acceleration and velocity', () => {
        let acc: Accumulator = accum(0, 0, 1, 1);

        expect(acc.valueAt(0)).toEqual(0);
        expect(acc.valueAt(1)).toEqual(1.5);
        expect(acc.valueAt(2)).toEqual(4);
        expect(acc.valueAt(3)).toEqual(7.5);
    });
});

describe('Multiplier', () => {
   it('should multiply its inputs', () => {
       let a: Knob = knob(5),
           m: Multiplier = mul(num(3), num(4), a);

       expect(m.valueAt(0)).toEqual(3*4*5);
       expect(m.valueAt(1)).toEqual(3*4*5);
       a.setVal(7);
       expect(m.valueAt(0)).toEqual(3*4*7);
       expect(m.valueAt(1)).toEqual(3*4*7);
   });

   it('should update its value when its child values are updated over time', () => {
       let a: Accumulator = accum(0, 0, 1, 0),
           b: Accumulator = accum(0, 0, 2, 0),
           m: Multiplier = mul(a,b);

       expect(m.valueAt(0)).toEqual(0*0);
       expect(m.valueAt(1)).toEqual(1*2);
       expect(m.valueAt(2)).toEqual(2*4);
       expect(m.valueAt(3)).toEqual(3*6);
   });
});

describe('Adder', () => {
    it('should add its inputs', () => {
        let a: Knob = knob(5),
            s: Adder = add(num(3), num(4), a);

        expect(s.valueAt(0)).toEqual(3+4+5);
        expect(s.valueAt(1)).toEqual(3+4+5);
        a.setVal(7);
        expect(s.valueAt(0)).toEqual(3+4+7);
        expect(s.valueAt(1)).toEqual(3+4+7);
    });

    it('should update its value when its child values are updated over time', () => {
        let a: Accumulator = accum(0, 0, 1, 0),
            b: Accumulator = accum(0, 0, 2, 0),
            s: Adder = add(a,b);

        expect(s.valueAt(0)).toEqual(0+0);
        expect(s.valueAt(1)).toEqual(1+2);
        expect(s.valueAt(2)).toEqual(2+4);
        expect(s.valueAt(3)).toEqual(3+6);
    });
});

describe('WeightedAverage', () => {
    it('should compute a weighted average', () => {
        let w: WeightedAverage = wghtdAvg([num(1), num(5), num(9)], [num(10), num(10), num(10)]);

        expect(w.valueAt(0)).toBeCloseTo(10/15 + 50/15 + 90/15, 10);
    });
});

describe('Clamper', () => {
    it('should clamp values within the expected range', () => {
        let x: Knob = knob(5),
            c: Clamper = clamp(x, 0, 10);

        expect(c.valueAt(0)).toEqual(5);
        x.setVal(-15);
        expect(c.valueAt(0)).toEqual(0);
        x.setVal(11);
        expect(c.valueAt(0)).toEqual(10);
    });
});

describe('Averager', () => {
    it('should correctly compute an average', () => {
        let a: Averager = avg(num(6), num(10), num(12));

        expect(a.valueAt(0)).toBeCloseTo((6+10+12)/3, 10);
    })
});

describe('DependentAccumulator', () => {
    it('should correctly compute a value that updates according to velocity', () => {
        let acc: DependentAccumulator = daccum(0, Clock.now(), ONE, ZERO);

        expect(acc.valueAt(Clock.now())).toEqual(0);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(1);
        Clock.tick();
        Clock.tick();
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(4);

    });
    it('should correctly accumulate value when velocity is changed', () => {
        let acc: DependentAccumulator = daccum(0, Clock.now(), ONE, ZERO);

        Clock.tick();
        Clock.tick();
        Clock.tick();
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(4);
        acc.changeVelocity(num(-1), Clock.now());
        Clock.tick();
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(2);
        acc.changeVelocity(num(2), Clock.now());
        Clock.tick();
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(6);
    });
    it('should correctly compute a value that updates according to acceleration', () => {
        let acc: DependentAccumulator = daccum(0, 0, ZERO, ONE);

        expect(acc.valueAt(Clock.now())).toEqual(0);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(0.5);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(2);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(4.5);
    });
    it('should correctly compute a value when acceleration is changed', () => {
        let acc: DependentAccumulator = daccum(0, 0, ZERO, ONE);

        expect(acc.valueAt(Clock.now())).toEqual(0);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(0.5);
        acc.changeAcceleration(num(-1), Clock.now());
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(1);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(0.5);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(-1);
    });
    it('should correctly compute a value that updates according to acceleration and velocity', () => {
        let acc: DependentAccumulator = daccum(0, 0, ONE, ONE);

        expect(acc.valueAt(Clock.now())).toEqual(0);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(1.5);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(4);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(7.5);
    });
    it('should update on tick when downstream velocity is updated', () => {
        let k: Knob = knob(1),
            acc: DependentAccumulator  = daccum(0, Clock.now(), k, ZERO);

        expect(acc.valueAt(Clock.now())).toEqual(0);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(1);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(2);
        k.setVal(-1);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(1);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(0);
        k.setVal(2);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(2);
    });
    it('should update on tick when downstream acceleration is updated', () => {
        let k: Knob = knob(1),
            acc: DependentAccumulator  = daccum(0, Clock.now(), ZERO, k);

        expect(acc.valueAt(Clock.now())).toEqual(0);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(0.5);
        k.setVal(-1);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(1);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(0.5);
        Clock.tick();
        expect(acc.valueAt(Clock.now())).toEqual(-1);
    })
});