import {Software} from "../software/software";
import {AppClass} from "../software/app_class";

export class Task {
    public readonly type: Task.Type
}

export namespace Task {

    export type Type = "Design" | "Write" | "Test" | "Support" | "Market" | "Research" | "Port";

    class SoftwareTask extends Task {
        protected readonly software: Software;
    }

    export class Design extends SoftwareTask {
        public readonly type: Type = "Design";
    }

    export class Write extends SoftwareTask {
        public readonly type: Type = "Write";
    }

    export class Test extends SoftwareTask {
        public readonly type: Type = "Test";
    }

    export class Support extends SoftwareTask {
        public readonly type: Type = "Support";
    }

    export class Market extends SoftwareTask {
        public readonly  type: Type = "Market";
    }

    export class Port extends SoftwareTask {
        public readonly  type: Type = "Port";
    }

    export class Research extends Task {
        public readonly  type: Type = "Research";
        private feature: AppClass.Feature[];
    }
}
