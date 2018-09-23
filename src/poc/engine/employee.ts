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
    private static TICKS_PER_TRAIN = 60;

    public skills: Map<number> = {};
    public skillsBeingTrained: Set<string> =  new Set([]);

    public learnRate: number = 0.001;
    private lastTrainTick: number;

    constructor(readonly createTime: number) {
        this.lastTrainTick = createTime;
        for (let skill in SKILLS) {
            this.skills[skill] = 0;
        }
    }

    public tick(time: number) {
        this.maybeTrain(time);
    }

    private maybeTrain(time: number) {
        if (time - this.lastTrainTick > Employee.TICKS_PER_TRAIN) {
            for (let skill in this.skillsBeingTrained) {
                this.skills[skill] += this.learnRate;
            }
            this.lastTrainTick = time;
        }
    }
}