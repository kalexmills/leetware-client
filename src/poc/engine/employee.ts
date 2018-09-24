import {Map} from "./util";
import {Skill, Skills} from "./skills";

export type Dichotomy = 3 | 2 | 1 | 0 | -1 |-2 | -3;

export class Employee {
    private static TICKS_PER_TRAIN = 60;

    public skills: Map<number> = {};
    public skillsBeingTrained: Set<Skill> =  new Set([]);

    public effectiveness: number;
    public learnRate: number = 0.001;
    private lastTrainTick: number;

    private workerLearner: Dichotomy;
    private independentSocial: Dichotomy;
    private lazyStressed: Dichotomy;

    private traitNames: string[];

    constructor(readonly createTime: number) {
        this.lastTrainTick = createTime;
        for (let skill in Skills.ALL) {
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