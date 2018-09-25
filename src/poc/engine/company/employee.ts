import {Clock} from "../engine";
import {Skill} from "../skills";
import {Software} from "../software/software";
import {Workstation} from "./workstation";

// Convenience imports
import PhysicalNeeds = Employee.PhysicalNeeds;
import Dichotomy = Employee.Dichotomy;
import XPTrack = Employee.XPTrack;
import Proficiency = Employee.Proficiency;
import Id = Workstation.Id;
import {LazyGainer} from "../util";

export class Employee {
    private id: Id.Number;
    private skills: Map<Skill, number>;
    private xp: Map<Skill, XPTrack>;
    private physicalNeeds: PhysicalNeeds;

    private independentSocial: Dichotomy;
    private workLearn: Dichotomy

    private proficiencies: Map<Software.Id, Proficiency>;
    private profXPs: Map<Software.Id, XPTrack>;

    private workstation: Workstation;
}

export namespace Employee {
    export const NoOne: Employee = null;

    export type Id = number;

    export class PhysicalNeeds {
        private lastPooAt: Clock.Tick;
        private lastMealAt: Clock.Tick;
        private startOfDayAt: Clock.Tick;
        private lastMeetingAt: Clock.Tick;
    }

    /**
     * Constantly-gaining XP track.
     */
    export class XPTrack extends LazyGainer {
        private cachedGainRate: number = 0;
        private isTraining: boolean = false;


    }

    export type Dichotomy = 3 | 2 | 1 | 0 | -1 |-2 | -3;

    export type Proficiency = "Not Proficient" | "Proficient" | "Professional" | "Expert" | "Guru";
}
