import {Feature} from "./feature";


export class AppClass {
    private id: AppClass.Id;
    private name: string;
    private features: Feature[];
}

export namespace AppClass {
    export type Id = number;
}