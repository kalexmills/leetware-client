import {Skills} from "../skills";

export class Feature {
    private id: Feature.Id;
    private name: String;
    private unlockDate: Date; // TODO: DO NOT use Javascript dates!!! Roll your own!
    private artWeight: Map<Skills.Art, number>;
    private codeWeight: Map<Skills.Design, number>;
    private designWeight: Map<Skills.Code, number>;
    private runtimeRequirements: Feature[];
    private prereqFor: Feature.Id[];
    private prereqOf: Feature.Id[];
    private obviates: Feature[];
}

export namespace Feature {
    export type Id = number;
}