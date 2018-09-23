import {accum, Accumulator, button, Button, clamp, Constant, knob, Knob, mul, TimedVal, add} from "./timed_val";
import {Clock} from "./engine";
import {Map} from "./util";

export const CODE_SKILLS: string[] = [ "Code_TwoD" , "Code_ThreeD" , "Code_Algorithm" , "Code_Audio" , "Code_Networking" , "Code_System" , "Code_Web" ];
export const DESIGN_SKILLS: string[] = [ "Design_TwoD" , "Design_ThreeD" , "Design_Algorithm" , "Design_Audio" , "Design_Networking" , "Design_System" , "Design_Web" ];
export const ART_SKILLS: string[] = [ "Code_TwoD" , "Code_ThreeD" , "Code_Audio" ];
export const BASE_SPEC_SKILLS: string[] = [ "Base_Code", "Base_Design",  "Base_Art" ];
export const LEAD_SKILL: string = "Base_Lead";
export const MARKET_SKILL: string = "Base_Market";
export const BASE_SKILLS: string[] = [...BASE_SPEC_SKILLS, LEAD_SKILL, MARKET_SKILL];
export const SKILLS: string[] = [...CODE_SKILLS, ...DESIGN_SKILLS, ...ART_SKILLS, ...BASE_SKILLS];

export class Employee {
    readonly learnRate: Knob;
    public skills: Map<Employee.SkillValue>;

    constructor(readonly createTime: number) {
        this.learnRate = knob(0);
        for (let skill in SKILLS) {
            this.skills[skill] = new Employee.SkillValue(this);
        }
    }

}

export namespace Employee {
    export class SkillValue {
        private _value: TimedVal;
        private _trainingBtn: Button;
        private _xp: Accumulator;
        private _base: Constant;

        constructor(private employee: Employee) {
            this._xp = accum(0, employee.createTime, 0.001, 0);
            this._trainingBtn = button();
            this._value = clamp(add(this._base, mul(mul(this._trainingBtn, employee.learnRate), this._xp)), 0, 100);
        }

        public get val(): number {
            return this._value.valueAt(Clock.now());
        }

        public get trainingBtn(): Button {
            return this._trainingBtn;
        }
        public get xp(): Accumulator {
            return this._xp;
        }
    };
}