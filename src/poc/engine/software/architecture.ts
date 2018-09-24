
export class Architecture {
    private id: number;
    private name: string;
}

export namespace Architecture {
    export class Feature {
        private id: number;
        private nmae: string;
        private unlockDate: Date;
        private obviates: Architecture.Feature[];
    }
}
