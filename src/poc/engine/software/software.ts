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
    private id: Software.Id;
    private name: string;
    private sequelTo: Software;

    private designTrack: Map<Skills.Design, number>;
    private codeTrack: Map<Skills.Code, number>;
    private artTrack: Map<Skills.Art, number>;

    private bugs: Software.Bugs;

    private reqs: Software.RuntimeDeps;
    private testReqs: Software.TestDeps;
    private devReqs: Software.DevDeps;

    private supportRecord: Software.SupportReports;

    private appClass: AppClass;
    private features: Feature[];
}
export namespace Software {
    export type Id = number;

    export abstract class Bugs {
        private fixedBugs: number;
        private knownBugs: number;
        private trueBugs: number;
    }

    export class RuntimeDeps {
        private architecture: Architecture;
        private operatingSystem: OperatingSystem;
    }

    export class TestDeps {
        private devices: Device[];
    }

    export class DevDeps {
        private frameworks: Framework[];
        private libraries: Library[];
        private vcs: VCS[];
        private languages: Language[];
        private compilers: Compiler[];
        private ides: IDE[];
    }

    export class SupportReports {
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

export class VCS extends Software {
}

export class Framework extends Software {
    private language: Language;
    private forAppClass: AppClass;
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

export class Language extends Software {
    private skillModifer: Map<Skills.Code, number>;
    private synergies: Language.Synergy[];
}

namespace Language {

    export type Synergy = "Functional" | "Imperative" | "Declarative" | "ObjectOriented" | "MemoryManaged" |
        "StronglyTyped" | "Unmanaged" | "WeaklyManaged" | "Assembly" | "Compiled";

// Any pair of synergies that lie in the same class cannot both appear in the same language.
    export const SynergyExclusionClasses: Language.Synergy[][] = [
        ["Functional", "Imperative", "Declarative"],
        ["MemoryManaged", "Unmanaged"],
        ["StronglyTyped", "WeaklyTyped"],
        ["Assembly", "Compiled"]
    ];
}