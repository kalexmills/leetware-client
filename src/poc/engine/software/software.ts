/**
 *
 */
import {Skills} from "../skills";
import {Language} from "./language";
import {Device} from "./device";
import {Architecture} from "./architecture";
import {Feature} from "./feature";
import {AppClass} from "./app_class";

export class Software {
    private name: string;
    private sequelTo: Software;

    private designTrack: Map<Skills.Design, float>;
    private codeTrack: Map<Skills.Code, float>;
    private artTrack: Map<Skills.Art, float>;

    private bugs: Software.Bugs;

    private reqs: Software.RuntimeReqs;
    private testReqs: Software.TestReqs;
    private devReqs: Software.DevReqs;

    private supportRecord: Software.SupportRecord;

    private appClass: AppClass;
    private features: Feature[];
}
export namespace Software {
    export abstract class Bugs {
        private fixedBugs: number;
        private knownBugs: number;
        private trueBugs: number;
    }

    export class RuntimeReqs {
        private architecture: Architecture;
        private operatingSystem: OperatingSystem;
    }

    export class TestReqs {
        private devices: Device[];
    }

    export class DevReqs {
        private frameworks: Framework[];
        private libraries: Library[];
        private vcs: VCS[];
        private languages: Language[];
        private compilers: Compiler[];
        private ides: IDE[];
    }

    export class SupportRecord {
        private bugReports: number;
        private missedReports: number;
    }

}
export class Library extends Software {
    private specialization: Skills.Code;
    private language: Language;
}

export class OperatingSystem extends Software {

}

export class Framework extends Software {
    private language: Language;
    private appClass: AppClass;
    private features: Feature[];
}

export class IDE extends Software {
    private languages: Language[];
    private frameworks: Framework;
    private compilers: Compiler[];
}

export class Compiler extends Software {
    private language: Language;
    private targetArchs: Architecture[];
}

export class VCS extends Software {
}