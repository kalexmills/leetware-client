import {Skill} from "../skills";

export class Language {
    private skillModifer: Map<Skill.Code, number>;
    private synergies: Language.Synergy[];
}

namespace Language {

    export type Synergy = "Functional" | "Imperative" | "Declarative" | "ObjectOriented" | "MemoryManaged" |
        "StronglyTyped" | "Unmanaged" | "WeaklyManaged";

// Any pair of synergies that lie in the same class cannot both appear in the same language.
    export const SynergyExclusionClasses: Language.Synergy[][] = [
        ["Functional", "Imperative", "Declarative"],
        ["MemoryManaged", "Unmanaged"],
        ["StronglyTyped", "WeaklyTyped"]
    ];
}