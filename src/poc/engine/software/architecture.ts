import Feature = Architecture.Feature;

export class Architecture {
    private id: Architecture.Id;
    private name: string;
    private features: Feature[];
}

export namespace Architecture {
    export class Feature {
        private nmae: string;
        private unlockDate: Date;
        private obviates: Architecture.Feature[];
    }

    export type Id = number;
}
